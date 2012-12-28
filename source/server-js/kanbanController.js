var sl 			= require('./serviceLocator.js'),
fs 				= require('fs'),
util 			= require('util'),
events 			= require('events');

var KanbanUtil = {
}

KanbanUtil.default 			= function() {
	this.file 			= __dirname + '/stories.json';
	this.queryVal 		= null;
	this.queryVar 		= 'workflow';
}

KanbanUtil.prepareData		= function(options) {
	var self = this;
	self.default();

	if ( 'type' in options.query ) {
		self.file = __dirname + '/'+options.query.type+'.json'
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

KanbanUtil.readJsonFile 	= function(callback) {
	var self = this;
	fs.readFile(self.file, 'utf8', function(err, data) {
		if (err) throw err;
		sl.get('logger').info("json file received", self.file);
		callback.apply(self, [null, data]);
   		// callback(null, data);
   	});
}

KanbanUtil.writeJsonFile 	= function(data, callback) {
	var self = this;
	fs.writeFile(self.file, data, 'utf8', function (err) {
		if (err) throw err;
		sl.get('logger').info("json file saved", self.file);
		callback.apply(self, [null]);
	});
}

var KanbanController 				= function() {
	events.EventEmitter.call(this);
};

util.inherits(KanbanController, events.EventEmitter);

KanbanController.prototype.PUT 				= function(options, payload) {

	if ( 'undefined' == typeof payload ) {
		var err = new Error("No payload.");
		err.code = 400;
		throw err;
	}

	var jsonutil 	= sl.get('jsonutil');

	var self 		= this;
	KanbanUtil.payload 	= payload;
	KanbanUtil.prepareData(options);

	console.log(KanbanUtil.payload);

	KanbanUtil.readJsonFile(function(err, data){
		// var self 	= this;
		console.log(KanbanUtil.payload);
		data 		= jsonutil.parse(data);
		var dataI 	= jsonutil.jsonindex(data, KanbanUtil.queryVar, KanbanUtil.queryVal);
		data[dataI] = jsonutil.parse(KanbanUtil.payload);
		data 		= jsonutil.stringify(data);
		KanbanUtil.writeJsonFile(data, function(err){
			// var self = this;
			self.emit('sendmessage', data);
		});
	});
	// throw new Error("Not yet implemented").code = 501;
}

KanbanController.prototype.POST 			= function(options, payload) {

	if ( 'undefined' == typeof payload ) {
		var err = new Error("No payload.");
		err.code = 400;
		throw err;
	}

	var jsonutil 	= sl.get('jsonutil');

	var self 		= this;
	KanbanUtil.payload 	= jsonutil.parse(payload);
	KanbanUtil.prepareData(options);

	KanbanUtil.readJsonFile(function(err, data){
		// var self 	= this;
		data 		= jsonutil.parse(data);
		KanbanUtil.payload.id = ++data.length;
		console.log(data);
		var pop = data.pop();
		if ( pop != null)
			data.push(pop);
		data.push(KanbanUtil.payload);
		console.log(data);
		data 		= jsonutil.stringify(data);
		KanbanUtil.writeJsonFile(data, function(err){
			// var self = this;
			self.emit('sendmessage', jsonutil.stringify(KanbanUtil.payload));
		});
	});
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

	KanbanUtil.prepareData(options);

	KanbanUtil.readJsonFile(function(err, data){
		data = jsonutil.parse(data);
		data = (KanbanUtil.queryVar == "id" ? jsonutil.jsonid(data, KanbanUtil.queryVar, KanbanUtil.queryVal) : jsonutil.jsonquery(data, KanbanUtil.queryVar, KanbanUtil.queryVal));
		data = jsonutil.stringify(data);
		self.emit('sendmessage', data);
	});
}

exports.obj = KanbanController;