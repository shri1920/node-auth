/*jslint node:true*/
var cradle = require('cradle'),
    confix = require('./config'),
    Utils;
Utils = function () {
    "use strict";
    var createConnection,
        getDoc;
    createConnection = function (callback) {
        if (typeof callback === 'function') {
            callback();
        }
    };
    getDoc = function (callback) {
        if (typeof callback === 'function') {
            callback();
        }
    };
    return {
        createConnection: createConnection,
        getDoc: getDoc
    };
};
module.exports = new Utils();