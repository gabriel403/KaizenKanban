define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-construct", "dijit/_WidgetBase"],
function(declare, lang, domConstruct, _WidgetBase){
    return declare([_WidgetBase], {
        widget: null,
        label: null,
        subcontainerType: 'p',
        buildRendering: function(){
            this.domNode = domConstruct.create(this.subcontainerType, {'id': this.widget.id+'-container'});
            domConstruct.create("label", {"for": this.widget.id, 'innerHTML': this.label}, this.domNode);
            this.widget.placeAt(this.domNode);
            this.widget.startup();
        }
    });
});