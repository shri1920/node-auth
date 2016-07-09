/*jslint node:true*/
var User = function () {
    "use strict";
    var crypto = require('crypto'),
        utils  = require('./utils'),
        redis  = require('./redisHelper'),
        registerUser,
        getToken,
        storeToken,
        expireToken,
        recoverPasswd;
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
    // Function to store the token and user info in key value store
    storeToken = function (token, callback) {
        redis.set(token, function (error, success) {
            callback(error, success);
        });
    };
    // Function to remove the token from key value store
    expireToken = function (authHeader, callback) {
        var token;
        if (authHeader) {
            authHeader = authHeader.split(" ");
            token = authHeader[1];
            redis.del(token, function (error, success) {
                callback(error, success);
            });
        }
    };
    // Function to recover passwd of a user
    recoverPasswd = function (userId, callback) {
        utils.findUser(userId, function (error, result) {
            if (error) {
                callback(error, undefined);
                return;
            }
            if (result) {
                // mail the link to recover passwd
            }
        });
    };
    return {
        registerUser : registerUser,
        getToken : getToken,
        storeToken : storeToken,
        expireToken : expireToken,
        recoverPasswd : recoverPasswd
    };
};
module.exports = new User();