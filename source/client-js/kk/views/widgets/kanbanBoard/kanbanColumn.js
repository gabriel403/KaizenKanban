define(["dojo/_base/declare", "dojo/dnd/Source", "dojo/_base/lang", "dojo/string", "dojo/dom-construct", "dojo/query",
    "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/dom",
    "dojo/text!./kanbanColumn.html", "kk/views/widgets/kanbanBoard/kanbanCard", "dojo/text!./kanbanCard.html" ],
    function(declare, Source, lang, stringUtil, domConstruct, query,
     _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, dom,
     kanbanColumnTemplate, kanbanCard, kbCard){
        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            templateString: kanbanColumnTemplate,
            kbCard: kbCard,
            item: null,
            nodes: [],
            copyOnly: false,
            selfAccept: true,
            outernone: null,
            setupDom: function() {
                var node = domConstruct.toDom(
                    stringUtil.substitute(
                        this.templateString,
                        this.item
                    )
                );
                domConstruct.place(node, this.outernode);
                return dojo.query(".container", node)[0];
            },
            cardCreator: function(item, hint){
                //var node = new kanbanCard({item: item, id: "cbk_"+item.id});
                var node = domConstruct.toDom(
                    stringUtil.substitute(
                        this.kbCard,
                        item
                    )
                );
                //domConstruct.place(node, this.cardNodes);
                //node.destroy();
                return { node: node, data: item };
            },
            // creates a dojo/dnd/Source from the data provided
            postCreate: function(){
                var node = this.setupDom();
                // create the Source
                this.dndSource = new Source(node, {
                    // ensure that only move operations ever occur from this source
                    // copyOnly:       false,
                    // define whether or not this source will accept drops from itself, based on the value passed into
                    // buildCatalog; defaults to true, since this is the default that dojo/dnd uses
                    // selfAccept:     true,
                    withHandles:    true,
                    creator:        lang.hitch(this, this.cardCreator),
                    singular:       true,
                    // generateText:   false,
                    // autoSync:       true
                    copyState: function(keyPressed, self){ return false; }
                });

                // this.nodes.forEach(
                //     function(item,index){
                //         cards[index2] = new kanbanCard({item: item2});
                //     });
                this.dndSource.insertNodes(false, this.nodes);
                return this.dndSource;
            }
        });
});
