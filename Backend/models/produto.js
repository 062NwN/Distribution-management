const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Produto = sequelize.define("Produto", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    imagem: {
        type: DataTypes.STRING(255),
        allowNull: true
    },

    nome: {
        type: DataTypes.STRING(120),
        allowNull: false
    },

    sku: {
        type: DataTypes.STRING(30),
        unique: true
    },

    codigo_barras: {
        type: DataTypes.STRING(20),
        unique: true
    },

    descricao: {
        type: DataTypes.STRING(255)
    },

    marca: {
        type: DataTypes.STRING(40)
    },

    categoria: {
        type: DataTypes.STRING(30)
    },

    subcategoria: {
        type: DataTypes.STRING(30)
    },

    unidade_medida: {
        type: DataTypes.STRING(10)
    },

    fator_conversao: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },

    tipo_produto: {
        type: DataTypes.STRING(30)
    },

    estoque_inicial: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    total_estoque: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },

    estoque_minimo: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    estoque_seguranca: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    data_fabricacao: {
        type: DataTypes.DATEONLY
    },

    data_validade: {
        type: DataTypes.DATEONLY
    },

    lote: {
        type: DataTypes.STRING(30)
    },

    preco_compra: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },

    preco_adicional: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },

    custo_total: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },

    preco_venda: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },

    preco_promocional: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },

    margem_lucro: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },

    ncm: {
        type: DataTypes.STRING(10)
    },

    cest: {
        type: DataTypes.STRING(10)
    },

    origem: {
        type: DataTypes.STRING(5)
    },

    cfop: {
        type: DataTypes.STRING(10)
    },

    cst: {
        type: DataTypes.STRING(5)
    },

    csosn: {
        type: DataTypes.STRING(5)
    },

    fornecedor: {
        type: DataTypes.STRING(100)
    },

    quantidade_minima_compra: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    unidade_medida_compra: {
        type: DataTypes.STRING(10)
    },

    quantidade_unidade_compra: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },

    frete: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },

    condicao_pagamento: {
        type: DataTypes.STRING(50)
    },

    status: {
        type: DataTypes.STRING(10),
        defaultValue: "ativo"
    },

    data_criacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    data_alteracao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "produtos",
    timestamps: false
});

module.exports = Produto;
