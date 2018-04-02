// websocket-handler.js

/*
Handles websocket events for Rover Watch.
*/



// Requirements:
const
	$ = require('jquery'),
	roslib = require('roslib'),
	eventemitter2 = require('eventemitter2'),
	socketio = require('socket.io-client'),
	gmapHandler = require('./gmap-handler');



module.exports = function(config) {

	var ROSHandler = {

		settings: {
			wsUrl: config.ROS_WEBSOCKET_URL,
			currLatTextbox: $('#textbox-curr-lat'),
			currLonTextbox: $('#textbox-curr-lon'),
		},

		rosObj: null,  // ROS event handler
		gmapObj: null,  // gmaps event handler

		topics: {
			listener: config.ROS_LISTENER_TOPIC,
			fix: config.ROS_FIX_TOPIC,
			toFlag: config.ROS_TOFLAG_TOPIC
		},



		init: function() {

			ROSHandler.gmapObj = Object.create(gmapHandler);  // initialize gmap hanlder for adding points

			ROSHandler.rosObj = new roslib.Ros({ url: ROSHandler.settings.wsUrl });

			ROSHandler.settings.testListener = new roslib.Topic({
		    ros : ROSHandler.rosObj,
		    name: ROSHandler.topics.listener,
		    messageType : 'std_msgs/String'
		  });
		  ROSHandler.settings.fixListener = new roslib.Topic({
		  	ros: ROSHandler.rosObj,
		  	name: ROSHandler.topics.fix,
		  	messageType: 'sensor_msgs/NavSatFix'
		  });
		  ROSHandler.settings.gotoFlagPublisher = new roslib.Topic({
		  	ros: ROSHandler.rosObj,
		  	name: ROSHandler.topics.toFlag,
		  	messageType: 'std_msgs/Bool'
		  });

			ROSHandler.setup();  // run setup function below

		},



		setup: function() {

			// ++++++++++++++++++++
			// Binding UI events:
			// ++++++++++++++++++++


			// ROS Client WS Events:
			// ++++++++++++++++++++++++++
			ROSHandler.rosObj.on('connection', function () {
				console.log("Connected to websocket server..");
			}),
			ROSHandler.rosObj.on('error', function (error) {
		    console.log('Error connecting to websocket server: ', error);
		  }),
		  ROSHandler.rosObj.on('close', function () {
		    console.log('Connection to websocket server closed.');
		  }),


		  // ROS subscriber to /listener topic:
		  // +++++++++++++++++++++++++++++++++++++
		  ROSHandler.settings.testListener.subscribe(function(message) {
		    console.log('Received message on ' + ROSHandler.settings.testListener.name + ': ' + message.data);
		    // ROSHandler.settings.listener.unsubscribe();
		  });
		  ROSHandler.settings.fixListener.subscribe(function(message) {
		  	console.log("Received message on fixLister: " + message.data);
		  	ROSHandler.handleFixData(message);
		  });


		  // ROS publisher to /cmd_vel topic:
		  // +++++++++++++++++++++++++++++++++++

		},



		handleFixData: function(message) {
			// ++++++++++++++++++++++++++++++++++++++++++++++++++
			// Handles incoming fix data from /navsat/fix topic.
			// ++++++++++++++++++++++++++++++++++++++++++++++++++

			if (message.latitude == null || message.longitude == null) { return; }

			ROSHandler.settings.currLatTextbox.val(message.latitude);  // Display current lat in textbox
			ROSHandler.settings.currLonTextbox.val(message.longitude);  // Display current lon in textbox

			ROSHandler.gmapObj.addMarkerToMap(message.latitude, message.longitude, '', ROSHandler.gmapObj.pointColorRover);

		}



	};

	

	return ROSHandler;


};