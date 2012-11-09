var fs          		= require('fs'),
sl         				= require('./serviceLocator.js');

var router 				= {};

router.map = {
	'default': 'default'
}

router.extTypes     	= {'/' : '/index.html'};

router.specialCaseCheck =  function(path) {
    if ( path in router.extTypes ) {
        return router.extTypes[path];
    } else {
        return path;
    }
}

router.init = function(){
	router.parsedUrl 	= '';
	router.path 		= '';
	router.httpcode		= 200;
	router.headdata		= {'Content-Type': 'text/html'};
	router.pagedata		= "";
}

router.route 			= function(request, requestdata, callback) {
	router.init();
	router.parsedUrl	= sl.get('url').parse(request.url);
	router.path     	= router.specialCaseCheck(router.parsedUrl.pathname);

	sl.get('winston').info("parsed router info", {path: router.path});

	var routeresponse 	= {};

	if ( router.path in router.map ) {
		sl.get('winston').info("route found", {map: router.map[router.path]});
		router[router.map[router.path]](request, requestdata, callback);
	} else {
		sl.get('winston').info("Default route");
		router[router.map.default](request, requestdata, callback);
	}
}

router.default 			= function(request, requestdata, callback) {
	var filepath = __dirname + '/..' + router.path;
	sl.get('winston').info("file path", {filepath: filepath});

	fs.readFile(filepath, function(err, data){
        if (err) {
            sl.get('winston').error("error in reading path ",{err:err});
            router.httpcode = 404;
        } else {
        	sl.get('winston').info("received page data from file");
            router.headdata['Content-Type'] = sl.get('transferTypes').getContentType(sl.get('transferTypes').getExt(router.path));
            router.pagedata = data;
        }

		// winston.info("route response", {'httpcode': router.httpcode, 'headdata': router.headdata, 'pagedata': router.pagedata});

		if ( 'undefined' != typeof callback ) {
			callback({'httpcode': router.httpcode, 'headdata': router.headdata, 'pagedata': router.pagedata});
		}
    });
}

exports.route = router.route;