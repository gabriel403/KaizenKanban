define(["dojo/_base/declare", "dojo/query", "dojo/dom-style", "dojo/aspect", "dojo/dom-attr",
     "dojo/topic", "dojo/dom-construct", "dojo/dom-class", "dojo/_base/lang", "dojo/_base/array",
     "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
     "kk/views/widgets/kanbanBoard/kanbanColumn", "kk/views/widgets/kanbanBoard/kanbanCard", "dojo/text!./kanbanBoard.html" ],
    function(declare, query, domStyle, aspect, domAttr,
     topic, domConstruct, domClass, lang, array,
     _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
     kanbanColumn, kanbanCard, template){
        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
            workflowstepsStore: {},
            kanbancardsStore: {},
            movingNodes: [],
            mover: [],
            mout: [],
            dndStart: null,
            dndDrop: null,
            dndCancel: null,
            moveStart: function(source, nodes, copy){
                // console.log(source);
                // console.log(nodes);
                // console.log(copy);
                this.movingNodes = nodes;
                this.movingNodes.style('visibility', 'hidden');
                query('.dojoDndAvatar').style('width', nodes.style('width')+'px');
                query('.dojoDndAvatar').style('height', nodes.style('height')+'px');
                nodes.style('display', 'none');

            },
            moveStop: function(source, nodes, copy, target){
                //source.node.id ul catNode
                this.movingNodes = [];
                query('.dojoDndItemAnchor').style('display', 'block');
                query('.dojoDndItemAnchor').style('visibility', 'visible');
                if ( typeof nodes == "undefined" ) {
                    return;
                }
                console.log(source);
                nodes.forEach(function(node){console.log(domAttr.get(node, 'dnddata'));});
                console.log(target);
            },
            moveOver: function(e){
                if ( 0 == this.movingNodes.length ) {
                    return;
                }

                var position = domClass.contains(itemOver, 'dojoDndItemBefore')?'before':'after';
                this.movingNodes.style('display', 'block');
                //dojo.place(this.movingNodes, itemOver, position);
            },
            moveOut: function(e){
                if ( 0 == this.movingNodes.length ) {
                    return;
                }

                this.movingNodes.style('display', 'none');
            },
            addCommonListeners: function(source){
                this.mover.push(aspect.after(source, '_markTargetAnchor', lang.hitch(this, this.moveOver), true));
                this.mout.push(aspect.after(source, 'onDraggingOut', lang.hitch(this, this.moveOut), true));
                //topic.subscribe("/dnd/source/over", moveStop);
            },
            addOnetimeListeners: function(){
                this.dndStart    = topic.subscribe("/dnd/start", lang.hitch(this, this.moveStart));
                this.dndDrop     = topic.subscribe("/dnd/drop", lang.hitch(this, this.moveStop));
                this.dndCancel   = topic.subscribe("/dnd/cancel", lang.hitch(this, this.moveStop));
                //topic.subscribe("/dnd/source/over", moveStop);
            },
            postCreate: function() {
                this.addOnetimeListeners();
                array.forEach(this.workflowstepsStore.query(), function(item){
                    var itemid = item.id;
                    var cards = this.kanbancardsStore.query({workflow: itemid});
                    var kbcSource = new kanbanColumn({item: item, nodes: cards, outernode: this.columnNodes});
                    this.addCommonListeners(kbcSource);

                }, this);
            }
        });
});
