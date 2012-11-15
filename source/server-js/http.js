var sl                  = require('./serviceLocator.js');


var httpserver          = {}

httpserver.init         = function(){
    httpserver.port     = 8000;
    httpserver.host     = "127.0.0.1";
    httpserver.server   = null;
    httpserver.router   = null;
}

httpserver.createServer = function(port, host) {
    httpserver.init();
	if ( typeof port != "undefined") {
		httpserver.port = port;
	}
	if ( typeof host != "undefined") {
		httpserver.host = host;
	}

    httpserver.router   = sl.get('router');

    httpserver.server   = sl.get('http').createServer(httpserver.onRequest).listen(httpserver.port, httpserver.host);
    return httpserver;
}

httpserver.onRequest    = function(request,response){
    var data = '';
    request.on('data',  function (chunk) {data += chunk;});
    request.on('end',   function () {
        sl.get('logger').info('Hit request end');
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
            sl.get('logger').info("Sending routingresponse details", {status: routingresponse.httpcode, headers: routingresponse.headdata})
            // sl.get('logger').info("Sending routingresponse body", {body: routingresponse.pagedata})
            response.writeHead(routingresponse.httpcode, routingresponse.headdata);
            response.end(routingresponse.pagedata);
        });
    });
}

// httpserver.routing              = f

httpserver.connectionToString   = function() {
	return "Server running at http://" + httpserver.host + (80 == httpserver.port ? "" : ":"+httpserver.port);
}

exports.createServer            = httpserver.createServer;
exports.connectionToString      = httpserver.connectionToString;