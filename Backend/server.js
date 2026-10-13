const express = require('express');
const cors = require('cors');
const path = require('path');

require("dotenv").config();

const PORT = process.env.PORT;

const app = express();

const sequelize = require('./config/database');

const produtosRouter = require('./routes/produtos');
const cadastrosRouter = require('./routes/cadastros');
const notificacoesRouter = require('./routes/notificacoes');
const vendasRouter = require('./routes/vendas');
const movimentacoes = require('./routes/movimentacoes');
const associacoes = require('./models/associacoes');

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, "uploads")))

app.use('/produtos', produtosRouter);
app.use('/cadastros', cadastrosRouter);
app.use('/notificacoes', notificacoesRouter);
app.use('/vendas', vendasRouter);
app.use('/movimentacoes', movimentacoes);

app.use((req, res) => {
    res.status(404).json({
        mensagem: `Rota não encontrada: ${req.method} ${req.originalUrl}`
    });
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({ mensagem: 'Erro interno no servidor.' });
});

sequelize.authenticate()
    .then(() => sequelize.sync())
    .then(() => {
        app.listen(PORT, () => {
            console.log("Servidor rodando na porta,", PORT);
        });
    })
    .catch((error) => {
        console.error("Erro ao conectar no banco:", error);
    });
