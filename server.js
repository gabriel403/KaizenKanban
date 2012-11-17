"use strict";
var sl     	= require('./source/server-js/serviceLocator.js');
// var http     = require('./server-js/http.js');
var http 	= new (sl.get('kkhttp').http);
http.createServer(process.env.PORT, "0.0.0.0");
console.log(http.connectionToString());