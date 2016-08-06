/*jslint node:true*/
var Logs;
Logs = function () {
    "use strict";
    var write;
    write = function (when, msg, user) {
        when = when || "-----";
        msg  = msg  || "-----";
        user = user || "-----";
        console.log(when.toUpperCase() + " | " + msg + " | " + user);
    };
    return {
        write: write
    };
};
module.exports = new Logs();