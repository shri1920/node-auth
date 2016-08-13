/*jslint node:true*/
var User = function () {
    "use strict";
    // Function to check whether the user is valid or not
    var cradle = require('cradle'),
        config = require('../config/config'),
        utils  = require('./utils'),
        redis  = require('../utils/redisHelper'),
        mail   = require('../utils/mailHelper'),
        lang   = require('../utils/langHelper').load(),
        isValidUser,
        registerUser,
        createConnection,
        setDatabase,
        getDoc,
        passwdRecoveryLink,
        changePasswd;
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
    // Function to generate
    passwdRecoveryLink = function (userId, callback) {
        getDoc("_users", "org.couchdb.user:" + userId, function (error, result) {
            if (error) {
                callback({"status": "404", "reason": "user not found"}, undefined);
                return;
            }
            if (result) {
                var token;
                console.log(userId + new Date().getTime());
                token = utils.createHash(userId + new Date().getTime(), "md5");
                redis.set({recoveryToken: token, userId: userId}, function (error, success) {
                    if (success) {
                        var recoveryLink, sub = "", body = "";
                        // Link for passwd recovery
                        recoveryLink = encodeURIComponent(userId) + "?signature=" + token;
                        // Email Subject
                        sub  += "Company name" + " | " + lang.m_psd_recover_sub;
                        // Email body
                        body += "<p>" + lang.m_dear + userId + "</p>";
                        body += "<p>" + lang.m_psd_recover_msg_1 + "</p>";
                        body += "<p>" + recoveryLink + "</p>";
                        body += "<p>" + lang.m_psd_recover_msg_2 + "</p>";
                        body += "<p>" + lang.m_regards  + "</p>" + "Administrator";
                        //to, sub, body, callback
                        mail.send(userId, sub, body, function (error, success) {
                            callback(error, success);
                        });
                        return;
                    }
                    callback(error, undefined);
                });
            }
        });
    };
    changePasswd = function (options, callback) {
        redis.get(options.signature, function (error, available) {
            if (error) {
                callback({"status": "400", "reason": "invalid request"}, undefined);
                return;
            }
            if (available) {
                getDoc("_users", "org.couchdb.user:" + options.userId, function (error, result) {
                    if (error) {
                        callback({"status": "404", "reason": "user not found"}, undefined);
                        return;
                    }
                    if (result) {
                        result.passwd = utils.createHash(options.passwd);
                        var connection = createConnection(),
                            db = setDatabase(connection, "_users");
                        db.save("org.couchdb.user:" + options.userId, result, function (error, result) {
                            if (result) {
                                redis.del(options.signature);
                            }
                            callback(error, result);
                        });
                    }
                });
            }
        });
    };
    return {
        isValidUser : isValidUser,
        registerUser : registerUser,
        passwdRecoveryLink : passwdRecoveryLink,
        changePasswd : changePasswd
    };
};
module.exports = new User();