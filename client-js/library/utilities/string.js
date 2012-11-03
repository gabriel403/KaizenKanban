define([], function(){
    return {
        ucfirst: function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }
});