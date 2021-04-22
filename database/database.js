const sequelize = require("sequelize");

const connection = new sequelize('guiaperguntas', 'root', 'cajati2011', {
        host: 'localhost',
        dialect: 'mysql'
})

module.exports = connection