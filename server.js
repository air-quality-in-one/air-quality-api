'use strict';

require('newrelic');

var restify = require('restify'),
	mongoose = require('mongoose');

var settings = require('./config');

var CityManager = require('./controllers/city_manager'),
  AirQualityManager = require('./controllers/air_quality_manager');

var cityBasePath = '/cities';
var qualityBasePath = '/quality';


var server = restify.createServer({
  name: 'air-quality-api',
  version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.use(restify.throttle({
  burst: 100,
  rate: 50,
  ip: true
}));

server.get({path : cityBasePath , version : '0.0.1'} , CityManager.findAllCities);
server.get(
    {path : qualityBasePath , version : '0.0.1'} , 
    AirQualityManager.findQualityForAllCities);

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
  server.listen((process.env.PORT || 5010), function () {
  	console.log('%s listening at %s', server.name, server.url);
  });
});