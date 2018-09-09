// websocket-handler.js

/*
Handles websocket events for Rover Watch.
Websocket server is from rosbridge-suite (http://wiki.ros.org/rosbridge_suite),
and this module is the client side handling of ROS topics data using
websocket protocol.
*/



const config = require('../../config');  // import RoverWatch config

// Requirements:
var $ = require('jquery');
var roslib = require('roslib-fork');
var eventemitter2 = require('eventemitter2');
var socketio = require('socket.io-client');
	// gmapHandler = require('./gmap-handler');

console.log("configuration: ");
console.log(config);


var RosConfig = {

	// ROS Websocket Server URL:
	ROS_WEBSOCKET_URL: config.ROS_WEBSOCKET_URL || 'ws://192.168.0.188:9090',  // default: Jackal

	ROS_TOPICS: {
		ROS_FIX_TOPIC: {
			name: config.ROS_FIX_TOPIC || '/fix',
			topicType: 'subscriber',
			messageType: 'sensor_msgs/NavSatFix'
		}
	}

};



// module.exports = function(rosWebsocketUrl, topics) {

var ROSHandler = {

	// wsServerUrl: rosWebsocketUrl,
		// currLatTextbox: $('#textbox-curr-lat'),
		// currLonTextbox: $('#textbox-curr-lon'),

	config: RosConfig,

	rosObj: null,  // ROS event handler
	// gmapObj: null,  // gmaps event handler
	topicObj: {
		name: null,
		topicType: null,
		messageType: null
	},

	// topics: topics,
	topicHandlers: {},



	init: function() {

		// ROSHandler.gmapObj = Object.create(gmapHandler);  // initialize gmap hanlder for adding points
		ROSHandler.rosObj = new roslib.Ros({ url: RosConfig.ROS_WEBSOCKET_URL });

		for(var topicName in RosConfig.ROS_TOPICS) {

			// var topicObj = ROSHandler.topics[topicName];
			var topicObj = RosConfig.ROS_TOPICS[topicName];
			
			// initialize topic handlers using ROS_TOPICS names:
			ROSHandler.topicHandlers[topicName] = new roslib.Topic({
				ros: ROSHandler.rosObj,
				name: topicObj.name,
				messageType: topicObj.messageType
			});

		}

	}

};



module.exports = ROSHandler;