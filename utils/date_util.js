'use strict';

var moment = require('moment-timezone');


var isDateWithinXDays = function (date, day) {
	var xDaysBefore = moment.tz("Asia/Shanghai")
		.subtract(day, 'days').dayOfYear();
	var specifiedDate = moment.tz(date, "Asia/Shanghai").dayOfYear();
	var current = moment.tz("Asia/Shanghai").dayOfYear();
	if (xDaysBefore >= specifiedDate) {
		return false;
	}

	if (specifiedDate > current) {
		return false;
	}

	return true;
}

exports.isDateWithinXDays = isDateWithinXDays;