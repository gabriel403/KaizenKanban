define(["dojo/_base/declare", "dojo/query", "dojo/dom-style", "dojo/aspect", "dojo/dom-attr", "dojo/on",
	 "dojo/topic", "dojo/dom-construct", "dojo/dom-class", "dojo/_base/lang", "dojo/_base/array",
	 "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
	 "kk/views/widgets/kanbanBoard/kanbanColumn", "kk/views/widgets/kanbanBoard/kanbanCard", "dojo/text!./kanbanBoard.html",
	 "dojo/_base/window", "dojo/NodeList-traverse" ],
	function(declare, query, domStyle, aspect, domAttr, on,
	 topic, domConstruct, domClass, lang, array,
	 _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
	 kanbanColumn, kanbanCard, template,
	 win){
		return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
			templateString:     template,
			workflowstepsStore: {},
			kanbancardsStore:   {},
			originalNodes:		{},
			movingNodes:        [],
			kbcs:               {},
			moveStart:          function(source, nodes, copy){
				this.originSource = source;
				this.movingNodes = nodes;
				this.movingNodes.forEach(function(node){
					query('.itemImg', node).style('visibility', 'hidden');
					query('.itemText', node).style('visibility', 'hidden');
				});

				query('.dojoDndAvatar').style('width', nodes.style('width')+'px');
				query('.dojoDndAvatar').style('height', nodes.style('height')+'px');

				this.movingNodes.forEach(function(node){
					if ( !this.originalNodes[node.id] ) {
						if ( null != node.previousSibling ) {
							this.originalNodes[node.id] = {sibling: node.previousSibling, position: 'after'};
						} else if ( null != node.nextSibling ) {
							this.originalNodes[node.id] = {sibling: node.nextSibling, position: 'before'};
						} else {
							this.originalNodes[node.id] = {sibling: node.parentNode, position: 'first'};
						}
					}
				}, this);
			},
			moveCancel: function(source, nodes, copy, target){
				this.movingNodes.forEach(function(node){
					domConstruct.place(node, this.originalNodes[node.id].sibling, this.originalNodes[node.id].position);
					query('.itemImg', node).style('visibility', 'visible');
					query('.itemText', node).style('visibility', 'visible');
				}, this);

				this.movingNodes 	= [];
				this.originalNodes 	= {};
			},
			moveStop:           function(source, nodes, copy, target){
				this.movingNodes.forEach(function(node){query('div', node).style('visibility', 'visible');});
				this.movingNodes 	= [];
				this.originalNodes 	= {};

				if ( typeof nodes == "undefined" ) {
					return;
				}
				nodes.forEach(
					function(node){
						topic.publish("/kk/dndUpdateStore", source.node.id, target.node.id, domAttr.get(node, 'dnddata'));
				});
				topic.publish("/kk/nodemoved");
			},
			moveOver: function(source){
				if ( null == source ) {
					this.movingNodes.forEach(function(node){
						domConstruct.place(node, this.originalNodes[node.id].sibling, this.originalNodes[node.id].position);
					}, this);
					return;
				}

				var dndbefore = query('.dojoDndItemBefore');
				var dndafter = query('.dojoDndItemAfter');
				var itemOver = null;
				var position = null;
				if ( !source.checkAcceptance(this.originSource, this.movingNodes) ) {
					// console.log('not accepted');
					//remove and reset
					return;
				}


				if ( dndbefore.length == 0 && dndafter.length == 0 ) {
					//insert at bottom of source
					// console.log('insert at bottom', source.node);
					itemOver = source.node;
					position = 'last';
				} else if ( dndbefore.length > 0 ) {
					//insert before node into place
					// console.log('insert before', dndbefore[0]);
					itemOver = dndbefore[0];
					position = 'before';
				} else {
					//insert after node
					// console.log('insert after', dndafter[0]);
					itemOver = dndafter[0];
					position = 'after';
				}

				this.movingNodes.forEach(function(node){
					if ( node == itemOver ) {
						return;
					}
					domConstruct.place(node, itemOver, position);
				});

			},
			clickOnCard:        function(e){
				// query('.dojoDndItem').removeClass('focusedNode');
				// var dndItems = query.NodeList();
				// dndItems.push(e.target);
				// var dndItem = dndItems.closest('.dojoDndItem');
				// if ( 0 == dndItem.length ) {
				//     return;
				// }

				// var focusedNode = dndItem[0];
				// query('.dojoDndItem').removeClass('focusedNode');
				// domClass.toggle(focusedNode, "focusedNode");
			},
			addCommonListeners: function(source){
				aspect.after(source.dndSource, '_markTargetAnchor', lang.hitch(this, this.moveOver, source.dndSource), true);
				// aspect.after(source.dndSource, '_unmarkTargetAnchor', lang.hitch(this, this.checkBeforeCancel), true);
				// query('.dojoDndItem', source.dndSource).on('click', lang.hitch(this, this.clickOnCard));
			},
			addOnetimeListeners: function(){
				topic.subscribe("/dnd/start",   lang.hitch(this, this.moveStart));
				topic.subscribe("/dnd/drop",    lang.hitch(this, this.moveStop));
				topic.subscribe("/dnd/cancel",  lang.hitch(this, this.moveCancel));
				// on(win.body(), 'click', lang.hitch(this, this.clickOnCard));
				topic.subscribe("/dnd/source/over", lang.hitch(this, this.moveOver));
				// topic.subscribe("/kk/dndNewStory", lang.hitch(this, this.newNode));
			},
			//following functions do setup and data retrival
			postCreate:         function() {
				this.addOnetimeListeners();
				var outernode = this.columnNodes;
				this.workflowstepsStore.query().then(lang.hitch(this, this.processWorkflows));
				// this.workflowstepsStore.query(null, {"sort": [{"attribute": "order"}]}).then(lang.hitch(this, this.processWorkflows));
			},
			processWorkflows: function(workflows) {
				array.forEach(workflows, 
					function(item, index, workflowarray){
						var itemid      = item.id;
						var kbcSource   = new kanbanColumn({item: item});
						this.kbcs[itemid] = kbcSource;
						kbcSource.placeAt(this.columnNodes);
						this.addCommonListeners(kbcSource);
						this.kanbancardsStore.query({workflow: itemid}).then(lang.hitch(this, this.processCards, kbcSource));
					}, 
				this);

			},
			processCards: function(kbcSource, cards) {
				kbcSource.dndSource.insertNodes(false, cards);
				topic.publish('/kk/finishedkanban');
			},
			newNode: function(card) {
				this.kbcs[card.workflow].dndSource.insertNodes(false, [card]);
			}
		});
});
