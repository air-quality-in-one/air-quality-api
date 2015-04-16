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

function findQualityHistory(req, res , next) {
	var city = req.params.city;
	var date = req.params.date;
	console.log(city + " : " + date);
	if (city == null || city === "" 
		|| date == null || date === ""
		|| !isValidDate(date)) {
		res.setHeader('Access-Control-Allow-Origin','*');
		res.send(400, "Invalid Parameters!");
		return next();
	}

	res.send(200, city + " : " + date);
	return next();
}

function isValidDate(date) {
	var reg = /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/ig
	var isValid = reg.test(date);
	console.log("Date " + date + "is valid ? " + isValid);
	return isValid;
}


exports.findQualityForAllCities = findQualityForAllCities;
exports.findQuality = findQuality;
exports.findQualityHistory = findQualityHistory;