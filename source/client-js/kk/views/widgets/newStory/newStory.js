define([ "dojo/_base/declare", "dijit/form/ValidationTextBox", "dijit/form/FilteringSelect", "dijit/form/Button",
	"dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/text!./newStory.html", 
	"dijit/form/Form", "dojo/_base/event", "dojo/Evented", "dijit/registry" ],
	function(declare, ValidationTextBox, FilteringSelect, Button,
		_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
		Form, event, Evented, registry){
		return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
			baseClass			: "newStoryCardWidget",
			templateString		: template,

			storynameIpt		: null,
			storydescIpt		: null,
			workflowCmbBx		: null,

			store				: null,
			newStoryForm		: null,

			setStore 			: function(store){
				this.store = store;
				this.workflowCmbBx.store	= this.store;
			},

			postCreate			: function(){
				this.workflowCmbBx.store	= this.store;
				// this.store  = this.parentView.mainModel.workflowStore;
			},
			newStoryValidation	: function(e) {
				///?storynameIpt=My+New+Story&storydescIpt=My+Story+Description&workflowCmbBx=Awaiting+Development
				event.stop(e);
				if(newStoryForm.validate()) {
					this.submit();
				}
			},
			getFormObject 		: function(){
				return this.newStoryForm.get('value');
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