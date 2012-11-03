define(["dojo/_base/declare", "dojo/_base/lang", "gmk/library/base/getterSetterBase"],
    function(declare, lang, getterSetterBase){
        return declare([getterSetterBase], {
            setupDom:           function() {
            },
            setupDijits:        function() {
            },
            setupConnections:   function() {
            },
            init : function() {
                this.setupDom();
                this.setupDijits();
                this.setupConnections();
            },
            constructor: function(props) {
                lang.mixin(this, props);
                this.init();
            }

        });
});