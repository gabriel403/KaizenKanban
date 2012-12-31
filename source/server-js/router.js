var fs 					= require('fs'),
util 					= require('util'),
sl 						= require('./serviceLocator.js'),
domain 					= require('domain'),
events 					= require('events');

var prepRe = (function () {
    var specials = '/ + ? | ( ) [ ] { } \\ ^ ? ! = : $'.split(' ').join('|\\');
    var re = new(RegExp)('(\\' + specials + ')', 'g');

    return function (str) {
        return (typeof(str) === 'string') ? "^"+str.replace(re, '\\$1').replace("*", "(\\w*)")+"$" : str;
    };
})();

var Router 				= function(){
	var self 			= this;

	this.extTypes     	= {'/' : '/index.html'};
	this.parsedUrl 		= '';
	this.path 			= '';
	this.httpcode		= 200;
	this.headdata		= {'Content-Type': 'text/html'};
	this.pagedata		= "";
	this.pageencoding 	= "utf8";
	this.route			= "";

	events.EventEmitter.call(self);
};

util.inherits(Router, events.EventEmitter);

Router.prototype.map 			= {
	'default'		: {'callback': 'default', 	'type': 'normal', 	'location': 'self', 			'options': {}},
	'/stories/*'	: {'callback': 'rest', 		'type': 'json', 	'location': 'kanbanController', 'options': {'type': 'stories'}},
	'/workflow/*'	: {'callback': 'rest', 		'type': 'json', 	'location': 'kanbanController', 'options': {'type': 'workflow'}}
};


Router.prototype.specialCaseCheck 	= function(path) {
	var self 						= this;
	if ( path in self.extTypes ) {
		return self.extTypes[path];
	} else {
		return path;
	}
}

Router.prototype.rest 				= function(request, requestdata){
	var self 						= this;
	sl.get('logger').info("getting from sl", {object: self.route.location});
	var destobj 					= sl.get(self.route.location);

	var obj 						= new (destobj.obj)();

	self.headdata['Content-Type'] 	= sl.get('transferTypes').getContentType(self.route.type);

	obj.on('sendmessage', function(data){self.emit('sendmessage', data);});

	if ( request.method in obj ) {
		sl.get('logger').info("calling on object", {method: request.method});
		obj[request.method](self.parsedUrl, requestdata);
	} else {
		// pattern = escapeRe(pattern)
		sl.get('logger').error("error no method in object", {method: request.method, object: self.route.location});
		throw new Error("No method in object").code = 404;
	}
}

Router.prototype.default 			= function(request, requestdata) {
	var self 						= this;
	var filepath 					= __dirname + '/..' + self.path;
	
	sl.get('logger').info("file path", {filepath: filepath});
	self.headdata['Content-Type'] 	= sl.get('transferTypes').getContentType(sl.get('transferTypes').getExt(self.path));
	self.pageencoding 				= sl.get('transferTypes').getContentEncoding(sl.get('transferTypes').getExt(self.path));

	fs.readFile(filepath, self.pageencoding, function(err, data){
		if (err) {
			err.code 	= 404;
			err.message = "Failed to find "+self.path;
			throw err;
		}
		sl.get('logger').info("received page data from file");
		self.emit('sendmessage', data);
	});
}

Router.prototype.handle 			= function(request, requestdata){
	var self 		= this;
	self.parsedUrl	= sl.get('url').parse(request.url, true);
	self.path     	= self.specialCaseCheck(self.parsedUrl.pathname);

	sl.get('logger').info("parsed Router info", {path: self.path});

	var routeselection = "default";

	// straight match
	if ( self.path in self.map ) {
		routeselection = self.path;
	} else {
		for ( var i in self.map ) {
			var regex = self.path.match(new RegExp(prepRe(i)));

			// regexp match
			if ( null != regex ) {
				routeselection = i;
			}

			// regex with id match
			if ( null != regex && regex.length > 1 && regex[1].length > 0 ) {
				self.parsedUrl.query.id = regex[1];
			}
		}
	}
	
	self.route = self.map[routeselection];

	sl.get('kkmixin').hardMixin(self.parsedUrl.query, self.route.options);
	sl.get('logger').info(routeselection+" route");

	self[self.route.callback](request, requestdata);
}

Router.prototype.getReponseObject 	= function(){
	var self 						= this;
	return {'httpcode': self.httpcode, 'headdata': self.headdata, 'pagedata': self.pagedata, 'encoding': self.pageencoding};
}

var route 				= function(request, requestdata, callback) {
	var router 			= new Router();

	var d 				= domain.create();
	d.on('error', 		function(err) {
		sl.get('logger').error("domain error", util.inspect(err));
		callback(err);
	});
	router.on('sendmessage',	function(message){
		router.pagedata	= message;
		callback(null, router.getReponseObject());
	});
	d.run(function(){router.handle(request, requestdata);});
}

exports.route 				= route;