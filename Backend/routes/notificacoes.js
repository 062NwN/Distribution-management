const express = require('express');

const router = express.Router();

const Notificacoes = require('../models/notificacoes');

router.get('/', async (req, res) => {
    try {
        const notificacoes = await Notificacoes.findAll();

        return res.status(200).json({ notificacoes });

    } catch (error) {
        console.error('ERRO COMPLETO:', error);

        return res.status(500).json({
            mensagem: 'Erro ao buscar notificações.',
            erro: error.message,
            sql: error.sql
        });
    }
});


router.post('/', async (req, res) => {
    try {
        const { mensagem, tipo } = req.body;

        const notificacao = await Notificacoes.create(
            {
                mensagem,
                tipo,
            }
        );

        res.status(201).json(
            {
                mensagem: "Notificação criada com sucesso!",
                notificacao: notificacao
            }
        );
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao criar notificação.", error: error.message });
    }

});

router.delete('/', async (req, res) => {
    try {
        const totalNotificacoes = await Notificacoes.count();

        if (totalNotificacoes === 0) {
            res.status(404).json({
                mensagem: "Erro nenhuma notificacao encontrada."
            })
        }

        await Notificacoes.destroy({
            where: {}
        });

        res.status(200).json({ mensagem: "Notificações limpas com sucesso!" });
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao limpar notificações.", error: error.message });
    }
});

module.exports = router;