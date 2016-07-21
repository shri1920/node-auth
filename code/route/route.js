/*jslint node:true*/
var user = require('../utils/user'),
    utils = require('../utils/utils'),
    redis = require('../utils/redisHelper');

// Function to initiate the user Token generation
exports.logIn = function (req, res) {
    /*
        curl -X POST http://localhost:5100/login
             -H "Content-Type: application/json"
             -d '{"userId": "someone@example.com", "passwd": "123456"}'
    */
    "use strict";
    var userId = req.body.userId,
        passwd = req.body.passwd;
    // userId and passwd are require field for login
    if (!userId && !passwd) {
        res.status(400).json({msg: "bad request"});
        return;
    }
    // Check if the user is available or not (Registered to system or not)
    user.isValidUser(userId, passwd, function (error, status) {
        if (error) {
            res.status(404).json({msg: "user not found"});
            return;
        }
        if (status) {
            // If valid generate token for the user
            utils.generateToken(function (error, token) {
                if (error) {
                    res.status(400).json({msg: "unable to get access token"});
                    return;
                }
                if (token) {
                    token.userId = userId;
                    // Store the Token in Key Value store.
                    redis.set(token, function (error, success) {
                        if (error) {
                            res.status(400).json({msg: "unable to get access token"});
                            return;
                        }
                        if (success) {
                            res.status(200).json(token);
                        }
                    });
                }
            });
        }
    });
};

// Function to expire the user Token
exports.logOut = function (req, res) {
    /*
        curl -X POST http://localhost:5100/logout
             -H "Authorization: Bearer token-123-456-789"
    */
    "use strict";
    if (!req.headers.authorization) {
        res.status(401).json({msg: "unauthorized"});
        return;
    }
    utils.expireToken(req.headers.authorization, function (error, success) {
        if (error) {
            res.status(400).json({msg: ""});
            return;
        }
        if (success) {
            res.status(200).json({msg: "token expired"});
        }
    });
};

// Function to register new user
exports.registerUser = function (req, res) {
    "use strict";
    /*
        curl -X POST http://localhost:5100/registeruser
             -H "Content-Type: application/json"
             -d '{"userId": "someone@example.com", "passwd": "123456", "firstName": "Fname", "lastName": "Lname"}'
    */
    var options = req.body || {};
    if (!options.userId || !options.passwd || !options.firstName) {
        res.status(400).json({msg: "bad request"});
        return;
    }
    user.registerUser(options, function (error, success) {
        if (error) {
            if (error.status === "409") {
                res.status(409).json({"msg": "user registered already"});
                return;
            }
            res.status(400).json({"msg": "error creating user"});
            return;
        }
        res.status(201).json({"msg": success});
    });
};