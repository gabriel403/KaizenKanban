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
            movingNodes:        [],
            kbcs:               [],
            moveStart:          function(source, nodes, copy){
                this.movingNodes = nodes;
                this.movingNodes.forEach(function(node){query('div', node).style('visibility', 'hidden');});

                query('.dojoDndAvatar').style('width', nodes.style('width')+'px');
                query('.dojoDndAvatar').style('height', nodes.style('height')+'px');
            },
            moveStop:           function(source, nodes, copy, target){
                this.movingNodes.forEach(function(node){query('div', node).style('visibility', 'visible');});
                this.movingNodes = [];

                if ( typeof nodes == "undefined" ) {
                    return;
                }

                // console.log(source.node.id);
                // console.log(target.node.id);
                nodes.forEach(
                    function(node){
                        topic.publish("/kk/dndUpdateStore", source.node.id, target.node.id, domAttr.get(node, 'dnddata'));
                        // console.log(domAttr.get(node, 'dnddata'));
                });
                topic.publish("/kk/nodemoved");
            },
            moveOver:           function(before){
                var beforeAfterNodes    = before?query('.dojoDndItemBefore'):query('.dojoDndItemAfter');
                var position            = before?'before':'after';

                if ( 0 == this.movingNodes.length || 0 == beforeAfterNodes.length ) {
                    return;
                }

                var itemOver            = beforeAfterNodes[0];

                this.movingNodes.forEach(function(node){domConstruct.place(node, itemOver, position);});                
            },
            moveOut:            function(e){
                if ( 0 == this.movingNodes.length ) {
                    return;
                }
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
                aspect.after(source.dndSource, '_markTargetAnchor', lang.hitch(this, this.moveOver), true);
                //aspect.after(source, 'onDraggingOut', lang.hitch(this, this.moveOut), true);
                // query('.dojoDndItem', source.node).on('click', lang.hitch(this, this.clickOnCard));
                //topic.subscribe("/dnd/source/over", moveStop);

            },
            addOnetimeListeners: function(){
                topic.subscribe("/dnd/start",   lang.hitch(this, this.moveStart));
                topic.subscribe("/dnd/drop",    lang.hitch(this, this.moveStop));
                topic.subscribe("/dnd/cancel",  lang.hitch(this, this.moveStop));
                // on(win.body(), 'click', lang.hitch(this, this.clickOnCard));
                //topic.subscribe("/dnd/source/over", moveStop);
            },
            postCreate:         function() {
                this.addOnetimeListeners();
                var outernode = this.columnNodes;
                this.workflowstepsStore.query().then(lang.hitch(this, this.processWorkflows));
            },
            processWorkflows: function(workflows) {
                array.forEach(workflows, 
                    function(item, index, workflowarray){
                        var itemid      = item.id;
                        var kbcSource   = new kanbanColumn({item: item});
                        this.kbcs.push(kbcSource);
                        kbcSource.placeAt(this.columnNodes)
                        this.kanbancardsStore.query({workflow: itemid}).then(lang.hitch(this, this.processCards, kbcSource));
                    }, 
                this);

            },
            processCards: function(kbcSource, cards) {
                kbcSource.dndSource.insertNodes(false, cards);
                this.addCommonListeners(kbcSource);
                topic.publish('/kk/finishedkanban');
                this.processOrderPlaceWorkflows();
            },
            processOrderPlaceWorkflows: function() {
            }
        });
});
