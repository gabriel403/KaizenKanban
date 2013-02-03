var path                = require('path');

var config      = {};
config.get      = function(configOption, clone) {
    if ( configOption in config ) {
        return config[configOption];
    } else {
        throw new Error("Config "+configOption+" not found.")
    }
}
config.set      = function(configOption, object, overwrite) {
    if ( configOption in config ) {
        if ( overwrite ) {
            config[configOption] = object;
        }
    } else {
        config[configOption] = object;
    }
    return config;
}

config.set('topDir',        path.join(__dirname, '/../'));
config.set('serverBase',    path.join(config.get('topDir'), 'server-js/'));
config.set('resources',     path.join(config.get('serverBase'), 'resources/'));
config.set('server',        path.join(config.get('serverBase'), 'server/'));
config.set('library', 		path.join(config.get('serverBase'), 'library/'));
config.set('app', 			path.join(config.get('serverBase'), 'app/'));

exports.get             = config.get;
exports.set             = config.set;