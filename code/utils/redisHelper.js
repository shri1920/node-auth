/*jslint node:true*/
var Redis = function () {
    "use strict";
    var redis = require('redis'), rClient = redis.createClient(), setToken, getToken, delToken;
    // Function to set Token with related data
    setToken = function (info, callback) {
        var TIME_TO_LIVE = 60 * 60 * 24, authInfo;
        authInfo = {
            userId: info.userId,
            tokenType: info.tokenType,
            scope: info.scope
        };
        rClient.setex(info.token, TIME_TO_LIVE, JSON.stringify(authInfo), function (error, success) {
            if (error) {
                callback(error);
                return;
            }
            callback(undefined, success);
        });
    };
    // Function to get Token information
    getToken = function () {
        
    };
    // Function to expire Token
    delToken = function (token, callback) {
        if (!token) {
            callback();
            return;
        }
        rClient.del(token, function (error, success) {
            if (error) {
                callback(error);
                return;
            }
            if (success) {
                callback(undefined, true);
                return;
            }
            callback();
        });
    };
    return {
        setToken : setToken,
        getToken : getToken,
        delToken : delToken
    };
};
module.exports = new Redis();