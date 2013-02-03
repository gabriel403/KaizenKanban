var winston             = require('winston');
var path                = require('path');
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

var sl = serviceLocator;
sl.set('fs',                require('fs'));
sl.set('util',              require('util'));
sl.set('domain',            require('domain'));
sl.set('events',            require('events'));
sl.set('url',               require('url'));
sl.set('http',              require('http'));
sl.set('logger',            require('winston'));
sl.set('config',            require('../config.js'));
sl.set('router',            require(sl.get('config').get('server')+'/router.js'));
sl.set('transferTypes',     require(path.join(sl.get('config').get('server'), '/transferTypes.js')));
sl.set('kkhttp',            require(path.join(sl.get('config').get('server'), '/http.js')));
sl.set('kanbanController',  require(path.join(sl.get('config').get('app'), '/kanbanController.js')));
sl.set('kkmixin',           require(path.join(sl.get('config').get('library'), '/mixin.js')));
sl.set('jsonutil',          require(path.join(sl.get('config').get('library'), '/jsonUtil.js')));

exports.get             = serviceLocator.get;
exports.set             = serviceLocator.set;