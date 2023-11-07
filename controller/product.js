const { product, user } = require('../models');
const funcs = {
	add: async (user_id, title, descr) => {
		const p = await product.create({
			title,
			descr,
			date: new Date,
			user_id
		});
		return p.id
	},
	list: async (page, per_page, user_id) => {
		const where = user_id ? { id: user_id } : {};
		const finder = {
			limit: per_page,
			offset: page * per_page,
			include: {
				model: user,
				where
			},
			sort: [['date', 'asc']]
		};
		const results = await product.findAll(finder);
		return results.map(({ id, title, descr, date, user: { first_name, last_name } }) => {
			return {
				id,
				title,
				descr,
				date,
				owner: `${first_name} ${last_name}`
			}
		})
	}
};
module.exports = funcs