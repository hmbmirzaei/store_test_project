const { auth: { check, try_register, confirm, login }, util: { resp } } = require('../controller');
const funcs = {
	try_register: async (r, s) => resp(try_register(r.body), s),
	confirm: async (r, s) => resp(confirm(r.params.token), s),
	login: async (r, s) => resp(login(r.body.email, r.body.password), s),
	check: async (r, s, n) => {
		try {
			r.user = await check(r.headers.token);
			n();
		} catch (error) {
			s.status(error.status || 401).json(error.msg || 'عدم احراز هویت');
		}
	},
}
module.exports = funcs;