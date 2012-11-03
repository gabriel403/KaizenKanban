define(["dojo/_base/declare", "dojo/dom-class", "dojo/dnd/Source", "dojo/json", "dojo/_base/array", 
     "kk/views/widgets/kanbanBoard/kanbanBoard",
     "library/factories/store", "dojo/text!kk/models/json/workflow.json", "dojo/text!kk/models/json/stories.json" ],
    function(declare, domClass, Source, json, array,
     kanbanBoard,
     storefactory, workflowjson, storiesjson){
        return declare([ ], {
            workflowStore: null,
            storiesStore: null,
            workflowSteps: {},
            constructor: function(){
                this.workflowStore = storefactory.getInstance(json.parse(workflowjson), 'id');
                this.storiesStore = storefactory.getInstance(json.parse(storiesjson), 'name');
                this.gotWorkflow();
            },
            gotWorkflow: function(){
                new kanbanBoard({workflowstepsStore: this.workflowStore, kanbancardsStore: this.storiesStore}).placeAt('innerContainer');
            }
        });
});
