define([ "dojo/_base/declare", "dojo/json", "dojo/topic", "dojo/_base/lang",
	"library/factories/store", 
	"dojo/text!kk/models/json/workflow.json", "dojo/text!kk/models/json/stories.json" ],
    function(declare, json, topic, lang,
     storeFactory, 
     workflowJson, storiesJson){
        return declare([ ], {
            storiesStore	: null,
            workflowStore	: null,
            constructor		: function(props){
                lang.mixin(this, props);
                this.init();
            },
            init			: function(){
                this.workflowStore 	= storeFactory.getInstance(json.parse(workflowJson), 'id');
                this.storiesStore 	= storeFactory.getInstance(json.parse(storiesJson), 'id');
        		this.setupConnections();
            },
            setupConnections: function(){
                topic.subscribe("/kk/dndUpdateStore", lang.hitch(this, this.updatestores));
            },
            updatestores	: function(source, target, node){
                this.storiesStore.get(node).workflow = target;
            }
        });
});