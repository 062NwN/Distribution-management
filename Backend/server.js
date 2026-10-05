const express = require('express');
const cors = require('cors');

require("dotenv").config();

const PORT = process.env.PORT;

const app = express();

const produtosRouter = require('./routes/produtos');
const cadastrosRouter = require('./routes/cadastros');

app.use(express.json());
app.use(cors());

app.use('/produtos', produtosRouter);
app.use('/cadastros', cadastrosRouter);

app.listen(PORT, () => {
    console.log("Servidor rodando na porta, ", PORT);
})

