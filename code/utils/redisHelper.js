/*jslint node:true*/
var Redis = function () {
    "use strict";
    var redis = require('redis'),
        redisClient = redis.createClient("6379", "127.0.0.1"),
        set,
        get,
        del;
    // Function to set the Token with related data
    set = function (info, callback) {
        var TIME_TO_LIVE = 60 * 60 * 24, authInfo;
        authInfo = {
            userId: info.userId,
            tokenType: info.tokenType,
            scope: info.scope
        };
        redisClient.setex(info.accessToken, TIME_TO_LIVE, JSON.stringify(authInfo), function (error, success) {
            callback(error, success);
        });
    };
    // Function to get the Token information
    get = function (key, callback) {
        redisClient.get(key, function (error, reply) {
            // reply is null when the key is missing
            if (reply) {
                reply = JSON.parse(reply);
            }
            callback(error, reply);
        });
    };
    // Function to expire the Token
    del = function (token, callback) {
        redisClient.del(token, function (error, success) {
            callback(error, success);
        });
    };
    return {
        set: set,
        get: get,
        del: del
    };
};
module.exports = new Redis();