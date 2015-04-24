'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var _ = require('lodash');

var AQIHistorySchema = new Schema({
    city: {
        type: String,
        required: true,
        trim: true
    },
    report_date : {
    	type: String,
        required: true,
        trim: true
    },
    aqis: [{
		type: String,
        trim: true
	}],
});


AQIHistorySchema.static('findByCityAndDate', function(city, date, callback) {
    console.log("Try to load AQIHistory of  " + city + " on " + date);
    var query = {
        "city" : city,
        "report_date" : date
    };
    this.find(query)
        .select('city report_date aqis -_id')
        .exec(function(err, historyArray) {
        if (err) {
            return callback(err);
        } else {
            console.log("Loaded AQIHistory : " + JSON.stringify(historyArray));
            return callback(null, _.first(historyArray));
        }
    });
});

module.exports = mongoose.model('AQIHistory', AQIHistorySchema);