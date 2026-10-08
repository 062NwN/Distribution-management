const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {
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
            return res.status(400).json({
                mensagem: 'Erro, selecione pelo menos um produto para vender.'
            });
        }

        // Percorre cada produto da venda
        for (const produto of produtos) {

            if (!produto || !produto.id || !produto.quantidade) {
                return res.status(400).json({
                    mensagem: 'Produto inválido ou quantidade não informada.'
                });
            }

            // Busca o produto no banco
            const responseProduto = await fetch(
                `http://localhost:8080/produtos/${produto.id}`
            );

            if (!responseProduto.ok) {
                return res.status(404).json({
                    mensagem: `Produto ${produto.nome} não encontrado.`
                });
            }

            const produtoBanco = await responseProduto.json();

            // Calcula o novo estoque
            const novoEstoque =
                produtoBanco.total_estoque - produto.quantidade;

            // Não permite estoque negativo
            if (novoEstoque < 0) {
                return res.status(400).json({
                    mensagem: `Estoque insuficiente para ${produto.nome}.`
                });
            }

            // Atualiza o estoque
            const responseEstoque = await fetch(
                `http://localhost:8080/produtos/${produto.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        total_estoque: novoEstoque
                    })
                }
            );

            if (!responseEstoque.ok) {
                return res.status(500).json({
                    mensagem: `Não foi possível atualizar o estoque de ${produto.nome}.`
                });
            }
        }

        // Cria o registro da venda
        const venda = {
            produtos,
            quantidade_produto,
            sub_total,
            desconto,
            total_compra,
            metodo_compra,
            outro_metodo_compra,
            data_criacao: new Date().toISOString()
        };

        const responseVenda = await fetch(
            'http://localhost:8080/vendas',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(venda)
            }
        );

        if (!responseVenda.ok) {
            return res.status(500).json({
                mensagem: 'Não foi possível registrar a venda.'
            });
        }

        const vendaCriada = await responseVenda.json();

        res.status(201).json({
            mensagem: 'Venda registrada com sucesso!',
            venda: vendaCriada
        });

    } catch (error) {
        console.log('Não foi possível registrar venda!', error);

        res.status(500).json({
            mensagem: 'Erro ao registrar venda.',
            erro: error.message
        });
    }
});

module.exports = router;