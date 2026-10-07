const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
    try{
        const response = await fetch('http://localhost:8080/notificacoes');

        if(!response.ok) {
           return res.status(response.status).json({ mensagem: "Erro ao buscar notificações." });
        }

        const data = await response.json();

        res.status(200).json(data);
    }catch (error) { 
        res.status(500).json({ mensagem: "Erro ao buscar notificações.", error: error.message });
    }
});


router.post('/', async (req, res) => {
    try{
        const { mensagem, tipo } = req.body;

        const notificacao = {
            mensagem,
            tipo,
            date: new Date()
        }

        const response = await fetch('http://localhost:8080/notificacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notificacao)
        });

        const data = await response.json();

        console.log('Resposta do backend:', data);

        // Process the notification data here
        res.status(201).json({ mensagem: "Notificação criada com sucesso!" });
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao criar notificação.", error: error.message });
    }

});

router.delete('/', async (req, res) => {
    try {
        const response = await fetch('http://localhost:8080/notificacoes');

        if (!response.ok) {
            return res.status(response.status).json({ mensagem: "Erro ao limpar notificações." });
        }

        const notificacoes = await response.json();

        for (const notificacao of notificacoes) {

            await fetch(`http://localhost:8080/notificacoes/${notificacao.id}`, {
                method: 'DELETE',
            });
        }

        res.status(200).json({ mensagem: "Notificações limpas com sucesso!" });
    } catch (error) {
        res.status(500).json({ mensagem: "Erro ao limpar notificações.", error: error.message });
    }
});

module.exports = router;