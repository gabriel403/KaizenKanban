define(["dojo/_base/declare", "dojo/dnd/Source", "dojo/_base/lang", "dojo/string", "dojo/dom-construct", "dojo/query",
	"dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/dom-class", "dojo/dom", "dojo/dom-style",
	"dojo/text!./kanbanColumn.html", "kk/views/widgets/kanbanBoard/kanbanCard", "dojo/text!./kanbanCard.html" ],
	function(declare, Source, lang, stringUtil, domConstruct, query,
	 _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, domClass, dom, domStyle,
	 kanbanColumnTemplate, kanbanCard, kbCard){
		return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
			templateString  : kanbanColumnTemplate,
			kbCard          : kbCard,
			item            : null,
			nodes           : [],
			copyOnly        : false,
			selfAccept      : true,
			outernone       : null,
			minimisedSource : false,
			cardCreator     : function(item, hint){
				var node = domConstruct.toDom(
					stringUtil.substitute(
						this.kbCard,
						item
					)
				);
				return { node: node, data: item };
			},
			// creates a dojo/dnd/Source from the data provided
			postCreate      : function(){
				// var node = this.setupDom();
				// create the Source
				this.dndSource = new Source(this.cardNodes, {
					// ensure that only move operations ever occur from this source
					// copyOnly:       false,
					// define whether or not this source will accept drops from itself, based on the value passed into
					// buildCatalog; defaults to true, since this is the default that dojo/dnd uses
					selfAccept:     true,
					withHandles:    true,
					creator:        lang.hitch(this, this.cardCreator),
					singular:       true,
					// generateText:   false,
					// autoSync:       true
					copyState: function(keyPressed, self){ return false; }
				});
				return this.dndSource;
			},
			toggler: function(e) {
				var nodes = query(e.target).closest(".column");
				domClass.toggle(nodes[0], 'minimisedSource');
				domClass.toggle(nodes[0], 'openedSource');
			}
		});
});
