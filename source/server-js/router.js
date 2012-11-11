var fs 					= require('fs'),
util 					= require('util'),
sl 						= require('./serviceLocator.js'),
domain 					= require('domain'),
events 					= require('events');
var Router 				= function(){
	var self 			= this;
	events.EventEmitter.call(self);
	// self.on('merror', 		self.errorHandler);
	self.on('sendmessage', 	self.messageHandler);
};//new events.EventEmitter();
// Router.prototype 		= new events.EventEmitter;

util.inherits(Router, events.EventEmitter);

// Router.prototype.errorHandler = function(errorcode, message){
// 	var self 		= this;
// 	if ( typeof message != "string" ) {
// 		message = message.message;
// 	}
// 	sl.get('logger').error("obj erro", {errorcode: errorcode, message: message});
// 	self.httpcode	= errorcode;
// 	self.pagedata	= message;
// 	self.sendMessage(self.getReponseObject());
// }

Router.prototype.messageHandler = function(message){
	var self 		= this;
	self.pagedata	= message;
	self.sendMessage(self.getReponseObject());
}

Router.prototype.map 				= {
	'default'	: {'callback': 'default', 	'type': 'normal', 	'location': 'self'},
	'/card'		: {'callback': 'rest', 		'type': 'json', 	'location': 'cardController'}
};

Router.prototype.extTypes     	= {'/' : '/index.html'};

Router.prototype.parsedUrl 		= '';
Router.prototype.path 			= '';
Router.prototype.httpcode		= 200;
Router.prototype.headdata		= {'Content-Type': 'text/html'};
Router.prototype.pagedata		= "";

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
	sl.get('logger').info("getting from sl", {object: self.map[self.path].location});
	var destobj 					= sl.get(self.map[self.path].location);

	var obj 						= new (destobj.obj)();

	obj.on('sendmessage', 	function(message){
		self.pagedata	= message;
		self.sendMessage(self.getReponseObject());
	});

	if ( request.method in obj ) {
		sl.get('logger').info("calling on object", {method: request.method});
		obj[request.method](self.parsedUrl)
	} else {
		sl.get('logger').error("error no method in object", {method: request.method, object: self.map[self.path].location});
		throw new Error("404").code = 404;
	}
}

Router.prototype.default 			= function(request, requestdata) {
	var self 						= this;
	var filepath 		= __dirname + '/..' + self.path;
	
	sl.get('logger').info("file path", {filepath: filepath});

	fs.readFile(filepath, 'utf8', function(err, data){
		if (err) {
			err.code = 404;
			throw err;
		}
		sl.get('logger').info("received page data from file");
		self.headdata['Content-Type'] = sl.get('transferTypes').getContentType(sl.get('transferTypes').getExt(self.path));
		self.pagedata = data;

		self.sendMessage(self.getReponseObject());
	});
}

Router.prototype.handle 			= function(request, requestdata){
	var self 						= this;
	self.parsedUrl	= sl.get('url').parse(request.url, true);
	self.path     	= self.specialCaseCheck(self.parsedUrl.pathname);

	sl.get('logger').info("parsed Router info", {path: self.path});

	if ( self.path in self.map ) {
		sl.get('logger').info("route found", {map: self.map[self.path]});
		self[self.map[self.path].callback](request, requestdata);
	} else {
		sl.get('logger').info("Default route");
		self[self.map.default.callback](request, requestdata);
	}
}

Router.prototype.getReponseObject 	= function(){
	var self 						= this;
	return {'httpcode': self.httpcode, 'headdata': self.headdata, 'pagedata': self.pagedata};
}

var route 				= function(request, requestdata, callback) {
	var router 			= new Router();
	router.sendMessage 	= callback;

	var d = domain.create();
	d.on('error', function(err) {
		sl.get('logger').error("domain error", {err: err});
		router.pagedata	= err;
		if ( typeof err != "string" ) {
			router.pagedata = err.message;
			router.pagedata += err.stack;
		}
		router.httpcode = 500;
		if ( 'number' ==  typeof err.code) {
			router.httpcode = err.code;
		}
		router.sendMessage(router.getReponseObject());
	});
	d.run(function(){router.handle(request, requestdata);});

	
}

exports.route 				= route;
// exports.setupConnections 	= Router.setupConnections;