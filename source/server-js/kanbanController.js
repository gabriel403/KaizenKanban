var sl 			= require('./serviceLocator.js'),
fs 				= require('fs'),
util 			= require('util'),
events 			= require('events');

var KanbanController 				= function(){
	events.EventEmitter.call(this);
};

util.inherits(KanbanController, events.EventEmitter);

KanbanController.prototype.storiesfile 		= __dirname + '/stories.json';
KanbanController.prototype.queryVal 		= null;
KanbanController.prototype.queryVar 		= 'workflow';

KanbanController.prototype.prepareData		= function(options) {
	var self = this;

	if ( 'type' in options.query ) {
		self.storiesfile = __dirname + '/'+options.query.type+'.json'
	}

	if ( 'workflow' in options.query ) {
		// get specific cards for workflow
		self.queryVal = options.query.workflow;
	}
	if ( 'id' in options.query ) {
		self.queryVal 	= options.query.id;
		self.queryVar 	= "id";
	}
}

KanbanController.prototype.PUT 				= function(options, payload) {
	// var err = new Error("Not yet implemented.");
	// err.code = 501;
	// throw err;

	if ( 'undefined' == typeof payload ) {
		var err = new Error("No payload.");
		err.code = 400;
		throw err;
	}

	var jsonutil 	= sl.get('jsonutil');

	var self 		= this;
	self.payload 	= payload;
	self.prepareData(options);

	console.log(self.payload);

	self.readJsonFile(function(err, data){
		var self 	= this;
		console.log(self.payload);
		data 		= jsonutil.parse(data);
		var dataI 	= jsonutil.jsonindex(data, self.queryVar, self.queryVal);
		data[dataI] = jsonutil.parse(self.payload);
		data 		= jsonutil.stringify(data);
		self.writeJsonFile(data, function(err){
			var self = this;
			self.emit('sendmessage', data);
		});
	});
	// throw new Error("Not yet implemented").code = 501;
}

KanbanController.prototype.POST 			= function(options, payload) {
	var err = new Error("Not yet implemented.");
	err.code = 501;
	throw err;
}

KanbanController.prototype.DELETE 			= function(options, payload) {
	var err = new Error("Not yet implemented.");
	err.code = 501;
	throw err;
}

KanbanController.prototype.GET 				= function(options, payload) {
	var jsonutil 	= sl.get('jsonutil');

	var self = this;
	sl.get('logger').info("GET got called", util.inspect(options));

	self.prepareData(options);

	self.readJsonFile(function(err, data){
		data = jsonutil.parse(data);
		data = (self.queryVar == "id" ? jsonutil.jsonid(data, self.queryVar, self.queryVal) : jsonutil.jsonquery(data, self.queryVar, self.queryVal));
		data = jsonutil.stringify(data);
		this.emit('sendmessage', data);
	});
}

KanbanController.prototype.readJsonFile 	= function(callback) {
	var self = this;
	fs.readFile(self.storiesfile, 'utf8', function(err, data) {
		if (err) throw err;
		sl.get('logger').info("json file received");
		callback.apply(self, [null, data]);
   		// callback(null, data);
   	});
}

KanbanController.prototype.writeJsonFile 	= function(callback) {
	var self = this;
	fs.readFile(self.storiesfile, 'utf8', function(err, data) {
		if (err) throw err;
		sl.get('logger').info("json file received");
		callback.apply(self, [null, data]);
   		// callback(null, data);
   	});
}
KanbanController.prototype.writeJsonFile 	= function(data, callback) {
	var self = this;
	fs.writeFile(self.storiesfile, data, 'utf8', function (err) {
		if (err) throw err;
		sl.get('logger').info("json file saved");
		callback.apply(self, [null]);
	});
}
exports.obj = KanbanController;