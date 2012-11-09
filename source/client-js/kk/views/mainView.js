define(["dojo/_base/declare", "library/base/mvc/view", "kk/views/widgets/kanbanBoard/kanbanBoard"],
    function(declare, baseView, kanbanBoard){
        return declare([baseView], {
        	kkbSetup	: function(workflowStore, storiesStore){
        		new kanbanBoard({
        			workflowstepsStore	: workflowStore, 
        			kanbancardsStore	: storiesStore
        		}).placeAt('innerContainer');
        	}
        });
});