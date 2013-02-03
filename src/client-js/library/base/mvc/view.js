define(["dojo/_base/declare", "dojo/_base/lang", "library/base/getterSetterBase"],
    function(declare, lang, getterSetterBase){
        return declare([getterSetterBase], {
            setupDom:           function() {
            },
            setupDijits:        function() {
            },
            setupConnections:   function() {
            },
            setupFinal:         function() {
            },
            init : function() {
                this.setupDom();
                this.setupDijits();
                this.setupConnections();
                this.setupFinal();
            },
            constructor: function(props) {
                lang.mixin(this, props);
                this.init();
            }

        });
});