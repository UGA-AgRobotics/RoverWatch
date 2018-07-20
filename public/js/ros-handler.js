// websocket-handler.js

/*
Handles websocket events for Rover Watch.
Websocket server is from rosbridge-suite (http://wiki.ros.org/rosbridge_suite),
and this module is the client side handling of ROS topics data using
websocket protocol.
*/



// Requirements:
var $ = require('jquery');
var roslib = require('roslib');
var eventemitter2 = require('eventemitter2');
var socketio = require('socket.io-client');
	// gmapHandler = require('./gmap-handler');



var RosConfig = {

	// ROS Websocket Server URL:
	ROS_WEBSOCKET_URL: process.env.ROS_WEBSOCKET_URL || 'ws://192.168.0.188:9090',  // default: Jackal

	ROS_TOPICS: {
		ROS_FIX_TOPIC: {
			name: process.env.ROS_FIX_TOPIC || '/fix',
			topicType: 'subscriber',
			messageType: 'sensor_msgs/NavSatFix'
		},
		ROS_LISTENER_TOPIC: {
			name: process.env.ROS_WEBSOCKET_TOPIC || '/listener',
			topicType: 'subscriber',
			messageType: 'std_msgs/String'
		},
		ROS_TOFLAG_TOPIC: {
			name: process.env.ROS_TOFLAG_TOPIC || '/toflag',
			topicType: 'publisher',
			messageType: 'std_msgs/Bool'
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

		// ROSHandler.setup();  // run setup function below

	},



	// setup: function() {

	// 	// ++++++++++++++++++++
	// 	// Event handling
	// 	// ++++++++++++++++++++


	// 	// ROS Client Default WS Events:
	// 	// ++++++++++++++++++++++++++
	// 	ROSHandler.rosObj.on('connection', function () {
	// 		console.log("Connected to websocket server..");
	// 	}),
	// 	ROSHandler.rosObj.on('error', function (error) {
	//     console.log('Error connecting to websocket server: ', error);
	//   }),
	//   ROSHandler.rosObj.on('close', function () {
	//     console.log('Connection to websocket server closed.');
	//   }),


	//   // ROS subscriber to /listener topic:
	//   // +++++++++++++++++++++++++++++++++++++
	//   ROSHandler.settings.testListener.subscribe(function(message) {
	//     console.log('Received message on ' + ROSHandler.settings.testListener.name + ': ' + message.data);
	//     // ROSHandler.settings.listener.unsubscribe();
	//   });
	//   ROSHandler.settings.fixListener.subscribe(function(message) {
	//   	console.log("Received message on fixLister: " + message.data);
	//   	ROSHandler.handleFixData(message);
	//   });
	// },



	// handleFixData: function(message) {
	// 	// ++++++++++++++++++++++++++++++++++++++++++++++++++
	// 	// Handles incoming fix data from /navsat/fix topic.
	// 	// ++++++++++++++++++++++++++++++++++++++++++++++++++

	// 	if (message.latitude == null || message.longitude == null) { return; }

	// 	ROSHandler.settings.currLatTextbox.val(message.latitude);  // Display current lat in textbox
	// 	ROSHandler.settings.currLonTextbox.val(message.longitude);  // Display current lon in textbox

	// 	ROSHandler.gmapObj.addMarkerToMap(message.latitude, message.longitude, '', ROSHandler.gmapObj.pointColorRover);

	// }



};

	

	// return ROSHandler;


// };



module.exports = ROSHandler;
