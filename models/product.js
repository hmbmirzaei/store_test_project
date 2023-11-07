const { DataTypes: { TEXT, STRING, DATE } } = require('sequelize');
const db = require('../config/database');

module.exports =  db.define('product', {
	title: {
		type: STRING,
		allowNull: false,
	},
	descr: {
		type: TEXT,
		allowNull: false,
	},
	date: {
		type: DATE,
		allowNull: false,
	}
}, { timestamps: false });