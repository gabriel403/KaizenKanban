var profile = {
    resourceTags: { 
        amd: function (filename, mid) { 
            return /\.js$/.test(filename); 
        } 
    },
    basePath:".",
	action: 'release',
    releaseDir:"./deploy",
	cssOptimize: 'comments',
	mini: true,
	optimize: 'closure',
	layerOptimize: 'closure',
	stripConsole: 'all',
	selectorEngine: 'acme',
    packages:[
	    {
	        name:"dojo",
	        location:"./dtk/dojo"
	    },{
	        name:"dijit",
	        location:"./dtk/dijit"
	    },{
	        name:"kk",
	        location:"./kk"
	    },{
	        name:"library",
	        location:"./library"
	    }
    ],
    layers: {
		'dojo/dojo': {
			include: [ 'dojo/domReady', 'kk/main' ],
			boot: true,
			customBase: true
		}
	},
	staticHasFeatures: {
		'dojo-trace-api': 0,
		'dojo-log-api': 0,
		'dojo-publish-privates': 0,
		'dojo-sync-loader': 0,
		'dojo-xhr-factory': 0,
		'dojo-test-sniff': 0
	}
	
	// staticHasFeatures: {
	// 	'dojo-trace-api': 0,
	// 	'dojo-log-api': 0,
	// 	'dojo-publish-privates': 0,
	// 	'dojo-sync-loader': 1,
	// 	'dojo-xhr-factory': 0,
	// 	'dojo-test-sniff': 0,
	// 	'dojo-amd-factory-scan': 1,
	// 	'dojo-combo-api': 1,
	// 	'dojo-debug-messages': 1
	// }
}