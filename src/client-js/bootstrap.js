var dojoConfig = {
    parseOnLoad	: true,
    isDebug		: true,
    async		: true,
    tlmSiblingOfDojo: 0,
    packages	: [
    	{ name: 'kk', 		location: 'client-js/kk' },
    	{ name: 'library', 	location: 'client-js/library' }
    ],
    deps: ["kk/main"]
};
require("dojo/dojo.js");
