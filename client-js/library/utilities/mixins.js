define([], function(){
    return {
        mixin: function(obj1,obj2) {
            for(var itm in obj1){
                if (obj1.hasOwnProperty(itm) && obj2.hasOwnProperty(itm) && typeof obj2.hasOwnProperty(itm) !== "undefined") {
                    obj1[itm] = obj2[itm];
                }
            }
        }
    }
});