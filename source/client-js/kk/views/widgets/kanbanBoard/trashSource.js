define(["dojo/_base/declare", "dojo/dnd/Source", "dojo/_base/lang", "dojo/string", "dojo/dom-construct", "dojo/query",
	"dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/dom-class", "dojo/dom", "dojo/dom-style",
	"dojo/text!./trashSource.html", "dijit/Dialog", "dojo/query", "dojo/dnd/Moveable", "dojo/text!./kanbanCard.html" ],
	function(declare, Source, lang, stringUtil, domConstruct, query,
	 _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, domClass, dom, domStyle,
	 trashSourceTemplate, Dialog, query, Moveable, kbCard){
		return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
			templateString  : trashSourceTemplate,
			copyOnly        : false,
			selfAccept      : true,
			dndSource		: {},
			baseClass		: "trashSource",
			workflowstepsStore: {},
			kanbancardsStore:   {},
			cardCreator     : function(item, hint){
				var node = domConstruct.toDom(
					stringUtil.substitute(
						kbCard,
						item
					)
				);
				return { node: node, data: item };
			},
			// creates a dojo/dnd/Source from the data provided
			postCreate      : function(){
				// create the Source
				this.dndSource = new Source(this.trashSourceList, {
					withHandles:    true,
					singular:       true,
					creator:        lang.hitch(this, this.cardCreator),
					copyState: function(keyPressed, self){ return false; }
				});
				this.kanbancardsStore.query({workflow: "trash"}).then(lang.hitch(this, 
					function(stories){
						this.dndSource.insertNodes(false, stories);
					}));
				return this.dndSource;
			},
			onCancel: function(){
				query('.dojoDndItem', this.domNode).style('display', 'none');
				query('.handle', this.domNode).style('display', 'none');

			},
			toggler			: function(){
				// this.trashDialog.show();
				query('.dojoDndItem', this.domNode).style('display', 'block');
				query('.handle', this.domNode).style('display', 'block');
			}
		});
});
