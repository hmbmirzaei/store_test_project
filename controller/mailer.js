const nodemailer = require("nodemailer");
require('dotenv').config();
const { user, pass, host, port } = process.env;
const {err} = require('./util');
const funcs = {
	send: async ({ to, subject, text }) => {
		try {
			// const email_result = await nodemailer.createTransport({
			// 	host,
			// 	port,
			// 	secure: false,
			// 	auth: { user, pass },
			// 	tls: { rejectUnauthorized: false }
			// }).sendMail({
			// 	from: user,
			// 	to,
			// 	subject,
			// 	text
			// });
	
			return 'done';
		} catch (error) {
			console.log(`${error}`);
			err('error sending email');
		}
	}
};
module.exports = funcs;