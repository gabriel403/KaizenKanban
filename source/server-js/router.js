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
};

util.inherits(Router, events.EventEmitter);

var prepRe = (function () {
    var specials = '/ + ? | ( ) [ ] { } \\ ^ ? ! = : $'.split(' ').join('|\\');
    var re = new(RegExp)('(\\' + specials + ')', 'g');

    return function (str) {
        return (typeof(str) === 'string') ? "^"+str.replace(re, '\\$1').replace("*", "(\\w*)")+"$" : str;
    };
})();

Router.prototype.messageHandler = function(message){
	var self 		= this;
	self.pagedata	= message;
	self.sendMessage(null, self.getReponseObject());
}

Router.prototype.map 			= {
	'default'	: {'callback': 'default', 	'type': 'normal', 	'location': 'self'},
	'/card/*'	: {'callback': 'rest', 		'type': 'json', 	'location': 'cardController'}
};

Router.prototype.extTypes     	= {'/' : '/index.html'};

Router.prototype.parsedUrl 		= '';
Router.prototype.path 			= '';
Router.prototype.httpcode		= 200;
Router.prototype.headdata		= {'Content-Type': 'text/html'};
Router.prototype.pagedata		= "";
Router.prototype.route			= "";

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

	obj.on('sendmessage', 	function(message){
		self.pagedata	= message;
		self.sendMessage(null, self.getReponseObject());
	});

	if ( request.method in obj ) {
		sl.get('logger').info("calling on object", {method: request.method});
		obj[request.method](self.parsedUrl)
	} else {
		// pattern = escapeRe(pattern)

		sl.get('logger').error("error no method in object", {method: request.method, object: self.route.location});
		throw new Error("No method in object").code = 404;
	}
}

Router.prototype.default 			= function(request, requestdata) {
	var self 						= this;
	var filepath 		= __dirname + '/..' + self.path;
	
	sl.get('logger').info("file path", {filepath: filepath});

	fs.readFile(filepath, 'utf8', function(err, data){
		if (err) {
			err.code 	= 404;
			err.message = "Failed to find "+self.path;
			throw err;
		}
		sl.get('logger').info("received page data from file");
		self.headdata['Content-Type'] = sl.get('transferTypes').getContentType(sl.get('transferTypes').getExt(self.path));
		self.emit('sendmessage', data);
	});
}

Router.prototype.handle 			= function(request, requestdata){
	var self 						= this;
	self.parsedUrl	= sl.get('url').parse(request.url, true);
	self.path     	= self.specialCaseCheck(self.parsedUrl.pathname);

	sl.get('logger').info("parsed Router info", {path: self.path});

	var routeselection = "default";

	if ( self.path in self.map ) {
		routeselection = self.path;
	} else {
		for ( var i in self.map ) {
			var regex = self.path.match(new RegExp(prepRe(i)));
			if ( null != regex ) {
				// console.log("matched to", i);
				routeselection = i;
			}
			if ( null != regex && regex.length > 1 && regex[1].length > 0 ) {
				self.parsedUrl.query.id = regex[1];
				// console.log("id found", regex[1]);
			}
		}
	}
	self.route = self.map[routeselection];
	sl.get('logger').info(routeselection+" route");
	self[self.route.callback](request, requestdata);
}

Router.prototype.getReponseObject 	= function(){
	var self 						= this;
	return {'httpcode': self.httpcode, 'headdata': self.headdata, 'pagedata': self.pagedata};
}

var route 				= function(request, requestdata, callback) {
	var router 			= new Router();
	router.sendMessage 	= callback;

	var d 				= domain.create();
	d.on('error', 		function(err) {
		sl.get('logger').error("domain error", {err: err});
		callback(err);
	});
	// d.on('sendmessage',	function(message){
	// 	sl.get('logger').info("received sendmessage", {message: message});
	// 	router.pagedata	= message;
	// 	callback(null, router.getReponseObject());
	// });
	d.run(function(){router.handle(request, requestdata);});

	
}

exports.route 				= route;
// exports.setupConnections 	= Router.setupConnections;