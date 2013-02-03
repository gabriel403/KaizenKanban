var vows 	= require('vows'),
assert 		= require('assert');

var config 	= require('../src/server-js/config.js');


vows.describe('Config testing').addBatch({
	'Test config': {
		topic: function(){
			config.set('foo','bar');
			config.set('baz',{});
			return config;
		},
		"Test set/get string": function(config){
			assert.equal(config.get('foo'), 'bar');
		},
		"Test set/get object": function(config){
			assert.isObject(config.get('baz'));
		},
		"Test set/get empty object": function(config){
			assert.deepEqual(config.get('baz'), {});
		},
		"Test set/get throws error on non-set config": function(config){
			assert.throws(function () { config.get('qux') }, Error);
		},
		'Test overwriting':{
			topic: function(config) {
				config.set('foo', 'boo');
				config.set('baz', 'boo', true);
				return config;
			},
			"Test set overwrite fail": function(config){
				assert.notEqual(config.get('foo'), 'boo');
			},
			"Test set overwrite success": function(config){
				assert.equal(config.get('baz'), 'boo');
			}
		}
	}
}).export(module);