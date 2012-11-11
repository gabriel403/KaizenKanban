define(["dojo/_base/declare", "dojo/store/Memory", "dojo/_base/lang", "dojo/store/Observable", "dojo/store/JsonRest"],
    function(declare, Memory, lang, Observable, JsonRest){
    return {
        getInstance:    function(mainarg, idProperty, forcedtype) {
            var store = null;
            switch(typeof mainarg) {
                case 'string':
                    store = new JsonRest({target: mainarg});
                    break;
                case 'object':
                    var data = lang.clone(mainarg);
                    store = new Memory({idProperty: idProperty, data: data});
                    break;
            }
            return store;
        }
    }
});