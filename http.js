var http    = require('http'),
router      = require('./router.js'),
server;

var self = module.exports = {
    createServer: function() {
        this.server = http.createServer(function(req,res){
            router.route(req,res);
        }).listen(8000);
        return this;
    }

}
