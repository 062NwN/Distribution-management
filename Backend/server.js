const express = require('express');
const cors = require('cors');

require("dotenv").config();

const PORT = process.env.PORT;

const app = express();

const produtosRouter = require('./routes/produtos');
const cadastrosRouter = require('./routes/cadastros');
const notificacoesRouter = require('./routes/notificacoes');
const vendasRouter = require('./routes/vendas');

app.use(express.json());
app.use(cors());

app.use('/produtos', produtosRouter);
app.use('/cadastros', cadastrosRouter);
app.use('/notificacoes', notificacoesRouter);
app.use('/vendas', vendasRouter);

app.listen(PORT, () => {
    console.log("Servidor rodando na porta, ", PORT);
})

