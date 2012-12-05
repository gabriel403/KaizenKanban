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

    //     		var domNodeInfo = domGeom.position(this.domNode, true);
				// domStyle.set(this.trashSourceList, {
			 //      	width: domNodeInfo.w+"px"
			 //    });
				return this.dndSource;
			},
			onCancel: function(e){
				Event.stop(e);
				query('.dojoDndItem', this.domNode).style('display', 'none');
				query('.handle', this.domNode).style('display', 'none');
				this.shown = false;

        		var trashDialogInfo = domGeom.position(this.domNode, true);
				domStyle.set(this.trashMoveable, {
			      	left: trashDialogInfo.x + "px",
			      	top: trashDialogInfo.y + "px",
			      	minWidth: "0px",
			      	width: "auto"//,
			      	// position: "relative"
			    });
				domStyle.set(this.trashSourceList, {
			      	width: trashDialogInfo.w+"px",
			      	border: "0px",
			      	height: "48px"
			    });
			    query(".handle", this.trashMoveable)
			    .style('border', '0px')

			},
			toggler			: function(e){
				// this.trashDialog.show();
				if ( this.shown ) {
					this.onCancel(e);
					return;
				}

				this.shown = true;
				query('.dojoDndItem', this.domNode).style('display', 'block');
				query('.handle', this.domNode).style('display', 'block');

				var divInfo = domGeom.position(dojo.body(), true);
        		var trashDialogInfo = domGeom.position(this.trashMoveable, true);
    			// var lastX = divInfo.x - trashDialogInfo.x + (divInfo.w - trashDialogInfo.w) / 2;
    			// var lastY = divInfo.y - trashDialogInfo.y + (divInfo.h - trashDialogInfo.h) / 2;
    			var lastX = (divInfo.w - trashDialogInfo.w) / 2;
    			var lastY = (divInfo.h - trashDialogInfo.h) / 2;

				domStyle.set(this.trashMoveable, {
			      	position: "absolute",
			      	left: parseInt(lastX) + "px",
			      	top: parseInt(lastY) + "px",
			      	minWidth: "200px",
			      	width: "auto"
			    });
				domStyle.set(this.trashSourceList, {
			      	width: "100%",
			      	border: "1px solid black",
			      	height: "auto"
			    });
			    query(".handle", this.trashMoveable)
			    .style('border', '1px solid black')
			    .style('fontSize', '1.4em')
			    .style('verticalAlign', 'text-bottom');
			    query("li", this.trashSourceList).style('width', '100%');
			    //div.handle
			    //ul#trash
			    //ul#trash li
			    // var diu = new DialogUnderlay().placeAt(win.body());
			    // diu.show();
			}
		});
});
