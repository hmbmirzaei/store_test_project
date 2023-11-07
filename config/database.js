const { Sequelize } = require('sequelize');

const db = new Sequelize({
    dialect: 'sqlite',
    storage: 'store.db', // Database file name
    logging: false,
});

module.exports = db;