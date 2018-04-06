// data-handler.js

/*
Frontend JS module that handles GPS data: conversions between lat/lon
and UTM (and between lat/lon formats), loading flag files (although this
may be easier to find by keeping all UI events in main.js)
*/



var DataHandler = {

    init: function() {



    },

    events: function() {



    },

    convertDmsToDecimal: function(lat, lon) {
        // lat/lon format: [degree, minute, second]
        var decLat = lat[0] + lat[1]/60.0 + lat[2]/3600.0;
        var decLon = lon[0] + lon[1]/60.0 + lon[2]/3600.0;
        return [decLat, decLon];
    },

    convertDecimalToDms: function() {



    },

    convertLatLonToUtm: function() {



    }



};



module.exports = DataHandler;