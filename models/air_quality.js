'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var _ = require('lodash');
var Summary = require('./quality_summary');
var Station = require('./station_detail');

var AirQualitySchema = new Schema({
    city: {
        type: String,
        required: true,
        trim: true
    },
    time_update : {
    	type: Date
    },
    unit : {
    	type: String,
        trim: true
    },
    summary : {
    	type: ObjectId,
		ref: 'Summary',
        required: true
    },
    stations: [{
		type: ObjectId,
		ref: 'Station'
	}],
});

AirQualitySchema.static('loadLatestData', function(callback) {
    this.aggregate([
            { $sort : { city: 1, time_update : 1 } },
            { $project : { city : 1 , time_update : 1, unit : 1, summary : 1 }},
            { $group : {
                _id : {
   
                    city : {$last : "$city"},
                    time_update : {$last : "$time_update"},
                    unit : {$last : "$unit"},
                    summary : {$last : "$summary"}
                    }
            }}
        ], function (err, qualityArray) {
            if (err) {
                console.log("Error when Load latest quality array : " + err);
            }
            console.log("Load latest quality array : " + JSON.stringify(qualityArray));
            callback(null, qualityArray);
        });
});

module.exports = mongoose.model('AirQuality', AirQualitySchema);