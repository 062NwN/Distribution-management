const express = require('express');

const router = express.Router();

const { movimentarEstoque } = require('../services/movimentacaoService');

const MovimentacaoEstoque = require('../models/MovimentacaoEstoque');

router.get('/', async (req, res) => {
    try {
        const { produto_id } = req.query;

        const movimentacoes = await MovimentacaoEstoque.findAll({
            where: produto_id ? { produto_id } : {},
            order: [['data_movimentacao', 'DESC']]
        });

        res.json(movimentacoes);
    } catch (error) {
        console.error('Erro ao buscar movimentações:', error);

        res.status(500).json({
            mensagem: 'Não foi possível buscar as movimentações.'
        });
    }
});

router.patch('/:id/estoque', async (req, res) => {
    try {
        const { tipo, quantidade, motivo, descricao } = req.body;

        const resultado = await movimentarEstoque({
            produtoId: req.params.id,
            tipo,
            quantidade,
            motivo,
            descricao
        });

        return res.status(200).json({
            mensagem: 'Movimentação registrada com sucesso.',
            produto: resultado.produto,
            movimentacao: resultado.movimentacao
        });
    } catch (error) {
        console.error('Erro ao movimentar estoque:', error);

        return res.status(error.status || 500).json({
            mensagem: error.status
                ? error.message
                : 'Não foi possível concluir a movimentação.'
        });
    }
});

module.exports = router;