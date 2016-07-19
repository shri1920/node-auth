/*jslint node:true*/
var crypto = require('crypto'),
    redis = require('./redisHelper'),
    Utils;
Utils = function () {
    "use strict";
    var generateToken,
        expireToken;
    // Funcation to generate the access token
    generateToken = function (callback) {
        var TOKEN_LENGTH = 32;
        // To geneta
        crypto.randomBytes(TOKEN_LENGTH, function (error, token) {
            if (error) {
                callback(error, undefined);
                return;
            }
            token = token.toString('hex');
            callback(undefined, {accessToken: token, tokenType: "bearer", scope: "read write"});
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
    return {
        generateToken: generateToken,
        expireToken: expireToken
    };
};
module.exports = new Utils();