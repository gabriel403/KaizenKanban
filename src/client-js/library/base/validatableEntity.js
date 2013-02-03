define(["dojo/_base/declare", "dojox/validate", "library/validate/check"],
    function(declare, validate){
    return declare([], {
        validate: validate,
        profile: {},
        validationResults: null,
        isValid: function() {
            if ( null == this.validationResul ) {
                this.validationResults = validate.check(this, this.profile);
            }
            return this.validationResults.isSuccessful();
        }
    });
});
