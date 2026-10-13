const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const Venda = sequelize.define(
    'Venda',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        quantidade_produto: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        sub_total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0 }
        },

        desconto: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0 }
        },

        total_compra: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
            validate: { min: 0 }
        },

        metodo_compra: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: { isIn: [['Dinheiro', 'Cartão', 'Pix', 'Outros']] }
        },

        outro_metodo_compra: {
            type: DataTypes.STRING(60),
            allowNull: false,
            defaultValue: ''
        },

        data_criacao: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'vendas',
        timestamps: false
    }
);

module.exports = Venda;