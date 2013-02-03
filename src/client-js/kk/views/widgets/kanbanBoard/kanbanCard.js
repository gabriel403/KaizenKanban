define(["dojo/_base/declare",  "dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
	 "dojo/text!./kanbanCard.html" ],
	function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
	 template){
		return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
			templateString: template,
			item: null
		});
});
