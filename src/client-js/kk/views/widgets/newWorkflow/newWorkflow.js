define([ "dojo/_base/declare", "dijit/form/ValidationTextBox", "dijit/form/FilteringSelect", "dijit/form/Button",
	"dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/text!./newWorkflow.html", 
	"dijit/form/Form", "dojo/_base/event", "dojo/Evented", "dijit/registry" ],
	function(declare, ValidationTextBox, FilteringSelect, Button,
		_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
		Form, event, Evented, registry){
		return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
			baseClass			: "newItemWidget",
			templateString		: template,

			workflowTitleIpt	: null,
			workflowDescIpt		: null,

			store				: null,
			newWorkflowForm		: null,

			setStore 			: function(store){
				this.store = store;
				this.workflowCmbBx.store	= this.store;
			},

			postCreate			: function(){
				this.workflowCmbBx.store	= this.store;
			},
			newWorkflowValidation	: function(e) {
				///?storynameIpt=My+New+Story&storydescIpt=My+Story+Description&workflowCmbBx=Awaiting+Development
				event.stop(e);
				if(newWorkflowForm.validate()) {
					this.submit();
				}
			},
			getFormObject 		: function(){
				return this.newWorkflowForm.get('value');
			},
			submit				: function(){
				this.disableButtons();
				this.emit('submit', this.getFormObject());
			},
			cancel				: function(e) {
				this.emit('cancel', e);
			},
			disableButtons		: function(){
				registry.findWidgets(this.buttonbar).forEach(function(widget){
					widget.set('disabled', true);
				});
			},
			enableButtons		: function(){
				registry.findWidgets(this.buttonbar).forEach(function(widget){
					widget.set('disabled', false);
				});
			}
		});
});