define([ "dojo/_base/declare", "dijit/form/ValidationTextBox", "dijit/form/ComboBox", "dijit/Dialog", "dijit/form/Button",
	"dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/text!./newStory.html", 
    "dijit/registry" ],
    function(declare, ValidationTextBox, ComboBox, Dialog, Button,
    	_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
        registry){
        return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
            baseClass       : "newStoryCardWidget",
            templateString  : template,
        	parentView		: null,
        	name			: null,
        	description		: null,
        	workflow		: null,
            store           : null,
            postCreate      : function(){
                this.name           = registry.byId('storynameIpt');
                this.description    = registry.byId('storydescIpt');
                this.workflow       = registry.byId('workflowCmbBx');
                this.workflow.store = this.store
                // this.store  = this.parentView.mainModel.workflowStore;
            },
        	setupDijits		: function() {
        		// this.name			= new ValidationTextBox();
        		// this.description	= new ValidationTextBox();
        		// this.workflow		= new ComboBox({
        		// 	store: this.parentView.mainModel.workflowStore
        		// });
        	}
        });
});