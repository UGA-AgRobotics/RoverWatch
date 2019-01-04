var config = {};  // main config object

config.topics = [];  // list of topic objects

config.NODEJS_HOST = process.env.NODEJS_HOST || '127.0.0.1';
config.NODEJS_PORT = process.env.NODEJS_PORT || '8000';

config.ROS_IP = process.env.ROS_IP || '192.168.0.8';
config.ROS_MASTER_URI = process.env.ROS_MASTER_URI || 'http://localhost:11311';
config.ROS_TOPIC_FIX = process.env.ROS_TOPIC_FIX || '/fix';
config.ROS_WEBSOCKET_URL = process.env.ROS_WEBSOCKET_URL || 'ws://192.168.0.85:9090';

module.exports = config;