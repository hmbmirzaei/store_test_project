const { postman, util: { resp } } = require('../controller');
module.exports = async (r, s) => resp(postman(r.params.type), s)