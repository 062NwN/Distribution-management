const express = require("express");

const router = express.Router();

router.get("/unMedidaVD", async (req, res) => {
    const response = await fetch("http://localhost:8080/unMedidaVD");
    const data = await response.json();

    res.json(data);
});

router.get("/unMedidaCP", async (req, res) => {
    const response = await fetch("http://localhost:8080/unMedidaCP");
    const data = await response.json();

    res.json(data);
});

router.get("/tipoProduto", async (req, res) => {
    const response = await fetch("http://localhost:8080/tipoProduto");
    const data = await response.json();

    res.json(data);
});

router.get("/setFornecedor", async (req, res) => {
    const response = await fetch("http://localhost:8080/setFornecedor");
    const data = await response.json();

    res.json(data);
});

module.exports = router;