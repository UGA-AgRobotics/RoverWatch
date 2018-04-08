module.exports = function() {

	var config = {};  // main config object
	// config.topic = {};  // topic object
	config.topics = [];  // list of topic objects

	config.NODEJS_HOST = process.env.NODEJS_HOST || 'localhost';
	config.NODEJS_PORT = process.env.NODEJS_PORT || '8000';
	
	config.ROS_MASTER_URI = process.env.ROS_MASTER_URI || 'http://localhost:11311';
	config.ROS_IP = process.env.ROS_IP || null;

	// // ROS Websocket Server URL:
	// config.ROS_WEBSOCKET_URL = process.env.ROS_WEBSOCKET_URL || 'ws://192.168.131.11:9090';  // default: Jackal

	// // ROS Topics:
	// ROS_FIX_TOPIC = {
	// 	name: process.env.ROS_FIX_TOPIC || '/fix',
	// 	topicType: 'subscriber',
	// 	messageType: 'sensor_msgs/NavSatFix'
	// };
	// ROS_LISTENER_TOPIC = {
	// 	name: process.env.ROS_WEBSOCKET_TOPIC || '/listener',
	// 	topicType: 'subscriber',
	// 	messageType: 'std_msgs/String'
	// };
	// ROS_TOFLAG_TOPIC = {
	// 	name: process.env.ROS_TOFLAG_TOPIC || '/toflag',
	// 	topicType: 'publisher',
	// 	messageType: 'std_msgs/Bool'
	// };

	// config.topics = [ROS_FIX_TOPIC, ROS_LISTENER_TOPIC, ROS_TOFLAG_TOPIC];

	return config;

};