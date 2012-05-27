var fs          = require('fs'),
url             = require('url'),
transferTypes   = require('./transfertypes.js');

exports.extTypes = {
    "/" : "/index.html"
}

exports.data = "";
exports.httpcode = 200;
exports.transferType = "text/html";

exports.route = function(req, res){

    switch(req.method)
    {
        case 'GET':
            this.GET(req, res);
            break;
        case 'POST':
            break;
    }

}

exports.GET = function(req, res) {

    exports.data = "";
    exports.httpcode = 200;
    exports.transferType = "text/html";



    var path, sdata, parsedUrl;
    parsedUrl = url.parse(req.url);
    path = exports.specialCaseCheck(parsedUrl.pathname);

    fs.readFile(__dirname + path, function(err, data){
        if (err) {
            exports.prepareNotFound();
        } else {
            exports.data = data;
            exports.transferType = transferTypes.getContentType(transferTypes.getExt(path));
        }

        exports.sendResponse(res);
    });
}

exports.sendResponse = function(res){

    res.writeHead(exports.httpcode, {'Content-Type': exports.transferType})
    res.write(exports.data, 'utf8');
    res.end();
    return exports;
}

exports.prepareNotFound = function(){
    exports.httpcode = 404;
    exports.data = '404';
    return exports;
}

exports.specialCaseCheck =  function(path) {
    if ( path in exports.extTypes ) {
        return exports.extTypes[path];
    } else {
        return path;
    }
}

