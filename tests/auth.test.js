const matchers = require('jest-extended');
expect.extend(matchers);

const er = (txt, status) => { return { msg: txt, status: status || 400 } };
const { auth: { check, try_register, confirm, login } } = require('../controller');
const { iD, str, date } = require('./util');
let try_register_temp_token;
let login_token;
let user = {
	first_name: 'first_name',
	last_name: 'last_name',
	email: 'e@ma.il',
	password: '123qQ#@!',
	confirm: '123qQ#@!'
}
const funcs = {
	try_register: () => describe("'try_register' function", () => {
		let url, expires;
		test('valid data', async () => {
			const tr = await try_register(user);
			url = tr.url;
			expires = tr.expires;
			try_register_temp_token = tr.token
			str(url);
			date(expires);
		});
		test('missing some data', async () => {
			try {
				await try_register({
					first_name: user.first_name,
					last_name: user.last_name,
					email: user.email,
					confirm: user.confirm
				})
			} catch (error) {
				expect(error).toMatchObject(er('missing input parameters'))
			}
		});
		test('weak password', async () => {
			try {
				await try_register({
					first_name: user.first_name,
					last_name: user.last_name,
					email: user.email,
					password: 'ddd',
					confirm: 'ddd'
				})
			} catch (error) {
				expect(error).toMatchObject(er('weak password'))
			}
		});
		test('duplicate try register', async () => {
			try {
				await try_register(user)
			} catch (error) {
				expect(error).toMatchObject(er('please wait max 3600 minutes before retry register'))
			}
		});
	}),
	confirm: () => describe("'confirm' function", () => {
		test('valid data', async () => {
			const c = await confirm(try_register_temp_token);
			url = c.url;
			expires = c.expires;
			str(c.first_name);
			str(c.last_name);
			str(c.email);
			date(expires);
		});
		test('invalid token structure', async () => {
			try {
				await confirm('0ed9-1b61-4b27-9a7a5a1e8f00d8')
			} catch (error) {
				expect(error).toMatchObject(er('invalid token', 401))
			}
		});
		test('missing token', async () => {
			try {
				await confirm()
			} catch (error) {
				expect(error).toMatchObject(er('invalid token', 401))
			}
		});
		test('invalid token', async () => {
			try {
				await confirm('0ed9-1b61-4b27-9a0d-7a5a1e8f00d8')
			} catch (error) {
				expect(error).toMatchObject(er('invalid token', 401))
			}
		});
	}),
	login: () => describe("'login' function", () => {
		test('valid data', async () => {
			const l = await login(user.email, user.password);
			login_token = l.token;
			iD(l.token);
			date(l.expires);
		});
		test('missing some data', async () => {
			try {
				await login(user.email)
			} catch (error) {
				expect(error).toMatchObject(er('missing input parameters', 401))
			}
		});
		test('wrong user or pass', async () => {
			try {
				await login('test1@ss.z', 'asdasd')
			} catch (error) {
				expect(error).toMatchObject(er('invalid email or password', 401))
			}
		});
	}),
	check: () => describe("'check' function", () => {
		test('valid token', async () => {
			const c = await check(login_token);
			str(c.first_name);
			str(c.last_name);
			str(c.email);
			iD(c.token);
		});
		test('invalid token', async () => {
			try {
				await check('0ed9-1b61-4b27-9a0d-7a5a1e8f00d8')
			} catch (error) {
				expect(error).toMatchObject(er('invalid token', 401))
			}
		});
		test('no token', async () => {
			try {
				await check()
			} catch (error) {
				expect(error).toMatchObject(er('no token', 401))
			}
		});
		test('valid token, no user', async () => {
			try {
				await check('0e2dd0d9-1b61-4b27-9a0d-7a5a1e8f00d9')
			} catch (error) {
				expect(error).toMatchObject(er('not logged in', 401))
			}
		});
	}),
}
describe("test 'auth' functions", () => {
	const {
		try_register,
		confirm,
		login,
		check
	} = funcs;
	try_register();
	confirm();
	login();
	check();
});
