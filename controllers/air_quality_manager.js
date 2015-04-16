'use strict';

var _ = require('lodash');
var moment = require('moment-timezone');

var AirQuality = require('../models/air_quality');

function findQualityForAllCities (req, res , next) {
	var sort_by = req.query.sort_by;
	AirQuality.loadLatestQualityForAllCities(function (error, qualityArray) {
		if (error) {
			console.log("Error when load all cities : " + error);
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(500);
			return next();
		} else {
			if (sort_by != null) {
				qualityArray = _.sortBy(qualityArray, function (quality) {
					return parseInt(quality.summary[sort_by]);
				});
			}
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(200, qualityArray);
			return next();
		}
	});
}

function findQuality (req, res , next) {
	var city = req.params.city;
	if (city == null || city === "") {
		return findQualityForAllCities(req, res , next);
	}
	console.log("Load air quality for city : " + city);
	AirQuality.loadLatestQualityForCity(city, function (error, qualityArray) {
		if (error) {
			console.log("Error when load all cities : " + error);
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(500);
			return next();
		} else {
			res.setHeader('Access-Control-Allow-Origin','*');
			var quality = _.last(qualityArray);
			res.send(200, quality);
			return next();
		}
	});
}


exports.findQualityForAllCities = findQualityForAllCities;
exports.findQuality = findQuality;