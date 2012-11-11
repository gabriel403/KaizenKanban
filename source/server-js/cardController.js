var sl 			= require('./serviceLocator.js'),
fs 				= require('fs'),
util 			= require('util'),
events 			= require('events');

var CardController 				= function(){
	events.EventEmitter.call(this);
};

util.inherits(CardController, events.EventEmitter);

CardController.prototype.storiesfile = __dirname + '/stories.json';
CardController.prototype.workflow = "";

CardController.prototype.jsonquery = function(jsonstr) {
	var self = this;
	var jsonobj = JSON.parse(jsonstr);
	var propname = 'workflow';
	var newjsonobj = [];
	for ( var i in jsonobj ) {
		if ( jsonobj[i][propname] == self.workflow ) {
			newjsonobj.push(jsonobj[i]);
		}
	}
   	this.emit('sendmessage', JSON.stringify(newjsonobj));

}
CardController.prototype.GET = function(options) {
	var self = this;
	sl.get('logger').info("GET got called", options);

	if ( 'workflow' in options.query ) {
		//get specific cards for workflow
		self.workflow = options.query.workflow;
	}
	self.readJsonFile(self.jsonquery);
}

CardController.prototype.readJsonFile = function(callback) {
	var self = this;
	fs.readFile(self.storiesfile, 'utf8', function(err, data) {
		if (err) throw err;
   		sl.get('logger').info("json file received");
   		callback.call(self, data);
	});
}

exports.obj = CardController;