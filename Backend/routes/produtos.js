const express = require("express");

const router = express.Router();

const Produto = require('../models/produto');
const Upload = require('../config/uploads');

router.get("/", async (req, res) => {

    try {
        const produtos = await Produto.findAll();

        const totalProdutos = produtos.length;

        res.json({
            produtos,
            totalProdutos
        });

    } catch (error) {
        console.error('Erro ao buscar produto' + error)

        res.status(500).json({
            mensagem: "Erro ao buscar produto"
        })
    }
});

router.post("/", Upload.single("imagem"), async (req, res) => {
    try {
        const {
            nome,
            sku,
            codigo_barras,
            descricao,
            marca,
            categoria,
            subcategoria,
            unidade_medida,
            fator_conversao,
            tipo_produto,
            estoque_inicial,
            estoque_minimo,
            data_fabricacao,
            data_validade,
            lote,
            preco_compra,
            preco_adicional,
            preco_venda,
            preco_promocional,
            custo_total,
            margem_lucro,
            ncm,
            cest,
            origem,
            cfop,
            cst,
            csosn,
            fornecedor,
            quantidade_minima_compra,
            unidade_medida_compra,
            quantidade_unidade_compra,
            frete,
            condicao_pagamento
        } = req.body;

        let imagem = null;

        if (req.file) {
            imagem = `uploads/produtos/${req.file.filename}`;
        }

        const precoPromocionalFinal = preco_promocional === "" ? 0 : Number(preco_promocional);

        const produto = await Produto.create({
            imagem,
            nome,
            sku,
            codigo_barras,
            descricao,
            marca,
            categoria,
            subcategoria,
            unidade_medida,
            fator_conversao,
            tipo_produto,
            estoque_inicial,
            estoque_minimo,
            data_fabricacao,
            data_validade,
            lote,
            preco_compra,
            preco_adicional,
            preco_venda,
            preco_promocional: precoPromocionalFinal,
            custo_total,
            margem_lucro,
            ncm,
            cest,
            origem,
            cfop,
            cst,
            csosn,
            fornecedor,
            quantidade_minima_compra,
            unidade_medida_compra,
            quantidade_unidade_compra,
            frete,
            condicao_pagamento,
            data_criacao: new Date().toISOString(),
            data_alteracao: new Date().toISOString(),
            total_estoque: estoque_inicial,
            status: "ativo"
        });

        return res.status(201).json(produto);

    } catch (error) {
        console.error('Erro ao cadastrar produto' + error);

        res.status(500).json({
            mensagem: "Erro ao cadastrar produto.",
            erro: error.message
        })
    }
});

router.put("/:id", Upload.single("imagem"), async (req, res) => {
    try {
        const { id } = req.params;

        const produto = await Produto.findByPk(id);

        if (!produto) {
            return res.status(404).json({
                mensagem: "Produto não encontrado."
            });
        }

        const dadosAtualizados = { ...req.body };

        // Trata campos numéricos opcionais vazios
        const camposOpcionais = [
            "preco_promocional",
            "frete"
        ];

        camposOpcionais.forEach((campo) => {
            if (dadosAtualizados[campo] === "") {
                dadosAtualizados[campo] = null;
            }
        });

        // Atualiza a imagem somente se uma nova foi enviada
        if (req.file) {
            dadosAtualizados.imagem =
                `uploads/produtos/${req.file.filename}`;
        } else {
            delete dadosAtualizados.imagem;
        }

        await produto.update(dadosAtualizados);

        return res.status(200).json({
            mensagem: "Produto atualizado com sucesso.",
            produto
        });

    } catch (error) {
        console.error("Erro ao atualizar produto:", error);

        return res.status(500).json({
            mensagem: "Erro ao atualizar produto.",
            erro: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const produto = await Produto.findByPk(id);

        if (!produto) {
            res.status(404).json({
                mensagem: "Erro ao encontrar id produto"
            })
        }

        await produto.destroy();

        res.status(200).json({
            mensagem: "Produto Deletado com sucesso"
        })

    } catch (error) {
        console.error("Erro ao deletar produto" + error)
        res.status(500).json({
            mensagem: "Erro ao deletar produto"
        })
    }
});

module.exports = router;