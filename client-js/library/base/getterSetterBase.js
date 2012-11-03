define(["dojo/_base/declare", "dojo/_base/lang", "gmk/library/utilities/string"],
    function(declare, lang, strUtil){
        return declare([ ], {
            get: function(varName) {
                var retVal = null;
                if ( "function" == typeof lang.getObject("get"+strUtil.ucfirst(varName), false, this) ) {
                    retVal = lang.getObject("get"+strUtil.ucfirst(varName), false, this)();
                } else {
                    retVal = lang.getObject(varName, false, this);
                }
                return retVal;
            },
            set: function(varName, value) {
                if ( "function" == typeof lang.getObject("set"+strUtil.ucfirst(varName), false, this) ) {
                    lang.getObject("set"+strUtil.ucfirst(varName), false, this)(value);
                } else {
                    lang.setObject(varName, value, this);
                }
                return this;
            }
        });
    });