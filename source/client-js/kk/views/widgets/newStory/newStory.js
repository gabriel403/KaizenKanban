define([ "dojo/_base/declare", "dijit/form/ValidationTextBox", "dijit/form/ComboBox", "dijit/form/Button",
	"dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/text!./newStory.html", 
	"dijit/form/Form" ],
	function(declare, ValidationTextBox, ComboBox, Button,
		_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
		Form){
		return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
			baseClass			: "newStoryCardWidget",
			templateString		: template,
			parentView			: null,
			storynameIpt		: null,
			storydescIpt		: null,
			workflowCmbBx		: null,
			store				: null,
			newStoryForm		: null,
			postCreate			: function(){
				this.workflowCmbBx.store	= this.store;
				// this.store  = this.parentView.mainModel.workflowStore;
			},
			newStoryValidation	: function() {
				console.log(newStoryForm.validate());
			},
			cancel	: function(e) {
			}
		});
});