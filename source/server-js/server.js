"use strict";
var sl     	= require('./serviceLocator.js');
var http 	= new (sl.get('kkhttp').http);
http.createServer(process.env.PORT || 8861, "0.0.0.0");
console.log(http.connectionToString());