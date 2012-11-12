define([ "dojo/_base/declare", "dojo/json", "dojo/topic", "dojo/_base/lang",
	"library/factories/store", 
	"dojo/text!kk/models/json/workflow.json" ],
    function(declare, json, topic, lang,
     storeFactory, 
     workflowJson){
        return declare([ ], {
            storiesStore	: null,
            workflowStore	: null,
            constructor		: function(props){
                lang.mixin(this, props);
                this.init();
            },
            init			: function(){
                this.workflowStore 	= storeFactory.getInstance("/workflow/", 'id');
                this.storiesStore 	= storeFactory.getInstance("/stories/", 'id');
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