'use strict';

var City = require('../models/city');

exports.findAllCities = function (req, res , next) {
	console.log("Load all cities");
	City.find().select('name spell -_id').exec(function (error, cities) {
		if (error) {
			console.log("Error when load all cities : " + error);
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(500);
			return next();
		} else {
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(200, cities);
			return next();
		}
	});
	
}