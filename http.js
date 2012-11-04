var http    = require('http'),
router      = require('./router.js'),
server;

var self = module.exports = {
	port: 8000,
	host: "127.0.0.1",
    createServer: function(port, host) {
    	if ( typeof port != "undefined") {
    		this.port = port;
    	}
    	if ( typeof host != "undefined") {
    		this.host = host;
    	}

        this.server = http.createServer(function(req,res){
            router.route(req,res);
        }).listen(this.port, this.host);
        return this;
    },
    connectionToString: function() {
    	return "Server running at http://"+this.host+(80 == this.port?"":":"+this.port);
    }

}
