// +++++ Configuration: +++++
var Config = require('./config'),
	config = new Config(); // config file for varying devices
// ++++++++++++++++++++++++++

// +++++ Packages: +++++
var express    = require('express'); // call express
var app        = express(); // define our app using express
var server = app.listen(config.NODEJS_PORT, config.NODEJS_IP); // attempting to host on LAN
var io = require('socket.io').listen(server);
var path = require('path');
// +++++++++++++++++++++

// var mongoose = require('mongoose');  // MongoDB made easier, if needed (Schemas, etc.)
// var projects_obj = require('./models/projects'); // Example of importing a JS module


app.use(express.static('public'));  // set Express to use "public" folder for js/css/html content
// app.use('/scripts', express.static(path.join(__dirname + 'node_modules/')));
app.use('/bower_components', express.static(path.join(__dirname + '/bower_components')));
app.use('/node_modules/roslib', express.static(path.join(__dirname + '/node_modules/roslib')));
app.use('/node_modules/eventemitter2', express.static(path.join(__dirname + '/node_modules/eventemitter2')));


// +++++ Routes: +++++
app.get('/', function(req, res) {

	// res.render('main', {'proj_name': ''}); // load main.jade
	res.sendFile(path.join(__dirname + '/public/html/index.html'));

});
// app.get('/:project', function (req, res) {
// 	var project = req.params.project;
// 	res.render(project, projects_obj[project]);
// });
// +++++++++++++++++++


// +++++ DB Connection +++++
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error: '));
// db.once('open', function (callback) {
// 	console.log("database is open!");
// 	console.log(callback);
// });
// +++++++++++++++++++++++++


console.log('>>> Access page at: http://' + config.NODEJS_IP + ':' + config.NODEJS_PORT)