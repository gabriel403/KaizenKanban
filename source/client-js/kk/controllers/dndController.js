define(["dojo/_base/declare", "dojo/json", "dojo/_base/array", "dojo/topic", "dojo/_base/lang" ],
    function(declare, json, array, topic, lang,
     storefactory, workflowjson, storiesjson){
        return declare([ ], {
            mainModel   : null,
            mainView    : null,
            constructor : function(props){
                lang.mixin(this, props);
                this.mainView.kkbSetup(this.mainModel.workflowStore, this.mainModel.storiesStore);
            }
        });
});
