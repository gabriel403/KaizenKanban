define([ "dojo/_base/declare", "dojo/json", "dojo/topic", "dojo/_base/lang",
	"library/factories/store" ],
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
				this.storiesStore.get(node).then(
					lang.hitch(this, function(storenode) {
						storenode.workflow = target;
						// console.log(storenode);
						this.storiesStore.put(storenode);                        
					})
				);
			}
		});
});