"use strict";
var server
, http     = require('./http.js');
        
http.createServer(8861).server;
console.log("Server running at http://127.0.0.1:8861");