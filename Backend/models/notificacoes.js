const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notificacoes = sequelize.define('Notificacoes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    mensagem: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: ''
    },

    tipo: {
        type: DataTypes.STRING(12),
        allowNull: false,
        defaultValue: ''
    },

    data_criacao: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Notificacoes;
