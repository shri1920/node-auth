/*jslint node:true*/
var cradle = require('cradle'),
    crypto = require('crypto'),
    config = require('./config'),
    Utils;
Utils = function () {
    "use strict";
    var createConnection, setDatabase, createHash, findUser, createUser, getDoc;
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
    // Function to create hash from passwd
    createHash = function (value) {
        return crypto.createHash("sha256").update(value, "utf8").digest("base64");
    };
    // Function to check whether User doc is Available or not
    findUser = function (userId, callback) {
        getDoc("_users", "org.couchdb.user:" + userId, function (error, result) {
            if (callback && typeof callback === "function") {
                callback(error, result);
            }
            return;
        });
    };
    // Function to create New User
    createUser = function (options, callback) {
        findUser(options.userId, function (error, found) {
            if (found) {
                callback({"status": "409", "reason": "document update conflict"}, undefined);
                return;
            }
            if (error) {
                var connection = createConnection(),
                    db = setDatabase(connection, "_users");
                db.save("org.couchdb.user:" + options.userId, {
                    name          : options.userId,
                    firstName     : options.firstName,
                    confirmPasswd : createHash(options.passwd),
                    roles         : [],
                    type          : "user"
                }, function (error, result) {
                    if (callback && typeof callback === "function") {
                        callback(error, result);
                    }
                });
            }
        });
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
    return {
        createConnection : createConnection,
        getDoc : getDoc,
        findUser : findUser,
        createUser : createUser,
        createHash : createHash
    };
};
module.exports = new Utils();