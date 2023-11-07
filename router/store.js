const { postman, auth, product } = require('../route_controller');
const api_packs = {
	postman: [
		{
			name: 'get postman doc',
			method: 'get',
			path: '',
			params: [
				{
					key: 'type',
					value: 'admin'
				}
			],
			description: 'get postman doc',
			controller: postman
		},
	],
	auth: [
		{
			name: 'try register',
			method: 'post',
			path: 'try_register',
			body: {
				first_name: 'product',
				last_name: 'owner',
				email: 'test@gmail.com',
				password: '23123sf#Dfsdf##D$d',
				confirm: '23123sf#Dfsdf##D$d',
			},
			description: 'try register',
			controller: auth.try_register,
			mode: 'raw'
		},
		{
			name: 'confirm register',
			method: 'get',
			path: 'confirm',
			params: [
				{
					key: 'token',
					value: 'ccc8c96e-44d1-47b8-9e67-28a595d9e8b3'
				}
			],
			description: 'confirm register',
			controller: auth.confirm,
		},
		{
			name: 'login',
			method: 'post',
			path: 'login',
			body: {
				email: 'test@gmail.com',
				password: '23123sf#Dfsdf##D$d'
			},
			description: 'login',
			controller: auth.login,
			mode: 'raw'
		},
	],
	product: [
		{
			name: 'create',
			method: 'post',
			path: '',
			auth: true,
			body: {
				title: 'product 1',
				descr: 'description for product 1'
			},
			description: 'create',
			controller: product.add,
			mode: 'raw'
		},
		{
			name: 'list my products',
			method: 'get',
			path: 'mine',
			auth: true,
			params: [
				{
					key: 'page',
					value: 2
				},
				{
					key: 'per_page',
					value: 10
				}
			],
			description: 'list my products',
			controller: product.mine
		},
		{
			name: 'list',
			method: 'get',
			path: '',
			auth: true,
			params: [
				{
					key: 'page',
					value: 2
				},
				{
					key: 'per_page',
					value: 10
				}
			],
			description: 'list',
			controller: product.list
		},
	]
};
module.exports = api_packs;