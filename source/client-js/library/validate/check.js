define(["dojo/_base/kernel", "dojo/_base/lang", "dojox/validate/_base"],
 function(kernel, lang, validate){

/**
	FIXME: How much does this overlap with dojox.form.Manager and friends?

	Procedural API Description

		The main aim is to make input validation expressible in a simple format.
		You define profiles which declare the required and optional fields and any constraints they might have.
		The results are provided as an object that makes it easy to handle missing and invalid input.

	Usage

		var results = dojox.validate.check(form, profile);

	Profile Object

		var profile = {
			// filters change the field value and are applied before validation.
			trim: ["tx1", "tx2"],
			uppercase: ["tx9"],
			lowercase: ["tx5", "tx6", "tx7"],
			ucfirst: ["tx10"],
			digit: ["tx11"],

			// required input fields that are blank will be reported missing.
			// required radio button groups and drop-down lists with no selection will be reported missing.
			// checkbox groups and selectboxes can be required to have more than one value selected.
			// List required fields by name and use this notation to require more than one value: {checkboxgroup: 2}, {selectboxname: 3}.
			required: ["tx7", "tx8", "pw1", "ta1", "rb1", "rb2", "cb3", "s1", {"doubledip":2}, {"tripledip":3}],

			// dependant/conditional fields are required if the target field is present and not blank.
			// At present only textbox, password, and textarea fields are supported.
			dependencies:	{
				cc_exp: "cc_no",
				cc_type: "cc_no"
			},

			// Fields can be validated using any boolean valued function.
			// Use arrays to specify parameters in addition to the field value.
			constraints: {
				field_name1: myValidationFunction,
				field_name2: dojox.validate.isInteger,
				field_name3: [myValidationFunction, additional parameters],
				field_name4: [dojox.validate.isValidDate, "YYYY.MM.DD"],
				field_name5: [dojox.validate.isEmailAddress, false, true]
			},

			// Confirm is a sort of conditional validation.
			// It associates each field in its property list with another field whose value should be equal.
			// If the values are not equal, the field in the property list is reported as Invalid. Unless the target field is blank.
			confirm: {
				email_confirm: "email",
				pw2: "pw1"
			}
		};

	Results Object

		isSuccessful(): Returns true if there were no invalid or missing fields, else it returns false.
		hasMissing():  Returns true if the results contain any missing fields.
		getMissing():  Returns a list of required fields that have values missing.
		isMissing(field):  Returns true if the field is required and the value is missing.
		hasInvalid():  Returns true if the results contain fields with invalid data.
		getInvalid():  Returns a list of fields that have invalid values.
		isInvalid(field):  Returns true if the field has an invalid value.

*/

validate.check = function(/*HTMLFormElement*/form, /*Object*/profile){
	// summary:
	//		validates user input of an HTML form based on input profile
	// description:
	//		returns an object that contains several methods summarizing the results of the validation
	// form:
	//		form to be validated
	// profile:
	//		specifies how the form fields are to be validated
	//		{trim:Array, uppercase:Array, lowercase:Array, ucfirst:Array, digit:Array,
	//		required:Array, dependencies:Object, constraints:Object, confirm:Object}

	// Essentially private properties of results object
	var missing = [];
	var invalid = [];

	// results object summarizes the validation
	var results = {
		isSuccessful: function() {return ( !this.hasInvalid() && !this.hasMissing() );},
		hasMissing: function() {return ( missing.length > 0 );},
		getMissing: function() {return missing;},
		isMissing: function(elemname) {
			for(var i = 0; i < missing.length; i++){
				if(elemname == missing[i]){ return true; }
			}
			return false;
		},
		hasInvalid: function() {return ( invalid.length > 0 );},
		getInvalid: function() {return invalid;},
		isInvalid: function(elemname){
			for(var i = 0; i < invalid.length; i++){
				if(elemname == invalid[i]){ return true; }
			}
			return false;
		}
	};

	var _undef = function(name,object){
                return (typeof object[name] == "undefined");
        };

	// Filters are applied before fields are validated.
	// Trim removes white space at the front and end of the fields.
	if(profile.trim instanceof Array){
		for(var i = 0; i < profile.trim.length; i++){
			var elem = form[profile.trim[i]];
			form[profile.trim[i]] = elem.replace(/(^\s*|\s*$)/g, "");
		}
	}
	// Convert to uppercase
	if(profile.uppercase instanceof Array){
		for(var i = 0; i < profile.uppercase.length; i++){
			var elem = form[profile.uppercase[i]];
			form[profile.uppercase[i]] = elem.toUpperCase();
		}
	}
	// Convert to lowercase
	if(profile.lowercase instanceof Array){
		for (var i = 0; i < profile.lowercase.length; i++){
			var elem = form[profile.lowercase[i]];
			form[profile.lowercase[i]] = elem.toLowerCase();
		}
	}
	// Uppercase first letter
	if(profile.ucfirst instanceof Array){
		for(var i = 0; i < profile.ucfirst.length; i++){
			var elem = form[profile.ucfirst[i]];
			form[profile.ucfirst[i]] = elem.replace(/\b\w+\b/g, function(word) { return word.substring(0,1).toUpperCase() + word.substring(1).toLowerCase(); });
		}
	}
	// Remove non digits characters from the input.
	if(profile.digit instanceof Array){
		for(var i = 0; i < profile.digit.length; i++){
			var elem = form[profile.digit[i]];
			form[profile.digit[i]] = elem.replace(/\D/g, "");
		}
	}

	// See if required input fields have values missing.
	if(profile.required instanceof Array){
		for(var i = 0; i < profile.required.length; i++){
			if(!lang.isString(profile.required[i])){ continue; }
			var elem = form[profile.required[i]];
			// Are textbox, textarea, or password fields blank.
			if(/^\s*$/.test(elem)){
				missing[missing.length] = profile.required[i];
			}
		}
	}

	// Find invalid input fields.
	if(lang.isObject(profile.constraints)){
		// constraint properties are the names of fields to bevalidated
		for(name in profile.constraints){
			var elem = form[name];
			if(!elem) {continue;}

			// skip if blank - its optional unless required, in which case it
			// is already listed as missing.
			if(/^\s*$/.test(elem)){
				continue;
			}

			var isValid = true;
			// case 1: constraint value is validation function
			if(lang.isFunction(profile.constraints[name])){
				isValid = profile.constraints[name](elem);
			}else if(lang.isArray(profile.constraints[name])){

				// handle nested arrays for multiple constraints
				if(lang.isArray(profile.constraints[name][0])){
					for (var i=0; i<profile.constraints[name].length; i++){
						isValid = validate.evaluateConstraint(profile, profile.constraints[name][i], name, elem);
						if(!isValid){ break; }
					}
				}else{
					// case 2: constraint value is array, first elem is function,
					// tail is parameters
					isValid = validate.evaluateConstraint(profile, profile.constraints[name], name, elem);
				}
			}

			if(!isValid){
				invalid[invalid.length] = name;
			}
		}
	}
	return results; // Object
};

//TODO: evaluateConstraint doesn't use profile or fieldName args?
validate.evaluateConstraint=function(profile, /*Array*/constraint, fieldName, elem){
	// summary:
	//		Evaluates dojo.validate.check() constraints that are specified as array
	//		arguments
	// description:
	//		The arrays are expected to be in the format of:
	//	|    constraints:{
	//	|            fieldName: [functionToCall, param1, param2, etc.],
	//	|            fieldName: [[functionToCallFirst, param1],[functionToCallSecond,param2]]
	//	|    }
	//
	//		This function evaluates a single array function in the format of:
	//		[functionName, argument1, argument2, etc]
	//
	//		The function will be parsed out and evaluated against the incoming parameters.
	// profile:
	//		The dojo.validate.check() profile that this evaluation is against.
	// constraint:
	//		The single [] array of function and arguments for the function.
	// fieldName:
	//		The form dom name of the field being validated.
	// elem:
	//		The form element field.

 	var isValidSomething = constraint[0];
        if ("string" == typeof isValidSomething) {
            if ( "function" == typeof validate[isValidSomething]) {
                isValidSomething = validate[isValidSomething];
            }
        }
	var params = constraint.slice(1);
	params.unshift(elem);
	if(typeof isValidSomething != "undefined"){
		return isValidSomething.apply(null, params);
	}
	return false; // Boolean
};

return validate.check;
});
