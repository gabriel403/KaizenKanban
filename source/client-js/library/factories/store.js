define(["dojo/_base/declare", "dojo/store/Memory", "dojo/_base/lang", "dojo/store/Observable"],
    function(declare, Memory, lang, Observable){
    return {
        // constructor:    function(props) {
        //     // lang.mixin(this, props)
        // },
        getInstance:    function(mainarg, idProperty, forcedtype) {
            var store = null;
            switch(typeof mainarg) {
                case 'string':
                    break;
                case 'object':
                    var data = lang.clone(mainarg);
                    store = new Memory({idProperty: idProperty, data: data});
//                    store = new Observable( new Memory({idProperty: idProperty, data: data}) );
//                    store.observe(
//                        function(object, removedFrom, insertedInto){
//                            console.log(object);
//                            console.log(removedFrom);
//                            console.log(insertedInto);
//                        }
//                    );
                    break;
            }
            return store;
        }
    }
});