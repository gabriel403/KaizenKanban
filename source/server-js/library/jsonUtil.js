var sl 			= require('../serviceLocator.js');

var parse 		= function(jsonstr) {
	return JSON.parse(jsonstr);
}

var stringify 	= function(jsonobj) {
	return JSON.stringify(jsonobj);
}

var jsonindex	= function(jsonobj, idVar, idVal) {

	if ( 'undefined' == typeof idVar || idVar == null ) {
		idVar = 'id';
	}

	sl.get('logger').info("Parsing obj and pure index of " + idVal);

	for ( var i in jsonobj ) {
		// console.log(i)
		// console.log(jsonobj[i])
		// console.log(jsonobj[i][idVar])
		if ( jsonobj[i][idVar] == idVal ) {
			sl.get('logger').info("Returning found index", i);
			return i;
		}
	}
	sl.get('logger').info("Not found, returning -1")
	return -1;
}

var jsonid 		= function(jsonobj, idVar, idVal) {

	if ( 'undefined' == typeof idVar || idVar == null ) {
		idVar = 'id';
	}

	sl.get('logger').info("Parsing obj and pure id get " + idVal);

	if ( -1 == jsonindex(jsonobj, idVar, idVal) ) {
		sl.get('logger').info("Returning empty object");
		return {};
	}

	return jsonobj[jsonindex(jsonobj, idVar, idVal)];

}

var jsonquery 	= function(jsonobj, queryVar, queryVal) {
	sl.get('logger').info("Parsing json obj and removing non-" + queryVar);

	if ( !queryVar ) {
		sl.get('logger').info("Returning from jsonquery");
		return jsonobj;
	}

	var newjsonobj 	= [];
	for ( var i in jsonobj ) {
		if ( jsonobj[i][queryVar] == queryVal ) {
			newjsonobj.push(jsonobj[i]);
		}
	}

	sl.get('logger').info("Returning from jsonquery");
	return newjsonobj;
}

exports.jsonquery 	= jsonquery;
exports.jsonindex 	= jsonindex;
exports.jsonid 		= jsonid;
exports.parse 		= parse;
exports.stringify 	= stringify;