var fs          = require('fs')
, url           = require('url')
, transfertypes = require('./transfertypes.js');

self    = module.exports  = {
    route: function(req, res){
        var path = url.parse(req.url).pathname;
        fs.readFile(__dirname + path, function(err, data){
            if (err) {
                return self.send404(res);
            }

            res.writeHead(200, {'Content-Type': transfertypes.getContentType(transfertypes.getExt(path))})
            res.write(data, 'utf8');
            res.end();
        });
    },
    send404: function(res){
        res.writeHead(404);
        res.write('404');
        res.end();
        return this;
    }
}