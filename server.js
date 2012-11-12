//hack for cloudeno.de
"use strict";
console.log("heroku hack");
var sl     	= require('./source/server-js/serviceLocator.js');
// var http     = require('./server-js/http.js');
var http 	= sl.get('kkhttp');
http.createServer(process.env.PORT, "0.0.0.0");
console.log(http.connectionToString());