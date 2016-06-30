/*jslint node:true*/
var User = function () {
    "use strict";
    var findUser,
        geteToken,
        registerUser,
        crypto = require('crypto');
    /* 
        Function to check whether the user is in the system or not 
    */
    findUser = function (docId, callback) {
        var dbName = '_users';
        Utils.getDoc(dbName, docId, function (error, success) {
            if (error) {
                if (callback && typeof callback === "function") {
                    callback('not found');
                }
                return;
            }
            if (callback && typeof callback === "function") {
                callback('found');
            }
        });
    };
    /*
        Function to set the session for user
    */
    geteToken = function (userId, callback) {
        var tokenLength = 32;
        crypto.randomBytes(tokenLength, function (error, token) {
            if (error) {
                if (callback && typeof callback === "function") {
                    callback(error, undefined);
                }
            }
            if (callback && typeof callback === "function") {
                callback(undefined, token.toString('hex'));
            }
        });
    };
    /*
        Function to Register the user
    */
    registerUser = function (options, callback) {
        findUser(options.userId, function (status) {
            if (status === 'found') {
                return;
            }
            if (typeof callback === "function") {
                callback();
            }
        });
    };
    return {
        findUser    : findUser,
        geteToken   : geteToken,
        registerUser: registerUser
    };
};
module.exports = new User();