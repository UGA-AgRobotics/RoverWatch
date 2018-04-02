// +++++++++++++++++++++++++++++++++++++++++++++++
// Main JS file for Rover Watch
// +++++++++++++++++++++++++++++++++++++++++++++++


/**************************************************
Google Map handler for client side.
Plots GPS position of rover onto a google map using
the google maps js api.
**************************************************/

// Configuration:
const
	config = require('../../config')('public');

// Front-end Requirements:
const
	$ = require('jquery'),
	bootstrap = require('bootstrap'),
	// gmapHandler = require('./gmap-handler')(config),
	gmapHandler = require('./gmap-handler'),
	rosHandler = require('./ros-handler')(config);



var domElements = {
	currLatTextbox: $('#textbox-curr-lat'),
	currLonTextbox: $('#textbox-curr-lon'),
	goalLatTextbox: $('#textbox-goal-lat'),
	goalLonTextbox: $('#textbox-goal-lon'),
	goalList: $('#list-goals'),
	addGoalButton: $('#btn-add-goal'),
	goToGoalButton: $('#btn-goto-flag')
};



var RoverWatchMain = {

	init: function() {

		gmapHandler.init();
		rosHandler.init();

		RoverWatchMain.setup();

	},



	setup: function() {
		// Main UI events
		
		domElements.goToGoalButton.on('click', function () {
			// TODO: When clicked, drive Jackal to the flag's position..
		});

		domElements.addGoalButton.on('click', function () {

			var lat = domElements.goalLatTextbox.val();  // get lat value for goal
			var lon = domElements.goalLonTextbox.val();  // get lon value for goal
			
			RoverWatchMain.addGoalToList(lat, lon);  // Adds lat/lon from goal lat/lon textboxes to the goals list
			gmapHandler.addMarkerToMap(lat, lon, '', gmapHandler.pointColorFlags);  // Use Gmap Handler to add lat/lon to map

		});

	},



	addGoalToList: function(lat, lon) {
		// ++++++++++++++++++++++++++++++++++++++++++
		// Adds goal lat/lon to goals list
		// ++++++++++++++++++++++++++++++++++++++++++
		domElements.goalList.append('<li class="list-group-item">' + lat + ', ' + lon + '</li>');
	}

};



$(document).ready(function() {

	//NOTE: HANDLE DOM EVENTS IN MAIN.JS AND NOT IN *-handler.js files???

	RoverWatchMain.init();

});
