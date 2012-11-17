var sl                  = require('./serviceLocator.js');

var httpserver                      = function(){
    this.port     = 8000;
    this.host     = "127.0.0.1";
    this.server   = null;
    this.router   = null;
}

httpserver.prototype.createServer   = function(port, host) {
    var self = this;
	if ( typeof port != "undefined" ) {
		self.port = port;
	}
	if ( typeof host != "undefined" ) {
		self.host = host;
	}

    self.server   = sl.get('http').createServer(self.onRequest).listen(self.port, self.host);
    return self;
}

httpserver.prototype.onRequest      = function(request, response){
    var data = '';
    request.on('data',  function (chunk) {data += chunk;});
    request.on('end',   function () {
        sl.get('logger').info('Hit request end', request.url);
        sl.get('router').route(request, data, function (err, routingresponse) {
            if (err) {
                var httpcode = 500;
                if ( 'number' ==  typeof err.code) {
                    httpcode = err.code;
                }
                response.writeHead(httpcode);
                response.end(err.message + '\n' + err.stack);
                return;
            }
            sl.get('logger').info("Sending routingresponse details", {status: routingresponse.httpcode, headers: routingresponse.headdata, encoding: routingresponse.encoding})
            // sl.get('logger').info("Sending routingresponse body", {body: routingresponse.pagedata})
            response.writeHead(routingresponse.httpcode, routingresponse.headdata);
            response.end(routingresponse.pagedata, routingresponse.encoding);
        });
    });
}

// httpserver.routing              = f

httpserver.prototype.connectionToString   = function() {
    var self = this;
	return "Server running at http://" + self.host + (80 == self.port ? "" : ":"+self.port);
}

exports.http            = httpserver;