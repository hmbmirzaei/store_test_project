#!/usr/bin/env node
const express = require(`express`);
const { json, urlencoded } = require(`body-parser`);
const cors = require(`cors`);
const { util: { log, today, now, err }, db_init } = require('./controller');
module.exports = ({ type, port }) => {
	const app = express();
	app.use(json({ limit: "50mb" }));
	app.use(urlencoded({ limit: "50mb", extended: true }));
	app.use(cors());
	app.use('/*', (r, s, n) => {
		let { baseUrl, headers, method } = r;
		log(today(new Date()), now(), method, baseUrl, headers.token);
		log(r.headers['x-forwarded-for'] || r.socket.remoteAddress);
		n();
	});
	app.use(require('./routes')(type));
	db_init.init().then(() => {
		const Server = app.listen(port, () => {
			log(`http://localhost:${port}`);
			log(`http://localhost:${port}/postman/${type}`);
		});
		Server.setTimeout(0);
	}).catch(error => {
		err(error.msg || 'error')
	})
};