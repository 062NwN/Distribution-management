const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
    const response = await fetch("http://localhost:8080/produtos");

    const produtos = await response.json();

    const totalProdutos = produtos.length;

    res.json({
        produtos,
        totalProdutos
    });
});

router.post("/", async (req, res) => {

    const {
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

    const produto = {
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
        condicao_pagamento,
        data_criacao: new Date().toISOString(),
        data_alteracao: new Date().toISOString(),
        total_estoque: estoque_inicial,
        status: "ativo"
    };

    const response = await fetch("http://localhost:8080/produtos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    });

    const data = await response.json();

    if (!response.ok) {
        return res.status(response.status).json(data);
    }

    res.status(201).json(data);
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;

    const response = await fetch(
        `http://localhost:8080/produtos/${id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        return res.status(response.status).json(data);
    }

    res.json(data);
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const response = await fetch(
        `http://localhost:8080/produtos/${id}`,
        {
            method: "DELETE"
        }
    );

    if (!response.ok) {
        return res.status(response.status).json({
            erro: "Não foi possível deletar o produto!"
        });
    }

    res.status(204).send();
});

module.exports = router;