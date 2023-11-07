const { product: { add, list }, util: { resp } } = require('../controller');
const funcs = {
	add: async (r, s) => resp(add(r.user.id, r.body.title, r.body.descr), s),
	mine: async (r, s) => resp(list(r.params.page, r.params.per_page, r.user.id), s),
	list: async (r, s) => resp(list(r.params.page, r.params.per_page), s),
};
module.exports = funcs;