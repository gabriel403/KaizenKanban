define(["dojo/_base/declare", "library/base/mvc/view", "dijit/Dialog", "kk/views/widgets/kanbanBoard/kanbanBoard", 
	"dijit/form/Button", "kk/views/widgets/newStory/newStoryDialog", "kk/views/widgets/menuBar/menuBar", 
	"kk/views/widgets/kanbanBoard/trashSource", 
	"dojo/dom-style", "dojo/query", "dojo/topic", "dojo/_base/lang", "dojo/_base/array", "dojo/dom", 
	"dojo/dom-class", "dojo/on", "dojo/NodeList-traverse"],
	function(declare, baseView, Dialog, kanbanBoard, 
		Button, newStoryDialog, menuBar, 
		trashSource,
		domStyle, query, topic, lang, array, dom, 
		domClass, on){
		return declare([baseView], {
			mainModel       : null,
			outerContainer  : 'outerContainer',
			titleBar         : 'titleBar',
			newStoryDialog  : null,
			kanbanBoard		: {},
			construct          : function(props){
				land.mixin(this, props);
			},
			setupDijits        : function(){
				this.kanbanBoard = new kanbanBoard({
					workflowstepsStore	: this.mainModel.workflowStore, 
					kanbancardsStore	: this.mainModel.storiesStore
				}).placeAt(this.outerContainer);
				new trashSource({
					workflowstepsStore	: this.mainModel.workflowStore, 
					kanbancardsStore	: this.mainModel.storiesStore
				}).placeAt(this.titleBar);

				new menuBar().placeAt(this.titleBar, 'after').startup();

				this.newStoryDialog = new newStoryDialog({store: this.mainModel.workflowStore}).placeAt(this.outerContainer);
			},
			setupFinal         : function(){
			},
			setupConnections   : function(){
				topic.subscribe('/kk/newstory',         lang.hitch(this, this.newStoryDialog.show));
				topic.subscribe('/kk/finishedkanban',   lang.hitch(this, this.realignColumns));
				topic.subscribe('/kk/nodemoved', 		lang.hitch(this, this.realignColumns));
				on(this.newStoryDialog, 'submit', 		lang.hitch(this, this.newStory));
				topic.subscribe("/kk/dndNewStory", lang.hitch(this, this.newNode));
			},
			newStory: function(story) {
				topic.publish('/kk/newStory', story)
			},
			newNode: function(story) {
				this.kanbanBoard.newNode(story);
				this.newStoryDialog.cancel();
			},
			realignColumns     : function() {
				query('.columnContainer').style('height', '100%');
				var maxHeight = 0;
				query('.columnContainer').forEach(function(item){
					maxHeight = domStyle.get(item, 'height') > maxHeight?domStyle.get(item, 'height'):maxHeight;
				});
				query('.columnContainer').style('height', maxHeight+'px');
			}
		});
});