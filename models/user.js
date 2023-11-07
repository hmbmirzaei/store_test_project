const { DataTypes: { STRING } } = require('sequelize');
const db = require('../config/database');

module.exports = db.define('user', {
	first_name: {
		type: STRING,
		allowNull: false,
	},
	last_name: {
		type: STRING,
		allowNull: false,
	},
	email: {
		type: STRING,
		allowNull: false,
	},
	password: {
		type: STRING,
		allowNull: false,
	}
}, { timestamps: false });