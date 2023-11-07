const md5 = require('md5');
const { send } = require('./mailer');
const { err, redis, check_id, isEmail, strongPassword } = require('./util');
const email_to_token = redis(0);
const token_to_user_info = redis(1);
const temp_register_info = redis(2);
const temp_register_token = redis(3);
const { v4: uuid_v4 } = require("uuid");
const { user } = require('../models');
const expire = 60 * 60;
const user_exists = async email => {
	const exists_user = await user.findOne({
		where: {
			email
		}
	});
	if (exists_user)
		err('user exists');
}
const funcs = {
	check: async token => {
		if (!token)
			err('no token', 401);
		if (!check_id(token))
			err('invalid token', 401)
		let user = await token_to_user_info.get(token);
		if (!user)
			err('not logged in', 401);
		return JSON.parse(user);
	},
	try_register: async data => {
		if (!data)
			err('missing input parameters');
		const { first_name, last_name, email, password, confirm } = data;
		if (!first_name || !last_name || !isEmail(email) || !password || !confirm || password !== confirm)
			err('missing input parameters');
		if (!strongPassword(password))
			err('weak password');

		await user_exists(email);
		const pre_try_register = await temp_register_token.get(email);
		if (pre_try_register) //check for pre try
			err(`please wait max ${expire} minutes before retry register`);

		const temp_token = uuid_v4();

		await temp_register_info.set(temp_token, JSON.stringify({
			first_name,
			last_name,
			email,
			password: md5(password)
		}), 'EX', expire);//expire in 60 minutes

		await temp_register_token.set(email, temp_token, 'EX', expire);//expire in 60 minutes
		const confirmation_url = `http://localhost:3000/auth/confirm/${temp_token}`
		await send({
			to: email,
			subject: 'register confirmation',
			text: confirmation_url
		});
		let nd = new Date();
		nd += expire * 1000;
		return {
			token: temp_token,
			url: confirmation_url,
			expires: new Date(nd)
		}
	},
	confirm: async temp_token => {
		if (!temp_token || !check_id(temp_token))
			err('invalid token', 401);
		const tri = await temp_register_info.get(temp_token);
		if (!tri)
			err('invalid token', 401);
		const { first_name, last_name, email, password } = JSON.parse(tri);
		await user_exists(email)

		await user.create({ first_name, last_name, email, password });
		await temp_register_info.del(temp_token); //delete try register
		await temp_register_token.del(email); //delete try register
		return { first_name, last_name, email }
	},
	login: async (email, password) => {
		if (!email || !password)
			err('missing input parameters', 401);
		password = md5(password);
		const _user = await user.findOne({
			where: {
				email
			}
		});
		if (!_user)
			err('invalid email or password', 401);

		//check and delete pre login
		const old_token = await email_to_token.get(email)
		if (old_token) {
			await token_to_user_info.del(old_token)
			await email_to_token.del(email)
		}
		//check and delete pre login

		const token = uuid_v4();
		await email_to_token.set(_user.email, token, 'EX', expire);
		await token_to_user_info.set(token, JSON.stringify({
			id: _user.id,
			first_name: _user.first_name,
			last_name: _user.last_name,
			email,
			token
		}), 'EX', expire);
		let nd = new Date();
		nd += expire * 1000;
		return {
			token,
			expires: new Date(nd)
		};
	}
};
module.exports = funcs;
