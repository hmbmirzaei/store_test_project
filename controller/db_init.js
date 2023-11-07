
const { err } = require('./util');
const funcs = {
	init: async () => {
		try {
			const db = require('../config/database');
			const user = require('../models/user');
			const product = require('../models/product');
			product.belongsTo(user, { foreignKey: 'user_id' });
			await db.sync({ logging: false });
			return 'done'
		} catch (error) {
			err('error in database init');
		}
	}
}
module.exports = funcs;
