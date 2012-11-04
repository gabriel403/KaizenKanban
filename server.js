"use strict";
var server
, http     = require('./http.js');
        
http.createServer(8861).server;
console.log(http.connectionToString());