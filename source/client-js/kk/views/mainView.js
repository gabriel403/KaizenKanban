define(["dojo/_base/declare", "library/base/mvc/view", "kk/views/widgets/kanbanBoard/kanbanBoard", 
	"dojo/dom-style", "dojo/query", "dojo/topic", "dojo/_base/lang", "dojo/_base/array", "dojo/dom", 
    "dojo/dom-class", "dojo/NodeList-traverse"],
    function(declare, baseView, kanbanBoard, domStyle, query, topic, lang, array, dom, domClass){
        return declare([baseView], {
            mainModel: null,
            construct          : function(props){
                land.mixin(this, props);
            },
        	setupDijits        : function(){
        		new kanbanBoard({
        			workflowstepsStore	: this.mainModel.workflowStore, 
        			kanbancardsStore	: this.mainModel.storiesStore
        		}).placeAt('outerContainer');
        	},
            setupFinal         : function(){
                topic.publish("/kk/finishedkanban");
            },
        	setupConnections   : function(){
        		topic.subscribe('/kk/finishedkanban', 	lang.hitch(this, this.realignColumns));
        		topic.subscribe('/kk/nodemoved', 		lang.hitch(this, this.realignColumns));
                // query('.columnToggler').on('click', 
                //     function(e){
                //         var nodes = query(e.target).closest(".column");
                //         domClass.toggle(nodes[0], 'minimisedSource');
                //         domClass.toggle(nodes[0], 'openedSource');
                // });
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