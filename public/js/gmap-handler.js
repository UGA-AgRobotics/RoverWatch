//gmap-handler.js

/*
JS module for handling google maps API for Rover Watch.
*/



// Module Requirements:
const
	$ = require('jquery');



var mapCenters = {

	peanutField: {
		lat: 31.473600, 
		lon: -83.529900
	},

	annexField: {
		lat: 31.4753776881,
		lon: -83.5289577629
	}

};



var GmapHandler = {

	map: null,  // gmap object instance
	mapCenter: mapCenters.annexField,  // center location on gmap load
	mapZoom: 20,  // initial zoom for map

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

		// $('#btn-plot').on('click', function () {
		// 	let lat = parseFloat($('#textbox-lat').val());  // grabbing val from textbox
		// 	let lon = parseFloat($('#textbox-lon').val());  // grabbing val from textbox
  // 		GmapHandler.addMarkerToMap(lat, lon);
		// });

	},

	addMarkerToMap: function (lat, lon, htmlMarkupForInfoWindow, pointColor='purple') {

		var infowindow = new google.maps.InfoWindow();
	  var myLatLng = new google.maps.LatLng(lat, lon);

	  // From RRA google_map_dragdrop_geojson.html..
	  var marker = new google.maps.Circle({
	    strokeColor: pointColor,
	    fillColor: pointColor,
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



module.exports = GmapHandler;