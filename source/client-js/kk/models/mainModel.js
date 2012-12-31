define([ "dojo/_base/declare", "dojo/json", "dojo/topic", "dojo/_base/lang", "dojo/when", "library/base/mvc/model",
	"library/factories/store" ],
	function(declare, json, topic, lang, when, base,
	 storeFactory){
		return declare([base], {
			storiesStore	: null,
			workflowStore	: null,
			setupStores		: function(){
				this.workflowStore 	= storeFactory.getInstance("/workflow/", 'id', 'jsonCache');
				this.storiesStore 	= storeFactory.getInstance("/stories/", 'id', 'jsonCache');
			},
			setupConnections: function(){
				topic.subscribe("/kk/dndUpdateStore", 	lang.hitch(this, this.updateStores));
				topic.subscribe("/kk/newStory", 		lang.hitch(this, this.newStory));
				topic.subscribe("/kk/newWorkflow", 		lang.hitch(this, this.newWorkflow));
			},
			newWorkflow		: function(workflow){
				workflow.initialstate = 'openedSource';
				when(this.workflowStore.put(workflow), function(returnVal){
					topic.publish("/kk/dndNewWorkflow", returnVal);
				});
			},
			newStory 		: function(story){
				when(this.storiesStore.put(story), function(returnVal){
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