const express = require("express");
const router = express.Router();

const VendaItem = require("../models/VendaItem");

router.get("/:id/vendas", async (req, res) => {
  try {
    const { id } = req.params;

    const itens = await VendaItem.findAll({
      where: {
        venda_id: id,
      },
    });

    return res.status(200).json({ itens });
  } catch (error) {
    console.error("Erro ao buscar itens:", error);

    return res.status(500).json({
      mensagem: "Erro ao encontrar itens da venda.",
    });
  }
});

module.exports = router;
