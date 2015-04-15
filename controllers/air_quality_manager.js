'use strict';

var AirQuality = require('../models/air_quality');

exports.findQualityForAllCities = function (req, res , next) {
	AirQuality.loadLatestData(function (error, qualityArray) {
		if (error) {
			console.log("Error when load all cities : " + error);
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(500);
			return next();
		} else {
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(200, "1111");
			return next();
		}
	});
}