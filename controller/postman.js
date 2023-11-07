const header = [
	{
		key: "token",
		value: "fc289ffe-bcf1-4571-9967-db981b452d30"
	}
];
const baseurl = 'localhost:3000';
const protocol = 'http';
module.exports = type => {
	const api_packs = require(`../router/${type}`);
	return {
		info: {
			name: type,
			description: `${type} api collection`,
			schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		},
		item: Object.keys(api_packs).map(key => {
			const apis = api_packs[key];
			return {
				name: key,
				item: apis.map(({ name, method, path, auth, body, params, description, mode, query, formdata }) => {
					const p = [key];
					let r = `${protocol}://${baseurl}/${key}`;
					if (path) {
						p.push(path)
						r += `/${path}`
					}
					const api = {
						name,
						request: {
							description,
							method,
							header: auth ? header : undefined,
							url: {
								raw: r,
								path: p,
								protocol,
								host: [
									baseurl
								]
							}
						}
					};
					if ((method == 'post' || method == 'put') && (body || formdata))
						api.request.body = mode == 'raw' ?
							{
								mode,
								raw: JSON.stringify(body),
								options: {
									raw: {
										language: "json"
									}
								}
							}
							:
							{
								mode,
								formdata
							}

					if (params) {
						params.forEach(v => {
							api.request.url.path.push(`:${v.key}`)
							api.request.url.raw += `/:${v.key}`
						});
						api.request.url.variable = params
					}
					if (query) {
						api.request.url.raw += '?'
						api.request.url.query = query.map(({ key, value }) => {
							api.request.url.raw += `${key}=${value}`
							return { key, value }
						})

					};
					return api
				})
			}
		})
	};
};