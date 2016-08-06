/*jslint node:true*/
var User = function () {
    "use strict";
    // Function to check whether the user is valid or not
    var cradle = require('cradle'),
        config = require('../config/config'),
        utils  = require('./utils'),
        redis  = require('../utils/redisHelper'),
        mail   = require('../utils/mailHelper'),
        isValidUser,
        registerUser,
        createConnection,
        setDatabase,
        getDoc,
        passwdRecoveryLink;
    // Function to open a connection for CouchDB
    createConnection = function () {
        var connection;
        if (config.couchdbUserName && config.couchdbPassword) {
            connection = new (cradle.Connection)(config.couchdbHost, config.couchdbPort, {
                auth: {
                    username: config.couchdbUserName,
                    password: config.couchdbPassword
                }
            });
        } else {
            connection = new (cradle.Connection)(config.couchdbHost, config.couchdbPort);
        }
        return connection;
    };
    // Function to set the Database
    setDatabase = function (connection, dbName) {
        return connection.database(dbName);
    };
    // Function to get the information of document w.r.t docID
    getDoc = function (dbName, docId, callback) {
        var connection = createConnection(),
            db = setDatabase(connection, dbName);
        db.get(docId, function (error, result) {
            if (callback && typeof callback === "function") {
                callback(error, result);
            }
            return;
        });
    };
    // Function to check if the User is a Valid user or not
    isValidUser = function (userId, passwd, callback) {
        getDoc("_users", "org.couchdb.user:" + userId, function (error, result) {
            if (result) {
                if (result.passwd === utils.createHash(passwd)) {
                    callback(undefined, true);
                    return;
                }
                callback({"status": "400", "reason": "bad request"}, undefined);
            }
            callback(error, result);
        });
    };
    // Function to Register the user.
    registerUser = function (userInfo, callback) {
        // Check if the user is already available in the system or not.
        getDoc("_users", "org.couchdb.user:" + userInfo.userId, function (error, result) {
            if (result) {
                callback({"status": "409", "reason": "document update conflict"}, undefined);
                return;
            }
            if (error) {
                var connection = createConnection(),
                    db = setDatabase(connection, "_users");
                db.save("org.couchdb.user:" + userInfo.userId, {
                    name          : userInfo.userId,
                    firstName     : userInfo.firstName,
                    lastName      : userInfo.firstName,
                    confirmPasswd : utils.createHash(userInfo.passwd),
                    roles         : [],
                    type          : "user"
                }, function (error, result) {
                    callback(error, result);
                });
            }
        });
    };
    passwdRecoveryLink = function (userId, callback) {
        getDoc("_users", "org.couchdb.user:" + userId, function (error, result) {
            if (error) {
                callback({"status": "404", "reason": "user not found"}, undefined);
                return;
            }
            if (result) {
                var token, ttl;
                token = utils.createHash(userId + new Date().toISOString());
                ttl   = 60 * 60; // Recovery link will be live for MAX 1 HOUR
                redis.set(token, ttl, function (error, success) {
                    if (success) {
                        return;
                    }
                    //from, to, sub, text, html, callback
                    mail.send();
                    callback(error, undefined);
                });
            }
        });
    };
    return {
        isValidUser : isValidUser,
        registerUser : registerUser,
        passwdRecoveryLink : passwdRecoveryLink
    };
};
module.exports = new User();