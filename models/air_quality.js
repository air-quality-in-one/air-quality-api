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

module.exports = mongoose.model('AirQuality', AirQualitySchema);