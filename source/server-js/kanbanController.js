var sl 			= require('./serviceLocator.js'),
fs 				= require('fs'),
util 			= require('util'),
events 			= require('events');

var KanbanController 				= function(){
	events.EventEmitter.call(this);
};

util.inherits(KanbanController, events.EventEmitter);

KanbanController.prototype.storiesfile 		= __dirname + '/stories.json';
KanbanController.prototype.querymatcher 	= false;
KanbanController.prototype.querymatcherType = "workflow";

KanbanController.prototype.jsonquery 		= function(err, jsonstr) {
	// console.log(this);
	if (err) throw err;
	var self = this;

	sl.get('logger').info("Parsing json string and removing non-"+self.querymatcher);

	if ( !self.querymatcher ) {
		sl.get('logger').info("Emitting sendmessage");
		this.emit('sendmessage', jsonstr);
		return;
	}

	var jsonobj 	= JSON.parse(jsonstr);
	var newjsonobj 	= [];
	for ( var i in jsonobj ) {
		if ( jsonobj[i][self.querymatcherType] == self.querymatcher ) {
			newjsonobj.push(jsonobj[i]);
		}
	}
	sl.get('logger').info("Emitting sendmessage");
	this.emit('sendmessage', JSON.stringify(newjsonobj));
}

KanbanController.prototype.GET 				= function(options) {
	var self = this;
	sl.get('logger').info("GET got called", util.inspect(options));

	if ( 'type' in options.query ) {
		self.storiesfile = __dirname + '/'+options.query.type+'.json'
	}

	if ( 'workflow' in options.query ) {
		// get specific cards for workflow
		self.querymatcher = options.query.workflow;
	} else if ( 'id' in options.query ) {
		self.querymatcher 		= options.query.id;
		self.querymatcherType 	= "id";
	}
	self.readJsonFile(self.jsonquery);
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

exports.obj = KanbanController;