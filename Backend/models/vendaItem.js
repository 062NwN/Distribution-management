const { DataTypes } = require('sequelize');

const sequelize = require('../config/database');

const VendaItem = sequelize.define(
    'VendaItem',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        venda_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'vendas',
                key: 'id'
            },
            onDelete: 'CASCADE'
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

        preco_venda: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: { min: 0 }
        },

        quantidade: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1 }
        }
    },
    {
        tableName: 'venda_itens',
        timestamps: false
    }
);

module.exports = VendaItem;