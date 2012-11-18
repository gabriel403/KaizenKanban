define([ "dojo/_base/declare", "dijit/Dialog",
	"dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/text!./newStoryDialog.html",
	"kk/views/widgets/newStory/newStory", "dojo/topic", "dojo/_base/lang", "dojo/aspect" ],
	function(declare, Dialog,
		_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
		newStory, topic, lang, aspect){
		return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
			templateString		: template,
			newStory			: null,
			store 				: null,
			newStoryDialog 		: null,
			postCreate: function(){
				this.newStory.store = this.store;
				// this.newStory.newStoryForm.on('cancel', this.newStoryDialog.hide)
				aspect.after(this.newStory, 'cancel', lang.hitch(this, this.cancel), true);
			},
			show: function() {
				this.newStoryDialog.show();
			},
			cancel: function(e){
				this.newStoryDialog.hide();
			}
		});
});