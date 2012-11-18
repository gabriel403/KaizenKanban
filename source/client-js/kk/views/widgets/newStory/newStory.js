define([ "dojo/_base/declare", "dijit/form/ValidationTextBox", "dijit/form/ComboBox", "dijit/Dialog", "dijit/form/Button",
	"dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/text!./newStory.html", 
	"dijit/registry", "dijit/form/Form", "dojo/query", "dijit/registry" ],
	function(declare, ValidationTextBox, ComboBox, Dialog, Button,
		_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
		registry, Form, query, registry){
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
				this.workflowCmbBx.store	= this.store
				// this.store  = this.parentView.mainModel.workflowStore;
			},
			newStoryValidation	: function() {
				console.log(newStoryForm.validate());
			}
		});
});