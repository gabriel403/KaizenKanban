define(["dojo/_base/declare", "dojo/_base/lang", "dojo/dom-construct", "dijit/_WidgetBase"],
function(declare, lang, domConstruct, _WidgetBase){
    return declare([_WidgetBase], {
        container: null,
        legend: '',
        fieldsetTag: 'fieldset',
        legendTag: 'legend',
        buildRendering: function(){
            this.domNode = domConstruct.create(this.fieldsetTag);
            domConstruct.create(this.legendTag, {'innerHTML': this.legend}, this.domNode);
        }
    });
});