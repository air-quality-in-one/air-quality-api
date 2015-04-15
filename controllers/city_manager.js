'use strict';

var City = require('../models/city');

exports.findAllCities = function (req, res , next) {
	var query = {};
	var hot = req.query.hot;
	if (hot && hot === 'true') {
		console.log("Load hot cities");
		query.hotspot = true;
	} else {
		console.log("Load all cities");
	}
	City.find(query).select('name spell -_id').exec(function (error, cities) {
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