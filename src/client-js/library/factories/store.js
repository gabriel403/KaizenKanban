define(["dojo/_base/declare", "dojo/store/Memory", "dojo/_base/lang", "dojo/store/Observable", 
    "dojo/store/JsonRest", "dojo/store/Cache"],
    function(declare, Memory, lang, Observable, 
        JsonRest, Cache){
    return {
        getInstance:    function(mainarg, idProperty, forcedtype) {
            var store = null;
            if ( "undefined" == typeof forcedtype ) {
                switch(typeof mainarg) {
                    case 'string':
                        store = new JsonRest({target: mainarg, idProperty: idProperty});
                        break;
                    case 'object':
                        var data = lang.clone(mainarg);
                        store = new Memory({idProperty: idProperty, data: data});
                        break;
                }
            } else {
                switch(forcedtype) {
                    case 'jsonRest':
                        store = new JsonRest({target: mainarg, idProperty: idProperty});
                        break;
                    case 'memory':
                        var data = lang.clone(mainarg);
                        store = new Memory({idProperty: idProperty, data: data});
                        break;
                    case 'jsonCache':
                        var masterStore = new JsonRest({target: mainarg, idProperty: idProperty});
                        masterStore = new Observable(masterStore);
                        store = new Cache(
                            masterStore, 
                            new Memory({idProperty: idProperty}));
                        break;
                }
            }
            return store;
        }
    }
});