var winston             = require('winston');


var serviceLocator      = {};
serviceLocator.services = {};

serviceLocator.get      = function(servicename, clone) {
    winston.info("Getting service", {servicename: servicename});
    if ( servicename in serviceLocator.services ) {
        return serviceLocator.services[servicename];
    } else {
        throw new Error("Service "+servicename+" not found.")
    }
}

serviceLocator.set      = function(servicename, object, overwrite) {
    winston.info("Setting service", {servicename: servicename});
    if ( servicename in serviceLocator.services ) {
        if ( overwrite ) {
            serviceLocator.services[servicename] = object;
        }
    } else {
        serviceLocator.services[servicename] = object;
    }
    return serviceLocator;
}

serviceLocator.set('url',               require('url'));
serviceLocator.set('http',              require('http'));
serviceLocator.set('logger',            require('winston'));
serviceLocator.set('router',            require('./router.js'));
serviceLocator.set('transferTypes',     require('./transferTypes.js'));
serviceLocator.set('kkhttp',            require('./http.js'));
serviceLocator.set('kanbanController',  require('./kanbanController.js'));
serviceLocator.set('kkmixin',           require('./library/mixin.js'));
serviceLocator.set('jsonutil',          require('./library/jsonUtil.js'));

exports.get             = serviceLocator.get;
exports.set             = serviceLocator.set;