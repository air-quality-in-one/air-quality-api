'use strict';

var express = require('express');
var router = express.Router();

var fs= require('fs'),
	path = require('path');

var CityManager = require('../controllers/city_manager'),
  AirQualityManager = require('../controllers/air_quality_manager');

router.route('/').get(function (req, res, next) {
	console.log("request index");
	fs.readFile(path.join(__dirname, '../api-doc-spec.json'),{encoding:'utf-8'}, function (err,bytesRead) {
    	if (err) {
    		console.log("Error when reading file : " + err);
    		res.setHeader('Access-Control-Allow-Origin','*');
			res.send(500);
			return next();
    	};
    	var data=JSON.parse(bytesRead);
    	console.log(data[0]);
    	console.log("readFile success");
    	res.send(200, data);
    	return next();
	});
});

router.route('/cities').get(CityManager.findAllCities);

router.route('/cities/:city').get(CityManager.findQuality);

router.route('/cities/:city/aqis/:date').get(AirQualityManager.findAQIHistory);

router.route('/rank').get(AirQualityManager.findQualityForAllCities);

exports.router = router;