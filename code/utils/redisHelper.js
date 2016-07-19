/*jslint node:true*/
var Redis = function () {
    "use strict";
    var redis = require('redis'),
        redisClient = redis.createClient("6379", "127.0.0.1"),
        set,
        get,
        del;
    // Function to set Token with related data
    set = function (info, callback) {
        var TIME_TO_LIVE = 60 * 60 * 24, authInfo;
        authInfo = {
            userId: info.userId,
            tokenType: info.tokenType,
            scope: info.scope
        };
        redisClient.setex(info.accessToken, TIME_TO_LIVE, JSON.stringify(authInfo), function (error, success) {
            if (error) {
                callback(error);
                return;
            }
            callback(undefined, success);
        });
    };
    // Function to get Token information
    get = function () {};
    // Function to expire Token
    del = function (token, callback) {
        if (!token) {
            callback();
            return;
        }
        redisClient.del(token, function (error, success) {
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
        set: set,
        get: get,
        del: del
    };
};
module.exports = new Redis();