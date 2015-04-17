

var express = require('express'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	compression = require('compression'),
	mongoose = require('mongoose'),
	path = require('path');

var settings = require('./config');

// Create our Express server
var server = express();
// Use environment defined port or 3000
server.set('name', 'air-quality-api');
server.set('port', (process.env.PORT || 3000));
server.set('view engine', 'ejs');

server.use(compression());
//static resources for stylesheets, images, javascript files
server.use(express.static(path.join(__dirname, 'public')));
server.use(cookieParser());
//Session Configuration
server.use(session({
  secret: 'keyboard cat',
  cookie: {}
}));
// Use the body-parser package in our application
server.use(bodyParser.urlencoded({
  extended: true
}));

server.get('/', function(req, res, next) {
      res.send(200, "Welcome!");
      return next();
    });

var dbUri;
// check if run on heroku
if (process.env.NODE_ENV === 'production') {
  dbUri = settings.product_db.uri;
} else {
  dbUri = settings.database.uri;
}

mongoose.connect(dbUri, function(err) {
  if (err) {
    throw err;
  }
  server.listen(server.get("port"), function () {
  	console.log('%s listening at %s', server.get("name"), server.get("port"));
  });
});