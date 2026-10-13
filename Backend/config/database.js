const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("distri_manager", "root", "181201", {
    host: "localhost",
    dialect: "mysql",
    logging: false
});

module.exports = sequelize;