module.exports = function () {

	var config = {};

	config.NODEJS_IP = process.env.NODEJS_IP || 'localhost';
	config.NODEJS_PORT = process.env.NODEJS_PORT || '8000';

	config.ROS_MASTER_URI = process.env.ROS_MASTER_URI || 'http://localhost:11311';


	return config;

};