// data-handler.js

/*
Frontend JS module that handles GPS data: conversions between lat/lon
and UTM (and between lat/lon formats), loading flag files (although this
may be easier to find by keeping all UI events in main.js)
*/

var utmLib = require('utm-latlng');



var DataHandler = {

  decLatLon: {
    lat: null, 
    lon: null
  },

  dsmPos: {
    deg: null,
    min: null,
    sec: null
  },

  dsmLatLon: {
    lat: dsmPos,
    lon: dsmPos
  },

  utmPos: {
    easting: null,
    northing: null,
    zoneNumber: null,
    zoneLetter: null
  },

  init: function() {

  },

  events: function() {

  },

  convertDmsToDecimal: function(dsmLatLon) {
    // Input lat/lon format: [degree, minute, second]
    var newPos = DataHandler.decLatLon;
    newPos = {
        lat: dsmLatLon.lat.deg + dsmLatLon.lat.min/60.0 + dsmLatLon.lat.sec/3600.0;
        lon: dsmLatLon.lon.deg + dsmLatLon.lon.min/60.0 + dsmLatLon.lon.sec/3600.0;
    }
    return newPos;
  },

  convertDecimalToDms: function(decLatLon) {
    // Inputs: lat/lon are single decimal numbers.
    // Returns: [lat,lon], where lat/lon = [deg, min, sec]
    var newPos = DataHandler.dsmLatLon;
    for (coordKey in decLatLon) {
      var coordVal = decLatLon[coordKey];
      newPos[keyName] = {
        deg: parseInt(coordVal),
        min: (coordVal % 1) * 60.0,
        sec: (((coordVal % 1) * 60.0) % 1) * 60.0
      }
    }
    return newPos;
  },

  convertLatLonToUtm: function(lat, lon) {
    // Converts decimal lat/lon to utm object using utm-latlng npm package.
    // Returns: {Easting: xxxx, Northing: xxxx, ZoneNumber: xxxx, ZoneLetter: xxxx}
    return utmLib.convertLatLngToUtm(lat, lon, 16);  // todo: adjust/confirm precision input
  }

};



module.exports = DataHandler;