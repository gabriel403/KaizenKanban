define([ "dojo/_base/declare", "dijit/Dialog",
	"dijit/_WidgetBase", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin", "dojo/text!./newStoryDialog.html",
	"kk/views/widgets/newStory/newStory", "dojo/topic", "dojo/_base/lang", "dojo/aspect", "dojo/Evented", "dojo/on" ],
	function(declare, Dialog,
		_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template,
		newStory, topic, lang, aspect, Evented, on){
		return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented], {
			templateString		: template,
			newStory			: null,
			store 				: null,
			newStoryDialog 		: null,
			postCreate: function(){
				this.newStory.setStore(this.store);
				on(this.newStory, 'cancel', lang.hitch(this, this.cancel));
				on(this.newStory, 'submit', lang.hitch(this, this.submit));
			},
			show: function() {
				this.newStoryDialog.show();
			},
			cancel: function(e){
				this.newStory.enableButtons();
				this.newStoryDialog.hide();
			},
			submit: function(e) {
				this.emit('submit', e);
			}
		});
});