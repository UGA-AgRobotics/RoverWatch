// +++++++++++++++++++++++++++++++++++++++++++++++
// Main JS file for Rover Watch
// +++++++++++++++++++++++++++++++++++++++++++++++


/**************************************************
Google Map handler for client side.
Plots GPS position of rover onto a google map using
the google maps js api.
**************************************************/

// External libraries:
global.jQuery = require('jquery');
var $ = global.jQuery;
var bootstrap = require('bootstrap');
// var roslib = require('roslib');
// var eventemitter2 = require('eventemitter2');
// var socketio = require('socket.io-client');

// Configuration:
// const config = require('../../config');

// Internal modules:
var gmapHandler = require('./gmap-handler');
var rosHandler = require('./ros-handler');
var dataHandler = require('./data-handler');
var goalsData = require('../../goals/goals1.json');



var DomElements = {
	currLatTextbox: $('#textbox-curr-lat'),
	currLonTextbox: $('#textbox-curr-lon'),
	goalLatTextbox: $('#textbox-goal-lat'),
	goalLonTextbox: $('#textbox-goal-lon'),
	goalList: $('#list-goals'),
	addGoalButton: $('#btn-add-goal'),
	goToGoalButton: $('#btn-goto-flag'),
	uploadGoalsButton: $('#file-upload-goals'),
	uploadGoalsInfo: $('#file-upload-info')
};



var RoverWatchMain = {

	init: function() {

		gmapHandler.init();
		rosHandler.init();

		RoverWatchMain.setup();
		RoverWatchMain.setupRosEvents();

	},



	setup: function() {
		// Main UI events
		
		DomElements.goToGoalButton.on('click', function () {
			// TODO: When clicked, drive Jackal to the flag's position..
		});

		DomElements.addGoalButton.on('click', function () {

			var lat = DomElements.goalLatTextbox.val();  // get lat value for goal
			var lon = DomElements.goalLonTextbox.val();  // get lon value for goal
			
			RoverWatchMain.addGoalToList(lat, lon);  // Adds lat/lon from goal lat/lon textboxes to the goals list
			gmapHandler.addMarkerToMap(lat, lon, '', gmapHandler.pointColorFlags);  // Use Gmap Handler to add lat/lon to map

		});

		DomElements.uploadGoalsButton.on('change', function() {
			DomElements.uploadGoalsInfo.html(this.files[0].name);  // add uploaded filename

			// Next, call RoverWatch func to load list of goals..
			// Also call dataHandler to do any data conversions and filling
			// out any missing formats (e.g., dec, dsm, utm for each goal point):
			

		});

	},



	setupRosEvents: function() {

		// ROS WS Events:
		// ++++++++++++++++++++++++++
		rosHandler.rosObj.on('connection', function () {
			console.log("Connected to websocket server..");
		}),
		rosHandler.rosObj.on('error', function (error) {
	    console.log('Error connecting to websocket server: ', error);
	  }),
	  rosHandler.rosObj.on('close', function () {
	    console.log('Connection to websocket server closed.');
	  }),

	  // ROS Topic Events:
	  // +++++++++++++++++++++++++++++++++++++
	  // rosHandler.topicHandlers.ROS_FIX_TOPIC.subscribe(function(message) {
	  //   console.log('Received message on ' + rosHandler.settings.testListener.name + ': ' + message.data);
	  //   // rosHandler.settings.listener.unsubscribe();
	  // });
	  rosHandler.topicHandlers.ROS_FIX_TOPIC.subscribe(function(message) {
	  	console.log("Received message on fixLister: " + message.data);
	  	RoverWatchMain.handleFixData(message);
	  });

	},



	handleFixData: function(message) {
		// ++++++++++++++++++++++++++++++++++++++++++++++++++
		// Handles incoming fix data from /navsat/fix topic.
		// ++++++++++++++++++++++++++++++++++++++++++++++++++

		if (message.latitude == null || message.longitude == null) { return; }

		DomElements.currLatTextbox.val(message.latitude);  // Display current lat in textbox
		DomElements.currLonTextbox.val(message.longitude);  // Display current lon in textbox

		gmapObj.addMarkerToMap(message.latitude, message.longitude, '', rosHandler.gmapObj.pointColorRover);

	},



	addGoalToList: function(lat, lon) {
		// ++++++++++++++++++++++++++++++++++++++++++
		// Adds goal lat/lon to goals list
		// ++++++++++++++++++++++++++++++++++++++++++
		var listItemHtml = '<li class="list-group-item">' + lat + ', ' + lon + '<span class="pull-right"><button class="btn btn-info">x</button></span></li>';
		DomElements.goalList.append(listItemHtml);
	},



	loadGoalsToList: function() {
		// ++++++++++++++++++++++++++++++++++++++++++++++++++
		// Loads a list of goals from a file into the
		// DOM list of goals.
		// ++++++++++++++++++++++++++++++++++++++++++++++++++
		
	}



};



// Initiate Rover Watch after page loads:
$(document).ready(function() { RoverWatchMain.init(); });