var sl 			= require('../server/serviceLocator.js'),
util 			= require('util'),
events 			= require('events');

var KanbanModel = function(){
	this.file 			= sl.get('config').get('resources')+'/stories.json';
	this.queryVal 		= null;
	this.queryVar 		= 'workflow';
}


KanbanModel.prototype.prepareData		= function(options) {
	var self = this;

	if ( 'type' in options.query ) {
		self.file = sl.get('config').get('resources')+options.query.type+'.json'
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

KanbanModel.prototype.readJsonFile 	= function(callback) {
	var self = this;
	sl.get('fs').readFile(self.file, 'utf8', function(err, data) {
		if (err) throw err;
		sl.get('logger').info("json file received", self.file);
		callback.apply(self, [null, data]);
   		// callback(null, data);
   	});
}

KanbanModel.prototype.writeJsonFile 	= function(data, callback) {
	var self = this;
	sl.get('fs').writeFile(self.file, data, 'utf8', function (err) {
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
	var kbu = new (KanbanModel)();
	var self 		= this;
	kbu.payload 	= payload;
	kbu.prepareData(options);

	// console.log(kbu.payload);

	kbu.readJsonFile(function(err, data){
		// var self 	= this;
		// console.log(kbu.payload);
		data 		= jsonutil.parse(data);
		var dataI 	= jsonutil.jsonindex(data, kbu.queryVar, kbu.queryVal);
		data[dataI] = jsonutil.parse(kbu.payload);
		data 		= jsonutil.stringify(data);
		kbu.writeJsonFile(data, function(err){
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

	var kbu = new (KanbanModel)();
	var self 		= this;
	kbu.payload 	= jsonutil.parse(payload);
	kbu.prepareData(options);

	kbu.readJsonFile(function(err, data){
		// var self 	= this;
		data 		= jsonutil.parse(data);
		kbu.payload.id = ++data.length;
		var pop = data.pop();
		if ( pop != null ) {
			data.push(pop);
		}
		data.push(kbu.payload);

		//loop through data and rearrange order based on order of payload, if there is one
		if ( 'order' in kbu.payload ) {
			for ( var i in data ) {
				if ( 'order' in data[i] && data[i].order > kbu.payload.order ) {
					data[i].order++;
				}
			}
		}

		data 		= jsonutil.stringify(data);
		kbu.writeJsonFile(data, function(err){
			// var self = this;
			self.emit('sendmessage', jsonutil.stringify(kbu.payload));
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

	var kbu = new (KanbanModel)();
	
	var self = this;
	sl.get('logger').info("GET got called", util.inspect(options));

	kbu.prepareData(options);

	kbu.readJsonFile(function(err, data){
		data = jsonutil.parse(data);
		data = (kbu.queryVar == "id" ? jsonutil.jsonid(data, kbu.queryVar, kbu.queryVal) : jsonutil.jsonquery(data, kbu.queryVar, kbu.queryVal));
				//loop through data and rearrange order based on order of payload, if there is one
		if ( data.length > 0 && 'order' in data[0] ) {
			console.log("ordering");
			for ( var i in data ) {
				for ( var x in data ) {
					x = parseInt(x);
					if ( data[x+1] && data[x].order > data[x+1].order ) {
						console.log(x, (x+1), data[x], data[x+1]);
						console.log(x+" > "+(x+1));
						var tmp = data[x+1];
						data[x+1] = data[x];
						data[x] = tmp;
					}
				}
			}
		}
		data = jsonutil.stringify(data);
		self.emit('sendmessage', data);
	});
}

exports.obj = KanbanController;