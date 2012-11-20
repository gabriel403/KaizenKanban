define(["dojo/_base/declare", "library/base/mvc/view", "dijit/Dialog", "kk/views/widgets/kanbanBoard/kanbanBoard", 
	"dijit/form/Button", "kk/views/widgets/newStory/newStoryDialog", "kk/views/widgets/menuBar/menuBar", 
	"dojo/dom-style", "dojo/query", "dojo/topic", "dojo/_base/lang", "dojo/_base/array", "dojo/dom", 
	"dojo/dom-class", "dojo/NodeList-traverse"],
	function(declare, baseView, Dialog, kanbanBoard, 
		Button, newStoryDialog, menuBar, 
		domStyle, query, topic, lang, array, dom, 
		domClass){
		return declare([baseView], {
			mainModel       : null,
			outerContainer  : 'outerContainer',
			menuBar         : 'titleBar',
			newStoryDialog  : null,
			construct          : function(props){
				land.mixin(this, props);
			},
			setupDijits        : function(){
				new kanbanBoard({
					workflowstepsStore	: this.mainModel.workflowStore, 
					kanbancardsStore	: this.mainModel.storiesStore
				}).placeAt(this.outerContainer);

				// var myButton = new Button({
				//     label: "Click me!",
				//     onClick: function(){
				//         myDialog.show();
				//     }
				// }).placeAt(this.outerContainer);

				new menuBar().placeAt(this.menuBar, 'after').startup();

				this.newStoryDialog = new newStoryDialog({store: this.mainModel.workflowStore}).placeAt(this.outerContainer);
				// new newStory({store: this.mainModel.workflowStore}).placeAt('outerContainer');
			},
			setupFinal         : function(){
			},
			setupConnections   : function(){
				topic.subscribe('/kk/newstory',         lang.hitch(this, function(){
						this.newStoryDialog.show();
					}
				));
				topic.subscribe('/kk/finishedkanban',   lang.hitch(this, this.realignColumns));
				topic.subscribe('/kk/nodemoved', 		lang.hitch(this, this.realignColumns));
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