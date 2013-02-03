define([ "dojo/_base/declare", "dijit/Dialog",
	"dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/text!./newWorkflowDialog.html",
	"kk/views/widgets/newWorkflow/newWorkflow", "dojo/topic", "dojo/_base/lang", "dojo/aspect", "dojo/Evented", "dojo/on" ],
	function(declare, Dialog,
		_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
		newStory, topic, lang, aspect, Evented, on){
		return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
			templateString		: template,
			newWorkflow			: null,
			store 				: null,
			newWorkflowDialog 	: null,
			postCreate: function(){
				this.newWorkflow.setStore(this.store);
				on(this.newWorkflow, 'cancel', lang.hitch(this, this.cancel));
				on(this.newWorkflow, 'submit', lang.hitch(this, this.submit));
			},
			show: function() {
				this.newWorkflowDialog.show();
			},
			cancel: function(e){
				this.newWorkflow.enableButtons();
				this.newWorkflowDialog.hide();
			},
			submit: function(e) {
				this.emit('submit', e);
			}
		});
});