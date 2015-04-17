'use strict';

var express = require('express');
var router = express.Router();


router.route('/').get(function (req, res) {
	console.log("request index");
	res.render('index');
});


router.route('/health').get(function (req, res, next) {
	res.send("Welcome! All is well!");
    return next();
});

exports.router = router;