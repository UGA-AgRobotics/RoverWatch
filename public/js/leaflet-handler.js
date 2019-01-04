var $ = require('jquery');
require('leaflet');
require('leaflet-filelayer');
require('togeojson');



// Map centers for initial map load:
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

// Feature collection example:
var testGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          31.4754881189,
          -83.5287606801
        ]
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          31.4754900983,
          -83.5287936502
        ]
      }
    }
  ]
};

// Single feature/point example:
var featureTemplate = {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": []
  }	
};

var geojsonMarkerOptions = {
	radius: 1,
	fillColor: "#ff7800",
	color: "#000",
	weight: 1,
	opacity: 1,
	fillOpacity: 0.8
};



var LeafletHandler = {

	map: null,  // gmap object instance
	mapCenter: mapCenters.annexField,  // center location on gmap load
	mapZoom: 20,  // initial zoom for map

	markerCount: 0,  // tracks # of points on map

	pointColorRover: 'blue',  // color of points on map for rover
	pointColorPath: 'black',  // color of points on map for path
	pointColorFlags: 'red',  // color of points on map for flags

	init: function (settings={}) {
		// Any config stuff, initializations, etc.

		var initPos = [LeafletHandler.mapCenter.lat, LeafletHandler.mapCenter.lon];
		LeafletHandler.map = L.map('map-canvas').setView(initPos, LeafletHandler.mapZoom);
		mapLink = 
		    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
		L.tileLayer(
		    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; ' + mapLink + ' Contributors',
		    maxZoom: 18,
		    }).addTo(LeafletHandler.map);

		LeafletHandler.setup();

	},

	setup: function () {
		// jQuery events among other things..
		// google.maps.event.addDomListener(window, 'load', GmapHandler.init);  // ?????
		console.log("inside setup.");
	},

	addMarkerToMap: function (lat, lon, htmlMarkupForInfoWindow, pointColor='purple', pointType='path') {

		// NOTE: The order is [longitude, latitude] instead of [latitude, longitude] for geojson loading in leaflet

		geojsonMarkerOptions.fillColor = pointColor;

		// Plots point by creating a leaflet latLng object:
		var circle = L.circle([lat, lon], geojsonMarkerOptions).addTo(LeafletHandler.map);
		circle.bindPopup(htmlMarkupForInfoWindow);

		// // Plots a geojson point:
		// var geojsonFeature = featureTemplate;
		// geojsonFeature['geometry']['coordinates'] = [parseFloat(lon), parseFloat(lat)];
		// L.geoJSON(geojsonFeature, {
		// 	pointToLayer: function (feature, latlng) {
		// 		return L.circleMarker(latlng, geojsonMarkerOptions);
		// 	}
		// }).addTo(LeafletHandler.map);

		// Pans to latest point on map:
		LeafletHandler.map.panTo({lon: parseFloat(lon), lat: parseFloat(lat)});
   
	}

};



module.exports = LeafletHandler;