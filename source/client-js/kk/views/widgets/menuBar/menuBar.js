define([ "dojo/_base/declare", "dojo/topic", "dijit/MenuBar", "dijit/MenuBarItem",
	"dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/text!./menuBar.html" ],
    function(declare, topic, MenuBar, MenuBarItem,
    	_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template){
        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            baseClass       : "menuBar",
            templateString  : template,
            newStoryPublish	: function(){
            	topic.publish('/kk/newstory');
            }
        });
});