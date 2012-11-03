var http    = require('http'),
router      = require('./router.js'),
server;

var self = module.exports = {
    createServer: function(port) {
    	if ( typeof port == undefined)
    		port = 8000;
        this.server = http.createServer(function(req,res){
            router.route(req,res);
        }).listen(port);
        return this;
    }

}
