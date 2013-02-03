define(["dojo/_base/declare", "library/base/mvc/view", "dijit/Dialog", "kk/views/widgets/kanbanBoard/kanbanBoard", 
	"dijit/form/Button", "kk/views/widgets/newStory/newStoryDialog", "kk/views/widgets/newWorkflow/newWorkflowDialog", "kk/views/widgets/menuBar/menuBar", 
	"kk/views/widgets/kanbanBoard/trashSource", 
	"dojo/dom-style", "dojo/query", "dojo/topic", "dojo/_base/lang", "dojo/_base/array", "dojo/dom", 
	"dojo/dom-class", "dojo/on", "dojo/NodeList-traverse"],
	function(declare, baseView, Dialog, kanbanBoard, 
		Button, newStoryDialog, newWorkflowDialog, menuBar, 
		trashSource,
		domStyle, query, topic, lang, array, dom, 
		domClass, on){
		return declare([baseView], {
			mainModel       : null,
			outerContainer  : 'outerContainer',
			titleBar       	: 'titleBar',
			newStoryDialog  : null,
			kanbanBoard		: {},
			construct          : function(props){
				land.mixin(this, props);
			},
			// base methods
			setupDijits        : function(){
				this.kanbanBoard = new kanbanBoard({
					workflowstepsStore	: this.mainModel.workflowStore, 
					kanbancardsStore	: this.mainModel.storiesStore
				}).placeAt(this.outerContainer);
				new trashSource({
					workflowstepsStore	: this.mainModel.workflowStore, 
					kanbancardsStore	: this.mainModel.storiesStore
				}).placeAt(this.titleBar, 'first');

				// new menuBar().placeAt(this.titleBar, 'after').startup();

				this.newStoryDialog 	= new newStoryDialog({store: this.mainModel.workflowStore}).placeAt(this.outerContainer);
				this.newWorkflowDialog 	= new newWorkflowDialog({store: this.mainModel.workflowStore}).placeAt(this.outerContainer);
			},
			setupFinal         : function(){
			},
			setupConnections   : function(){
				topic.subscribe('/kk/newstory',         lang.hitch(this, this.newStoryDialog.show));
				topic.subscribe('/kk/newworkflow',      lang.hitch(this, this.newWorkflowDialog.show));

				on(this.newWorkflowDialog, 'submit', 	lang.hitch(this, this.sendNewWorkflow));
				on(this.newStoryDialog, 'submit', 		lang.hitch(this, this.sendNewStory));
				topic.subscribe("/kk/dndNewStory", 		lang.hitch(this, this.receiveNewStory));
				topic.subscribe("/kk/dndNewWorkflow", 	lang.hitch(this, this.receiveNewWorkflow));
			},
			// methods
			sendNewStory		: function(story) {
				topic.publish('/kk/newStory', story)
			},
			sendNewWorkflow		: function(workflow) {
				topic.publish('/kk/newWorkflow', workflow)
			},
			receiveNewStory		: function(story) {
				this.kanbanBoard.newNode(story);
				this.newStoryDialog.cancel();
			},
			receiveNewWorkflow	: function(story) {
				this.newWorkflowDialog.cancel();
			}
		});
});