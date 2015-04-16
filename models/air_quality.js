'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var moment = require('moment-timezone');
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

AirQualitySchema.static('loadLatestQualityForCity', function(city, callback) {
    this.aggregate()
        .match({city : city})
        .sort({ time_update : 1 })
        .project({ _id : 0, city : 1 , time_update : 1, unit : 1, summary : 1, stations : 1 })
        .group({
                _id : null,
                city : { $last : "$city"},
                time_update : { $last : "$time_update"},
                unit : { $last : "$unit"},
                summary : { $last : "$summary"},
                stations : { $last : "$stations"}
            })
        .project({ _id : 0, city : 1 , time_update : 1, unit : 1, summary : 1, stations : 1  })
        .exec(function (err, qualityArray) {
            if (err) {
                console.log("Error when Load latest quality array : " + err);
            }
            //console.log("Load latest quality array : " + JSON.stringify(qualityArray));
            loadSummaryDetail(qualityArray, function(err, qualityArray){
                if (err) {
                    console.log("Error when loading summary detail : " + err);
                }
                return loadStations(qualityArray, callback);
            });
        });
});


AirQualitySchema.static('loadLatestQualityForAllCities', function(callback) {
    this.aggregate()
        .sort({ city : -1, time_update : 1 })
        .project({ _id : 0, city : 1 , time_update : 1, unit : 1, summary : 1 })
        .group({
                _id : "$city",
                city : { $last : "$city"},
                time_update : { $last : "$time_update"},
                unit : { $last : "$unit"},
                summary : { $last : "$summary"},
            })
        .project({ _id : 0, city : 1 , time_update : 1, unit : 1, summary : 1 })
        .exec(function (err, qualityArray) {
            if (err) {
                console.log("Error when Load latest quality array : " + err);
            }
            //console.log("Load latest quality array : " + JSON.stringify(qualityArray));
            return loadSummaryDetail(qualityArray, callback);
        });

});



function loadSummaryDetail(qualityArray, callback) {
    //console.log("Try to load summary detail of  AirQuality : " + JSON.stringify(qualityArray));
    var done = _.after(qualityArray.length, function() {
        //console.log('done load AirQuality list : ' + JSON.stringify(qualityArray));
        return callback(null, qualityArray);
    });
    _.each(qualityArray, function (quality) {
        Summary.findById(quality.summary)
            .select('-_id -__v')
            .exec(function (error, summary) {
            if (error) {
                console.log("Fail to load summary : " + quality.summary);
            } else {
                quality.summary = summary;
            }
            done();
        });
        quality.time_update = moment.tz(quality.time_update, "Asia/Shanghai").format();
        //console.log("time_update : " + quality.time_update);
    });
}


function loadStations(qualityArray, callback) {
    //console.log("Try to load summary detail of  AirQuality : " + JSON.stringify(qualityArray));
    var done = _.after(qualityArray.length, function() {
        //console.log('done load AirQuality list : ' + JSON.stringify(qualityArray));
        return callback(null, qualityArray);
    });
    _.each(qualityArray, function (quality) {
        loadStationDetail(quality, done);
    });
}

function loadStationDetail(quality, callback) {
    var stationRecords = [];
    var stations = quality.stations;
    if (stations == null) {
        return callback(null, quality);
    }
    var done = _.after(stations.length, function() {
        quality.stations = stationRecords;
        //console.log('done load station detail : ' + JSON.stringify(quality));
        return callback(null, quality);
    });
    _.each(stations, function (station) {
        Station.findById(station)
            .select('-_id -__v')
            .exec(function (error, stationRecord) {
            if (error) {
                console.log("Fail to load summary : " + station);
            } else {
                stationRecords.push(stationRecord);
            }
            done();
        });
    });
}

module.exports = mongoose.model('AirQuality', AirQualitySchema);