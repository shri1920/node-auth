/*jslint node:true*/
var User = function () {
    "use strict";
    var crypto = require('crypto'),
        utils  = require('./utils'),
        registerUser,
        getToken;
    // Function to Register the user
    registerUser = function (options, callback) {
        utils.createUser(options, function (error, scuuess) {
            callback(error, scuuess);
        });
    };
    // Function to set the session for user
    getToken = function (userId, passwd, callback) {
        var tokenLength = 32;
        utils.findUser(userId, function (error, result) {
            // Send Back error message if user does not exists
            if (error) {
                callback(error, undefined);
                return;
            }
            // Send Back error message if password mismatch
            if (result.passwd !== utils.createHash(passwd)) {
                callback({"status": "401", "reason": "login failed"});
                return;
            }
            // Generate Token if User is available  
            crypto.randomBytes(tokenLength, function (error, token) {
                if (error) {
                    callback(error, undefined);
                    return;
                }
                callback(undefined, {
                    accessToken : token.toString('hex'),
                    tokenType   : "bearer",
                    scope       : "read write"
                });
            });
        });
    };
    return {
        registerUser : registerUser,
        getToken : getToken
    };
};
module.exports = new User();