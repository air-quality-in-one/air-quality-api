'use strict';

require('newrelic');

var restify = require('restify'),
	mongoose = require('mongoose'),
  restifyRoutes = require('restify-routes');

var settings = require('./config');

var CityManager = require('./controllers/city_manager'),
  AirQualityManager = require('./controllers/air_quality_manager');

var cityBasePath = '/cities';
var rankBasePath = '/rank';


var server = restify.createServer({
  name: 'air-quality-api',
  version: '1.0.0'

});
//server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
/*
server.use(restify.throttle({
  burst: 100,
  rate: 50,
  ip: true
}));
*/
server.pre(restify.pre.sanitizePath());

restifyRoutes.set(server, __dirname + '/routers');

server.get(/\/?.*/, restify.serveStatic({
  directory: './docs/',
  default: 'index.html'
}));

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
  server.listen((process.env.PORT || 5040), function () {
  	console.log('%s listening at %s', server.name, server.url);
  });
});