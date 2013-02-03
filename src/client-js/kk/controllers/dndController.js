define(["dojo/_base/declare", "library/base/mvc/controller", "dojo/json", "dojo/_base/array", "dojo/topic", "dojo/_base/lang" ],
	function(declare, baseController, json, array, topic, lang,
	 storefactory, workflowjson, storiesjson){
		return declare([baseController], {
			mainModel   : null,
			mainView    : null
		});
});
