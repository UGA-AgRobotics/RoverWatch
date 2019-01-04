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

// Configuration:
const config = require('../../config');

// Internal modules:
var gmapHandler = require('./gmap-handler');
var rosHandler = require('./ros-handler');
var leafletHandler = require('./leaflet-handler');



var DomElements = {
	currLatTextbox: $('#textbox-curr-lat'),
	currLonTextbox: $('#textbox-curr-lon'),
	goalLatTextbox: $('#textbox-goal-lat'),
	goalLonTextbox: $('#textbox-goal-lon'),
	goalList: $('#list-goals'),
	addFlagButton: $('#btn-add-flag'),
	uploadGoalsButton: $('#file-upload-goals'),
	uploadGoalsInfo: $('#file-upload-info'),
	uploadPathButton: $('#file-upload-path'),
	uploadPathInfo: $('#file-upload-path-info'),
	startDrivingButton: $('#btn-start-driving'),
	stopDrivingButton: $('#btn-stop-driving'),
	gpsStatusTextbox: $('#textbox-gps-status'),
	gpsRatioTextbox: $('#textbox-gps-ratio'),
	connectionStatusLabel: $('#connection-status'),
	startRecordingButton: $('#btn-start-recording'),
	stopRecordingButton: $('#btn-stop-recording')
};



var RoverWatchMain = {

	rosConnMessages: {
		connected: "Status: connected",
		disconnected: "Status: offline"
	},

	init: function() {

		gmapHandler.init();
		// leafletHandler.init();
		rosHandler.init();

		RoverWatchMain.setup();
		RoverWatchMain.setupRosEvents();

	},



	setup: function() {
		/*
		Main UI events
		*/
		

		// Add single goal/flag event:
		DomElements.addFlagButton.on('click', function () {

			var lat = DomElements.goalLatTextbox.val();  // get lat value for goal
			var lon = DomElements.goalLonTextbox.val();  // get lon value for goal
			
			// RoverWatchMain.addGoalToList(lat, lon);  // Adds lat/lon from goal lat/lon textboxes to the goals list
			gmapHandler.addMarkerToMap(lat, lon, '', gmapHandler.pointColorFlags);  // Use Gmap Handler to add lat/lon to map
			// leafletHandler.addMarkerToMap(lat, lon, '', leafletHandler.pointColorFlags);  // Use Leaflet Handler to add lat/lon to map

		});

		// Upload goals/flags event:
		DomElements.uploadGoalsButton.on('change', function() {

			var goalsFile = this.files[0];
			var textType = /json.*/;

			if (!(goalsFile.type.match(textType))) {
				DomElements.uploadGoalsInfo.html("File type not supported.");
				return;
			}

			DomElements.uploadGoalsInfo.html(goalsFile.name);  // add uploaded filename

			// Next, call RoverWatch func to load list of goals..
			// Also call dataHandler to do any data conversions and filling
			// out any missing formats (e.g., dec, dsm, utm for each goal point):
			
			var reader = new FileReader();
			reader.onload = function (e) {
				var goalsJson = JSON.parse(reader.result);  // expecting json string to convert to object
				
				// Assuming flags file is in geojson format..
				var flagsObj = RoverWatchMain.getFlagsFromGeojson(goalsJson);

				for (flagInd in flagsObj) {
					var flag = flagsObj[flagInd];
					gmapHandler.addMarkerToMap(flag[0], flag[1], "", gmapHandler.pointColorFlags);
					// leafletHandler.addMarkerToMap(flag[0], flag[1], "", leafletHandler.pointColorFlags);
				}
				// RoverWatchMain.loadGoalsToList(goalsJson, 'goal');

			}
			reader.readAsText(goalsFile);

		});

		// Upload path event:
		DomElements.uploadPathButton.on('change', function() {

			var pathFile = this.files[0];
			var textType = /json.*/;

			if (!(pathFile.type.match(textType))) {
				DomElements.uploadPathInfo.html("File type not supported.");
				return;
			}

			DomElements.uploadPathInfo.html(pathFile.name);  // add uploaded filename

			var reader = new FileReader();
			reader.onload = function (e) {
				var pathJson = JSON.parse(reader.result);  // expecting json string to convert to object
				RoverWatchMain.loadGoalsToList(pathJson, 'path');
			}
			reader.readAsText(pathFile);

		});

		// Start recording button event:
		DomElements.startRecordingButton.on('click', function() {
			// rosHandler.startRecordingPublisher.publish(true);
			rosHandler.topicHandlers.ROS_START_RECORDING_TOPIC.publish(rosHandler.rosTrue);
		});

		// Stop recording button event:
		DomElements.stopRecordingButton.on('click', function() {
			// rosHandler.startRecordingPublisher.publish(false);
			rosHandler.topicHandlers.ROS_START_RECORDING_TOPIC.publish(rosHandler.rosFalse);
		});

		// Start driving button event:
		DomElements.startDrivingButton.on('click', function() {
			rosHandler.startDrivingPublisher.publish(true);
		});

		// Stop driving button event:
		DomElements.stopDrivingButton.on('click', function() {
			rosHandler.startDrivingPublisher.publish(false);
		});

	},



	setupRosEvents: function() {
	  
		// GPS Fix Topic Subscriber:
		rosHandler.topicHandlers.ROS_FIX_TOPIC.subscribe(function(message) {
			console.log("Incoming message from ROS_FIX_TOPIC.");
			RoverWatchMain.handleFixData(message);
		});

		// GPS Status Subscriber:
		rosHandler.topicHandlers.ROS_STATUS_TOPIC.subscribe(function(message) {
			console.log("Incoming message from ROS_STATUS_TOPIC.");
			DomElements.gpsStatusTextbox.val(message.data);  // adds gps status to textbox
		});

		// GPS AR Validation Ratio Subscriber:
		rosHandler.topicHandlers.ROS_AR_RATIO_TOPIC.subscribe(function(message) {
			console.log("Incoming message from ROS_AR_RATIO_TOPIC.");
			DomElements.gpsRatioTextbox.val(Number(message.data).toFixed(3));  // adds gps ar ratio to textbox
		});

		// GPS Connected Subscriber:
		rosHandler.topicHandlers.ROS_GPS_CONNECTED_TOPIC.subscribe(function(message) {
			console.log("Incoming message from ROS_GPS_CONNECTED_TOPIC.");
			if (message.data == true) {
				DomElements.connectionStatusLabel.text(RoverWatchMain.rosConnMessages.connected);
			}
			else {
				DomElements.connectionStatusLabel.text(RoverWatchMain.rosConnMessages.disconnected);
			}
		});	  

	},



	handleFixData: function(message) {
		// ++++++++++++++++++++++++++++++++++++++++++++++++++
		// Handles incoming fix data from /navsat/fix topic.
		// ++++++++++++++++++++++++++++++++++++++++++++++++++

		if (message.latitude == null || message.longitude == null) { return; }

		DomElements.currLatTextbox.val(message.latitude);  // Display current lat in textbox
		DomElements.currLonTextbox.val(message.longitude);  // Display current lon in textbox

		gmapHandler.addMarkerToMap(message.latitude, message.longitude, '', gmapHandler.pointColorRover);

	},



	addGoalToList: function(lat, lon) {
		// ++++++++++++++++++++++++++++++++++++++++++
		// Adds goal lat/lon to goals list
		// ++++++++++++++++++++++++++++++++++++++++++
		var listItemHtml = '<li class="list-group-item">' + lat + ', ' + lon + '<span class="pull-right"><button class="btn btn-info">x</button></span></li>';
		DomElements.goalList.append(listItemHtml);
	},



	loadGoalsToList: function(goalsJson, pointType) {
		// ++++++++++++++++++++++++++++++++++++++++++++++++++
		// Loads a list of goals from a file into the
		// DOM list of goals.
		// ++++++++++++++++++++++++++++++++++++++++++++++++++

		var pointColor = null;
		if (pointType == "goal") {
			pointColor = gmapHandler.pointColorFlags;
		}
		else if (pointType == "path") {
			pointColor = gmapHandler.pointColorPath;
		}


		var goalsToAdd = goalsJson.goals;

		if (!(goalsToAdd)) {
			goalsToAdd = goalsJson.flags;  // fix for goals to flags growing pains..
		}


		for (goalInd in goalsToAdd) {

			var goalObj = goalsToAdd[goalInd];

			// Builds popup HTML for info window when user clicks on a GPS point:
			var popupInfo = '<div class="content"><p><b>Selected point:</b></p>';
			popupInfo += '<p>Dec Lat/Lon: ' + goalObj.decPos.lat + ", " + goalObj.decPos.lon + '</p>';
			popupInfo += '<p>UTM: ' + goalObj.utmPos.easting + ', ' + goalObj.utmPos.northing + '</p>';
			if (goalObj.time) { popupInfo += '<p>Time: ' + goalObj.time + '</p>'; }

			// Adds button to add selected point as flag:
			popupInfo += $(DomElements.addFlagButton).clone().prop('outerHTML');
			popupInfo += '</div>';

			// For now, using dec lat/lon format to add to UI list
			gmapHandler.addMarkerToMap(goalObj.decPos.lat, goalObj.decPos.lon, popupInfo, pointColor, pointType);
			// leafletHandler.addMarkerToMap(goalObj.decPos.lat, goalObj.decPos.lon, popupInfo, pointColor, pointType);
		}
	},



	loadPathToList: function(courseJson) {
		/*
		Loads course data to the google map. Intially, expecting
		list of {'easting': '', 'northing': ''} objects..
		*/

		// NOTE: Assuming initial key is topic name of '/fix'..

		var courseData = courseJson['/fix'];  // assuming /fix topic data (see: bag_handler module from simple_navigation_goals)

		for (var courseInd in courseData) {
			var coursePos = courseData[courseInd];
			gmapHandler.addMarkerToMap(coursePos.lat, coursePos.lon, "", gmapHandler.pointColorPath);
			// leafletHandler.addMarkerToMap(coursePos.lat, coursePos.lon, "", gmapHandler.pointColorPath);
		}
	},



	getFlagsFromGeojson: function(flags_obj) {

		var flags = flags_obj['features']
		var flags_list = [];

		if(flags.length <= 0) {
			throw "No flags found in flags file object..";
		}

		for(flagInd in flags) {

			var flag = flags[flagInd];

			var coords = flag['geometry']['coordinates'];

			flags_list.push([coords[0], coords[1]]);
		}

		return flags_list;
	}



};



// Initiate Rover Watch after page loads:
$(document).ready(function() { RoverWatchMain.init(); });