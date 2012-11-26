define([ "dojo/_base/declare", "dojo/json", "dojo/topic", "dojo/_base/lang", "dojo/when",
	"library/factories/store" ],
	function(declare, json, topic, lang, when,
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
				this.workflowStore 	= storeFactory.getInstance("/workflow/", 'id', 'jsonCache');
				this.storiesStore 	= storeFactory.getInstance("/stories/", 'id', 'jsonCache');
				this.setupConnections();
			},
			setupConnections: function(){
				topic.subscribe("/kk/dndUpdateStore", 	lang.hitch(this, this.updateStores));
				topic.subscribe("/kk/newStory", 		lang.hitch(this, this.newStory));
			},
			newStory: function(story){
				when(this.storiesStore.put(story), function(returnVal){
					console.log(returnVal);
					topic.publish("/kk/dndNewStory", returnVal);
				});
			},
			updateStores	: function(sourceId, targetId, storyId){
				when(this.storiesStore.get(storyId),
					lang.hitch(this, function(story) {
						story.workflow = targetId;
						when(this.storiesStore.put(story),function(returnVal){console.log(returnVal);});
					})
				);

			}
		});
});