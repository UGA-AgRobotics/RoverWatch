module.exports = function () {

	var config = {};

	config.NODEJS_IP = process.env.NODEJS_IP || 'localhost';
	config.NODEJS_PORT = process.env.NODEJS_PORT || '8000';

	return config

};