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

let filaMovimentacoes = Promise.resolve();

function executarNaFila(operacao) {
    const resultado = filaMovimentacoes.then(operacao);

    filaMovimentacoes = resultado.catch(() => {});

    return resultado;
}


router.patch("/:id/estoque", async (req, res) => {
    const { id } = req.params;
    const { tipo, quantidade, motivo, descricao = "" } = req.body;

    if (
        !Number.isSafeInteger(quantidade) ||
        quantidade <= 0
    ) {
        return res.status(400).json({
            mensagem: "Informe uma quantidade inteira válida."
        });
    }

    if (!["ENTRADA", "SAIDA"].includes(tipo)) {
        return res.status(400).json({
            mensagem: "Tipo de movimentação inválido."
        });
    }

    if (typeof motivo !== "string" || !motivo.trim()) {
        return res.status(400).json({
            mensagem: "Selecione o motivo da movimentação."
        });
    }

    if (typeof descricao !== "string") {
        return res.status(400).json({
            mensagem: "A observação é inválida."
        });
    }

    try {
        const resultado = await executarNaFila(async () => {
            const consulta = await fetch(
                `http://localhost:8080/produtos/${id}`
            );

            if (consulta.status === 404) {
                const erro = new Error("Produto não encontrado.");
                erro.status = 404;
                throw erro;
            }

            if (!consulta.ok) {
                throw new Error("Erro ao consultar produto.");
            }

            const produto = await consulta.json();
            const estoqueAtual = Number(produto.total_estoque);

            if (
                !Number.isSafeInteger(estoqueAtual) ||
                estoqueAtual < 0
            ) {
                throw new Error("Estoque atual inválido.");
            }

            if (tipo === "SAIDA" && quantidade > estoqueAtual) {
                const erro = new Error("Estoque insuficiente.");
                erro.status = 409;
                throw erro;
            }

            const novoEstoque = tipo === "ENTRADA"
                ? estoqueAtual + quantidade
                : estoqueAtual - quantidade;

            if (!Number.isSafeInteger(novoEstoque)) {
                const erro = new Error("Saldo final inválido.");
                erro.status = 400;
                throw erro;
            }

            const produtoAtualizado = {
                ...produto,
                total_estoque: novoEstoque,
                data_alteracao: new Date().toISOString()
            };

            const atualizacao = await fetch(
                `http://localhost:8080/produtos/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(produtoAtualizado)
                }
            );

            if (!atualizacao.ok) {
                throw new Error("Erro ao atualizar o estoque.");
            }

            const produtoSalvo = await atualizacao.json();

            const movimentacao = {
                produto_id: produto.id,
                produto_nome: produto.nome,
                tipo,
                quantidade,
                estoque_anterior: estoqueAtual,
                estoque_posterior: novoEstoque,
                motivo: motivo.trim(),
                descricao: descricao.trim(),
                data_movimentacao: new Date().toISOString()
            };

            try {
                const registro = await fetch(
                    "http://localhost:8080/movimentacoes_estoque",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(movimentacao)
                    }
                );

                if (!registro.ok) {
                    throw new Error("Erro ao registrar movimentação.");
                }

                const movimentacaoSalva = await registro.json();

                return {
                    produto: produtoSalvo,
                    movimentacao: movimentacaoSalva
                };
            } catch (erroHistorico) {
                // Tenta desfazer a atualização caso o histórico falhe.
                try {
                    const restauracao = await fetch(
                        `http://localhost:8080/produtos/${id}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(produto)
                        }
                    );

                    if (!restauracao.ok) {
                        throw new Error("Falha na restauração.");
                    }
                } catch (erroRestauracao) {
                    console.error(
                        "ATENÇÃO: não foi possível restaurar o estoque.",
                        erroRestauracao
                    );
                }

                throw erroHistorico;
            }
        });

        return res.status(200).json({
            mensagem: "Movimentação registrada com sucesso.",
            produto: resultado.produto,
            movimentacao: resultado.movimentacao
        });
    } catch (error) {
        console.error("Erro ao movimentar estoque:", error);

        return res.status(error.status || 502).json({
            mensagem: error.status
                ? error.message
                : "Não foi possível concluir a movimentação."
        });
    }
});


module.exports = router;