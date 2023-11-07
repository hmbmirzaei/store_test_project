const express = require(`express`);
const app = express();
let router = express.Router();
const { auth: {check} } = require('./route_controller');
const funcs = type => {
	const api_list = require(`./router/${type}`);
	Object.keys(api_list).forEach(items => {
		const apis = api_list[items];
		apis.forEach(({ method, path, params, auth, controller }) => {
			let url = `/${items}`;
			if (path) url += `/${path}`;
			if (params)
				params.forEach(param => {
					url += `/:${param.key}`;
				})
			if (auth)
				router[method](url, check, controller)
			else
				router[method](url, controller)
		});
	});
	return router
}
app.use(router);
module.exports = funcs;