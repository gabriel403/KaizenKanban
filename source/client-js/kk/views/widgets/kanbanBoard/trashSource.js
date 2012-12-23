define(["dojo/_base/declare", "dojo/dnd/Source", "dojo/_base/lang", "dojo/string", "dojo/dom-construct", "dojo/query",
	"dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/dom-class", "dojo/dom",
	"dojo/dom-style", "dojo/dom-geometry", "dojo/_base/event",
	"dojo/text!./trashSource.html", "dijit/Dialog", "dojo/query", "dojo/dnd/Moveable", "dojo/text!./kanbanCard.html",
	"dijit/DialogUnderlay", "dojo/_base/window" ],
	function(declare, Source, lang, stringUtil, domConstruct, query,
	 _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, domClass, dom, 
	 domStyle, domGeom, Event,
	 trashSourceTemplate, Dialog, query, Moveable, kbCard,
	 DialogUnderlay, win){
		return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
			templateString  : trashSourceTemplate,
			copyOnly        : false,
			selfAccept      : true,
			dndSource		: {},
			baseClass		: "trashSource",
			workflowstepsStore: {},
			kanbancardsStore:   {},
			shown: false,
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
				new Moveable(this.trashMoveable);

				return this.dndSource;
			},
			onCancel: function(e){
				Event.stop(e);

				domClass.toggle(this.trashMoveable, 'minimisedSource');
				domClass.toggle(this.trashMoveable, 'openedSource');

				domConstruct.place(this.trashMoveable, this.domNode, "last");
				this.shown = false;

				domStyle.set(this.trashMoveable, {
					left: "auto",
					top: "auto"
				});

			},
			toggler			: function(e){

				if ( this.shown ) {
					this.onCancel(e);
					return;
				}

				domClass.toggle(this.trashMoveable, 'minimisedSource');
				domClass.toggle(this.trashMoveable, 'openedSource');

				this.shown = true;

				var divInfo = domGeom.position(dojo.body(), true);
				var trashDialogInfo = domGeom.position(this.trashMoveable, true);
				var lastX = (divInfo.w - trashDialogInfo.w) / 2;
				var lastY = (divInfo.h - trashDialogInfo.h) / 2;
				domStyle.set(this.trashMoveable, {
					left: parseInt(lastX) + "px",
					top: parseInt(lastY) + "px"
				});

				domConstruct.place(this.trashMoveable, win.body(), "last");
				// var diu = new DialogUnderlay().placeAt(win.body());
				// diu.show();
			}
		});
});
