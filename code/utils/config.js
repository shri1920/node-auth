/*jslint node:true*/
var Config = function () {
    "use strict";
    var url = require('url'), couchdb = url.parse('http://localhost:5984'), getPort, userName, passwd;
    getPort = function getPort(couchdb) {
        var port;
        if (couchdb.port) {
            port = couchdb.port;
        }
        return port;
    };
    if (couchdb.auth) {
        userName = couchdb.auth.split(':')[0];
        passwd   = couchdb.auth.split(':')[1];
    }
    return {
        couchdbHost     : couchdb.protocol + "//" + couchdb.hostname,
        couchdbPort     : getPort(couchdb),
        couchdbUserName : userName,
        couchdbPassword : passwd
    };
};
module.exports = new Config();