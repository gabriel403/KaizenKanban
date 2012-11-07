var fs          = require('fs'),
url             = require('url'),
transferTypes   = require('./transfertypes.js');


var extTypes = {
    "/" : "/index.html"
}

var pagedata = "";
var httpcode = 200;
var transferType = "text/html";

function route(req, res){

    switch(req.method)
    {
        case 'GET':
            GET(req, res);
            break;
        case 'POST':
            break;
    }

}

function GET(req, res) {

    pagedata = "";
    httpcode = 200;
    transferType = "text/html";



    var path, sdata, parsedUrl;
    parsedUrl = url.parse(req.url);
    path = specialCaseCheck(parsedUrl.pathname);

    fs.readFile(__dirname + path, function(err, data){
        if (err) {
            prepareNotFound();
        } else {
            pagedata = data;
            transferType = transferTypes.getContentType(transferTypes.getExt(path));
        }

        sendResponse(res);
    });
}

function sendResponse(res){

    res.writeHead(httpcode, {'Content-Type': transferType})
    res.write(pagedata, 'utf8');
    res.end();
    return exports;
}

function prepareNotFound(){
    httpcode = 404;
    pagedata = '404';
    return exports;
}

function specialCaseCheck(path) {
    if ( path in extTypes ) {
        return extTypes[path];
    } else {
        return path;
    }
}


exports.route = route;