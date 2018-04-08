// +++++ Configuration: +++++
var config = require('./config')();

// +++++ External Packages: +++++
var express = require('express'); // call express
var app = express(); // define our app using express
var server = app.listen(config.NODEJS_PORT, config.NODEJS_HOST); // attempting to host on LAN
var io = require('socket.io').listen(server);
var path = require('path');



// +++++ Adding static dirs to expose to browser +++++
app.use(express.static(path.join(__dirname + '/public/css')));
app.use(express.static(path.join(__dirname + '/dist')));
app.use('/css', express.static(path.join(__dirname + '/node_modules/bootstrap/dist/css')));


// +++++ Routes: +++++
app.get('/', function(req, res) {

	// res.render('main', {'proj_name': ''}); // load main.jade
	res.sendFile(path.join(__dirname + '/public/html/index.html'));

});


// +++++ DB Connection +++++
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error: '));
// db.once('open', function (callback) {
// 	console.log("database is open!");
// 	console.log(callback);
// });


console.log('>>> Access page at: http://' + config.NODEJS_HOST + ':' + config.NODEJS_PORT)