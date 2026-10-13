
const express = require('express');
const router = express.Router();

const Produto = require('../models/produto');
const Venda = require('../models/venda');
const VendaItem = require('../models/vendaItem');
const sequelize = require('../config/database');

router.get("/", async (req, res) => {
    try {
        const vendas = await Venda.findAll();

        res.status(200).json({vendas});
    } catch (error) {
        console.error('Erro ao buscar vendas:', error);

        res.status(502).json({
            mensagem: 'Não foi possível buscar as vendas.'
        });
    }
});

router.post('/', async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const {
            produtos,
            quantidade_produto,
            sub_total,
            desconto,
            total_compra,
            metodo_compra,
            outro_metodo_compra
        } = req.body;

        if (!Array.isArray(produtos) || produtos.length === 0) {
            await t.rollback();

            return res.status(400).json({
                mensagem: 'Erro, selecione pelo menos um produto para vender.'
            });
        }

        const itensValidados = [];

        // Percorre cada produto da venda
        for (const produto of produtos) {
            const quantidade = Number(produto?.quantidade);
            const idProduto = Number(produto?.id);

            if (
                !Number.isSafeInteger(idProduto) ||
                idProduto <= 0 ||
                !Number.isSafeInteger(quantidade) ||
                quantidade <= 0
            ) {
                await t.rollback();

                return res.status(400).json({
                    mensagem: 'Produto inválido ou quantidade não informada.'
                });
            }

            // Busca o produto no banco
            const produtoBanco = await Produto.findByPk(produto.id, {
                transaction: t,
                lock: t.LOCK.UPDATE
            });

            if (!produtoBanco) {
                await t.rollback();

                return res.status(404).json({
                    mensagem: `Produto ${idProduto} não encontrado.`
                });
            }

            const estoqueAtual = Number(produtoBanco.total_estoque);

            // Não permite estoque negativo
            if (quantidade > estoqueAtual) {
                await t.rollback();

                return res.status(400).json({
                    mensagem: `Estoque insuficiente para ${produtoBanco.nome}.`
                });
            }

            itensValidados.push({
                id: produtoBanco.id,
                nome: produtoBanco.nome,
                preco_venda: Number(produtoBanco.preco_venda),
                quantidade,
                novoEstoque: estoqueAtual - quantidade,
                produtoBanco
            });
        }

        // Atualiza o estoque
        for (const item of itensValidados) {
            await item.produtoBanco.update(
                {
                    total_estoque: item.novoEstoque
                },
                {
                    transaction: t
                }
            );
        }

        // Cria o registro da venda
        const vendaCriada = await Venda.create(
            {
                quantidade_produto,
                sub_total,
                desconto,
                total_compra,
                metodo_compra,
                outro_metodo_compra,
                itens: itensValidados.map((item) => ({
                    produto_id: item.id,
                    produto_nome: item.nome,
                    preco_venda: item.preco_venda,
                    quantidade: item.quantidade
                }))
            },
            {
                include: [
                    {
                        model: VendaItem,
                        as: 'itens'
                    }
                ],
                transaction: t
            }
        );

        await t.commit();

        return res.status(201).json({
            mensagem: 'Venda registrada com sucesso!',
            venda: vendaCriada
        });

    } catch (error) {
        if (!t.finished) {
            await t.rollback();
        }

        console.error('Não foi possível registrar venda!', error);

        return res.status(500).json({
            mensagem: 'Erro ao registrar venda.',
            erro: error.message
        });
    }
});

module.exports = router;
