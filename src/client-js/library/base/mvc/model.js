define(["dojo/_base/declare", "dojo/_base/lang", "library/base/getterSetterBase"],
    function(declare, lang, getterSetterBase){
        return declare([getterSetterBase], {
            setupStores     :   function() {
            },
            setupConnections:   function() {
            },
            setupFinal      :         function() {
            },
            init            : function() {
                this.setupStores();
                this.setupConnections();
                this.setupFinal();
            },
            constructor     : function(props) {
                lang.mixin(this, props);
                this.init();
            }

        });
});