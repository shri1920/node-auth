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
        var TIME_TO_LIVE, key;
        // Validity period of the Token stored in Redis
        TIME_TO_LIVE = 60 * 60 * 24;
        // Auth info | info = {userId: "someone@example.com", tokenType: "Bareer", scope: "read write"}
        if (info.accessToken) {
            key = info.accessToken;
            redisClient.setex(key, TIME_TO_LIVE, JSON.stringify(info), function (error, success) {
                if (callback && typeof callback === "function") {
                    callback(error, success);
                }
            });
            return;
        }
        if (info.recoveryToken) {
            key = info.recoveryToken;
            TIME_TO_LIVE = 60 * 60; // Recovery link will be live for MAX 1 HOUR
            redisClient.setex(key, TIME_TO_LIVE, JSON.stringify(info), function (error, success) {
                if (callback && typeof callback === "function") {
                    callback(error, success);
                }
            });
            return;
        }
    };
    // Function to get the Token information
    get = function (key, callback) {
        redisClient.get(key, function (error, reply) {
            // reply is null when the key is missing
            if (reply) {
                reply = JSON.parse(reply);
            }
            if (callback && typeof callback === "function") {
                callback(error, reply);
            }
        });
    };
    // Function to expire the Token
    del = function (token, callback) {
        redisClient.exists(token, function (error, result) {
            if (result === 1) {
                redisClient.del(token, function (error, success) {
                    if (callback && typeof callback === "function") {
                        callback(error, success);
                    }
                });
                return;
            }
            if (result === 0) {
                if (callback && typeof callback === "function") {
                    callback({"status": "401", "reason": "Unauthorized request"}, undefined);
                }
                return;
            }
            if (callback && typeof callback === "function") {
                callback(error, result);
            }
        });
    };
    return {
        set: set,
        get: get,
        del: del
    };
};
module.exports = new Redis();