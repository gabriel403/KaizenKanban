"use strict";
var sl     	= require('./server-js/serviceLocator.js');
// var http     = require('./server-js/http.js');
var http 	= sl.get('kkhttp');
http.createServer(8861);
console.log(http.connectionToString());