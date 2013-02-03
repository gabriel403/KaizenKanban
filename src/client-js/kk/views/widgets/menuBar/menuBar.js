define([ "dojo/_base/declare", "dojo/topic", "dijit/MenuBar", "dijit/MenuBarItem", "dijit/PopupMenuBarItem", "dijit/DropDownMenu",
	"dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/text!./menuBar.html" ],
	function(declare, topic, MenuBar, MenuBarItem, PopupMenuBarItem, DropDownMenu,
		_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template){
		return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
			baseClass       : "menuBar",
			templateString  : template,
			newWorkflowPublish	: function(){
				topic.publish('/kk/newworkflow');
			},
			newStoryPublish	: function(){
				topic.publish('/kk/newstory');
			}
		});
});