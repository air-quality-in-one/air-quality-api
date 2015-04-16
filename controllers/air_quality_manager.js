'use strict';

var _ = require('lodash');
var AirQuality = require('../models/air_quality');

exports.findQualityForAllCities = function (req, res , next) {
	var sort_by = req.query.sort_by;
	AirQuality.loadLatestData(function (error, qualityArray) {
		if (error) {
			console.log("Error when load all cities : " + error);
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(500);
			return next();
		} else {
			var qualityArraySorted;
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