/*jslint node:true*/
var User = function () {
    "use strict";
    // Function to check whether the user is valid or not
    var utils = require('./utils'),
        isValidUser,
        findUser,
        registerUser,
        tempUser;
    tempUser = {
        "test@test.com": {
            "passwd": "123456"
        },
        "someone@example.com": {
            "passwd": "123456"
        }
    };
    // Function to check if the User is a Valid user or not
    isValidUser = function (userId, passwd, callback) {
        // TEMP
        if (tempUser[userId] && tempUser[userId].passwd === passwd) {
            callback(undefined, true);
        } else {
            callback(true, undefined);
        }
    };
    // Function to check if the user is already available in the system or not.
    findUser = function (userId, callback) {
        // TEMP
        if (userId) {
            callback();
        }
    };
    // Function to Register the user.
    registerUser = function (userInfo, callback) {
        // Check if the user is already available in the system or not.
        findUser(userInfo.userId, function (found) {
            if (found) {
                callback({"status": "409", "reason": "document update conflict"}, undefined);
                return;
            }
            tempUser[userInfo.userId] = {
                "passwd": utils.createHash(userInfo.passwd)
            };
        });
    };
    return {
        isValidUser : isValidUser,
        registerUser : registerUser
    };
};
module.exports = new User();