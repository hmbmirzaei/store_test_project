const asyncRedis = require(`async-redis`);
const funcs = {
	err: (msg, status) => {
		let e = new Error(msg);
		e.msg = msg || null;
		e.status = status || 400;
		throw e
	},
	log: console.log,
	today: () => {
		const date = new Date();
		let t
		t = date.toLocaleDateString('fa-IR').replace(/([۰-۹])/g, token => String.fromCharCode(token.charCodeAt(0) - 1728))
		t = t.split('/');
		t = `${t[0]}/${t[1] < 10 ? '0' : ''}${t[1]}/${t[2] < 10 ? '0' : ''}${t[2]}`;
		return t;
	},
	now: d => {
		d = d ? new Date(d) : new Date();
		const h = d.getHours();
		const m = d.getMinutes();
		const s = d.getSeconds();
		return `${h < 10 ? '0' : ''}${h}-${m < 10 ? '0' : ''}${m}-${s < 10 ? '0' : ''}${s}`
	},
	resp: async (func, s) => {
		try {
			s.json(await func)
		} catch (error) {
			console.log(`${error}`);
			let { status, msg } = error;
			s.status(status || 400).json(msg || 'خطا');
		}
	},
	redis: index => asyncRedis.createClient({
		host: 'localhost',
		db: index
	}),
	check_id: id => /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/.test(`${id}`.toUpperCase()),
	make_number: (length = 6) => {
		if (isNaN(length))
			length = 6;
		var result = '';
		var characters = '0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++)
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		return result;
	},
	strongPassword: password => new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})').test(password) ? true : funcs.err('weak password'),
	isEmail: email=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
};
module.exports = funcs;