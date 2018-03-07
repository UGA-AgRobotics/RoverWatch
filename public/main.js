// +++++++++++++++++++++++++++++++++++++++++++++++
// Main JS file for Rover Watch
// +++++++++++++++++++++++++++++++++++++++++++++++


/**************************************************
Google Map handler for client side.
Plots GPS position of rover onto a google map using
the google maps js api.
**************************************************/
var GmapHandler = {

	map: null,  // gmap object instance

	// center location on gmap load:
	mapCenter: {
		lat: 31.473600, 
		lon: -83.529900
	},

	// mapZoom: 18, // initial zoom for map
	mapZoom: 20,

	markerCount: 0,  // tracks # of points on map

	pointColorRover: 'blue',  // color of points on map for rover
	pointColorPath: 'black',  // color of points on map for path
	pointColorFlags: 'red',  // color of points on map for flags


	init: function (settings={}) {
		// Any config stuff, initializations, etc.

		GmapHandler.map = new google.maps.Map(document.getElementById('map-canvas'), {
			center: new google.maps.LatLng(GmapHandler.mapCenter.lat, GmapHandler.mapCenter.lon),
	    zoom: GmapHandler.mapZoom,
	    mapTypeId: settings.mapTypeID || "satellite"
		});

		GmapHandler.setup();  // next, run setup function

	},

	setup: function () {

		// jQuery events among other things..

		google.maps.event.addDomListener(window, 'load', GmapHandler.init);  // ?????

		$('#btn-plot').on('click', function () {

			let lat = parseFloat($('#textbox-lat').val());  // grabbing val from textbox
			let lon = parseFloat($('#textbox-lon').val());  // grabbing val from textbox

  		GmapHandler.addMarkerToMap(lat, lon);

		});

	},

	addMarkerToMap: function (lat, lon, htmlMarkupForInfoWindow) {

		var infowindow = new google.maps.InfoWindow();
	  var myLatLng = new google.maps.LatLng(lat, lon);

	  // From RRA google_map_dragdrop_geojson.html..
	  var marker = new google.maps.Circle({
	    strokeColor: GmapHandler.pointColorRover,
	    fillColor: GmapHandler.pointColorRover,
	    map: GmapHandler.map,
	    center: myLatLng,
	    radius: 0.1,
	    animation: google.maps.Animation.DROP  // doesn't seem to work w/ Circle marker
	  });
	  
	  //Gives each marker an Id for the on click
	  GmapHandler.markerCount++;

	  //Creates the event listener for clicking the marker
	  //and places the marker on the map 
	  google.maps.event.addListener(marker, 'click', (function(marker, markerCount) {
	      return function() {
	          infowindow.setContent(htmlMarkupForInfoWindow);
	          infowindow.open(GmapHandler.map, marker);
	      }
	  })(marker, GmapHandler.markerCount));  
	  
	  //Pans map to the new location of the marker
	  GmapHandler.map.panTo(myLatLng);      

		}

};



var s, ROSWebSocketHandler = {

	settings: {
		ws_url: 'ws://localhost:9090',
		ros_obj: null,
		latTextbox: $('#textbox-lat'),
		lonTextbox: $('#textbox-lon'),
		currLatTextbox: $('#textbox-curr-lat'),
		currLonTextbox: $('#textbox-curr-lon'),
	},

	gmapObj: null,

	init: function () {

		gmapObj = Object.create(GmapHandler);  // initialize gmap hanlder for adding points

		s = this.settings;
		s.ros_obj = new ROSLIB.Ros({ url: s.ws_url });
		s.testListener = new ROSLIB.Topic({
	    ros : s.ros_obj,
	    name : '/listener',
	    messageType : 'std_msgs/String'
	  });
	  s.fixListener = new ROSLIB.Topic({
	  	ros: s.ros_obj,
	  	name: '/navsat/fix',
	  	messageType: 'sensor_msgs/NavSatFix'
	  });
		this.setup();  // run setup function below
	},

	setup: function () {

		// -------------------
		// Binding UI events:
		// -------------------

		// ROS Client Events:
		// ++++++++++++++++++++++++++
		s.ros_obj.on('connection', function () {
			console.log("Connected to websocket server..");
		}),

		s.ros_obj.on('error', function (error) {
	    console.log('Error connecting to websocket server: ', error);
	  }),

	  s.ros_obj.on('close', function () {
	    console.log('Connection to websocket server closed.');
	  }),

	  // ROS subscriber to /listener topic:
	  // +++++++++++++++++++++++++++++++++++++
	  s.testListener.subscribe(function(message) {
	    console.log('Received message on ' + s.testListener.name + ': ' + message.data);
	    // s.listener.unsubscribe();
	  });

	  s.fixListener.subscribe(function(message) {
	  	console.log("Received message on fixLister: " + message.data);

	  	ROSWebSocketHandler.handleFixData(message);

	  });

	  // ROS publisher to /cmd_vel topic:
	  // +++++++++++++++++++++++++++++++++++



	},

	handleFixData: function (message) {
		// Handles incoming fix data from /navsat/fix topic.

		if (message.latitude == null || message.longitude == null) { return; }

		s.currLatTextbox.val(message.latitude);  // Display current lat in textbox
		s.currLonTextbox.val(message.longitude);  // Display current lon in textbox

		ROSWebSocketHandler.gmapObj.addMarkerToMap(message.latitude, message.longitude);

	}



};




$(document).ready(function () {

	var _gmap = Object.create(GmapHandler);
	_gmap.init();

	// initROSWebSocketHandler();  // initiate WS listener
	var _rosWS = Object.create(ROSWebSocketHandler);
	_rosWS.init();



});