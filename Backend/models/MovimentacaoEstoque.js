const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const MovimentacaoEstoque = sequelize.define(
    'MovimentacaoEstoque',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        produto_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'produtos',
                key: 'id'
            },
            onDelete: 'SET NULL'
        },

        produto_nome: {
            type: DataTypes.STRING(120),
            allowNull: false
        },

        tipo: {
            type: DataTypes.ENUM('ENTRADA', 'SAIDA'),
            allowNull: false
        },

        quantidade: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        estoque_anterior: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        estoque_posterior: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        motivo: {
            type: DataTypes.STRING(60),
            allowNull: false
        },

        descricao: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ''
        },

        data_movimentacao: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'movimentacoes_estoque',
        timestamps: false
    }
);

module.exports = MovimentacaoEstoque;