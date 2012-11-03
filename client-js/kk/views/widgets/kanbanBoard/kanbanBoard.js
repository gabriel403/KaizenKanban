define(["dojo/_base/declare", "dojo/query", "dojo/dom-style", "dojo/aspect",
     "dojo/topic", "dojo/dom-construct", "dojo/dom-class", "dojo/_base/lang", "dojo/_base/array",
     "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
     "kk/views/widgets/kanbanBoard/kanbanColumn", "kk/views/widgets/kanbanBoard/kanbanCard", "dojo/text!./kanbanBoard.html" ],
    function(declare, query, domStyle, aspect,
     topic, domConstruct, domClass, lang, array,
     _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
     kanbanColumn, kanbanCard, template){
        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: template,
            workflowstepsStore: {},
            kanbancardsStore: {},
            movingNode: null,
            mover: [],
            mout: [],
            dndStart: null,
            dndDrop: null,
            dndCancel: null,
            moveStart: function(show, source, nodes){
                this.movingNode = source[0];
                domStyle.set(source[0], 'visibility', 'hidden');
                domStyle.set(query('.dojoDndAvatar')[0], 'width', domStyle.get(source[0], 'width')+'px');
                domStyle.set(query('.dojoDndAvatar')[0], 'height', domStyle.get(source[0], 'height')+'px');
                domStyle.set(source[0], 'display', 'none');

            },
            moveStop: function(source, nodes, copy){
                //source.node.id ul catNode
                this.movingNode = null;
                query('.dojoDndItemAnchor').style('display', 'block');
                query('.dojoDndItemAnchor').style('visibility', 'visible');
            },
            moveOver: function(e){
                if ( null == this.movingNode ) {
                    return;
                }

                var position = domClass.contains(itemOver, 'dojoDndItemBefore')?'before':'after';
                domStyle.set(this.movingNode, 'display', 'block');
                dojo.place(this.movingNode, itemOver, position);
            },
            moveOut: function(e){
                if ( null == this.movingNode ) {
                    return;
                }
                domStyle.set(this.movingNode, 'display', 'none');
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
