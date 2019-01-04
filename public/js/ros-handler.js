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



var RosConfig = {

	// ROS Websocket Server URL:
	ROS_WEBSOCKET_URL: config.ROS_WEBSOCKET_URL,

	// Defines ROS Topics:
	ROS_TOPICS: {
		// Subscribers:
		ROS_FIX_TOPIC: {
			name: config.ROS_FIX_TOPIC || '/fix',
			topicType: 'subscriber',
			messageType: 'sensor_msgs/NavSatFix'
		},
		ROS_STATUS_TOPIC: {
			name: config.ROS_STATUS_TOPIC || '/emlid_solution_status',
			topicType: 'subscriber',
			messageType: 'std_msgs/String'
		},
		ROS_AR_RATIO_TOPIC: {
			name: config.ROS_AR_RATIO_TOPIC || '/emlid_ar_ratio',
			topicType: 'subscriber',
			messageType: 'std_msgs/Float32'
		},
		ROS_GPS_CONNECTED_TOPIC: {
			name: config.ROS_GPS_CONNECTED_TOPIC || '/emlid_connected',
			topicType: 'subscriber',
			messageType: 'std_msgs/Bool'
		},
		// Publishers:
		ROS_START_DRIVING_TOPIC: {
			name: config.ROS_START_DRIVING_TOPIC || '/start_driving',
			topicType: 'publisher',
			messageType: 'std_msgs/Bool'
		},
		ROS_START_RECORDING_TOPIC: {
			name: config.ROS_START_RECORDING_TOPIC || '/start_recording',
			topicType: 'publisher',
			messageType: 'std_msgs/Bool'
		}
	}

};



var ROSHandler = {

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

	rosTrue: new roslib.Message({data: true}),
	
	rosFalse: new roslib.Message({data: false}),



	init: function() {

		ROSHandler.rosObj = new roslib.Ros({ url: RosConfig.ROS_WEBSOCKET_URL });
		// ROSHandler.rosObj = new roslib.Ros({ url: "ws://192.168.0.85:9090" });

		ROSHandler.setup();
		
	},



	setup: function() {

		// Sets up ROS Topic Handlers:
		ROSHandler.setupRosTopics();

		// Sets up ROS WebSocket Events:
		ROSHandler.rosObj.on('connection', function () {
			console.log("Connected to websocket server..");
		});
		ROSHandler.rosObj.on('error', function (error) {
			console.log('Error connecting to websocket server: ', error);
		});
		ROSHandler.rosObj.on('close', function () {
			console.log('Connection to websocket server closed.');
		});

		// Starts up ROS topic listeners:
		// ROSHandler.startRosHandlers();

	},



	setupRosTopics: function() {
		/*
		Sets up ROS topic handlers for Rover Watch.
		Topics are defined in the config at the top.
		*/

		for(var topicName in RosConfig.ROS_TOPICS) {

			var topicObj = RosConfig.ROS_TOPICS[topicName];
			
			// Initializes topic handlers using ROS_TOPICS names:
			ROSHandler.topicHandlers[topicName] = new roslib.Topic({
				ros: ROSHandler.rosObj,
				name: topicObj.name,
				messageType: topicObj.messageType
			});

		}

	},



	// fixSubscriber: function() {
	// 	/*
	// 	Starts ROS topic handlers for subscribers.
	// 	*/

	// 	// Starts ROS /fix topic subscriber:
	// 	ROSHandler.topicHandlers.ROS_FIX_TOPIC.subscribe(function(message) {
	// 		// console.log("Incoming message from ROS_FIX_TOPIC..");
	// 		// RoverWatchMain.handleFixData(message);
	// 		return message;
	// 	});
	// },



	startDrivingPublisher: function() {
		return ROSHandler.topicHandlers.ROS_START_DRIVING_TOPIC;
	},



	startRecordingPublisher: function() {
		return ROSHandler.topicHandlers.ROS_START_RECORDING_TOPIC;
	}

};



module.exports = ROSHandler;