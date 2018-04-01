module.exports = function(scope) {

	var config = {};
	config.public = {};

	config.NODEJS_HOST = process.env.NODEJS_HOST || 'localhost';
	config.NODEJS_PORT = process.env.NODEJS_PORT || '8000';
	config.ROS_MASTER_URI = process.env.ROS_MASTER_URI || 'http://localhost:11311';
	config.ROS_IP = process.env.ROS_IP || null;

	// Rover Watch frontend config
	config.public.ROS_WEBSOCKET_URL = process.env.ROS_WEBSOCKET_URL || 'ws://192.168.131.11:9090';  // default: Jackal
	config.public.ROS_FIX_TOPIC = process.env.ROS_FIX_TOPIC || '/fix';
	config.public.ROS_LISTENER_TOPIC = process.env.ROS_WEBSOCKET_TOPIC || '/listener';
	config.public.ROS_TOFLAG_TOPIC = process.env.ROS_TOFLAG_TOPIC || '/toflag';

	if (scope == "public") { return config.public; }
	else { return config; }

};