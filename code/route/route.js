/*jslint node:true*/
var user  = require('../utils/user'),
    utils = require('../utils/utils'),
    log   = require('../utils/logs'),
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
        log.write("Login", "missing required parameter");
        res.status(400).json({msg: "bad request"});
        return;
    }
    log.write("Login", "request received for login", userId);
    // Check if the user is available or not (Registered to system or not)
    user.isValidUser(userId, passwd, function (error, status) {
        if (error) {
            if (error.status === 400) {
                log.write("Login", "valid user check failed", userId);
                res.status(400).json({msg: "bad request"});
                return;
            }
            log.write("Login", "user not found", userId);
            res.status(404).json({msg: "user not found"});
            return;
        }
        if (status) {
            // If valid generate token for the user
            utils.generateToken(function (error, token) {
                if (error) {
                    log.write("Login", "unable to get access token", userId);
                    res.status(400).json({msg: "unable to get access token"});
                    return;
                }
                if (token) {
                    token.userId = userId;
                    // Store the Token in Key Value store.
                    redis.set(token, function (error, success) {
                        if (error) {
                            log.write("Login", "unable to get access token", userId);
                            res.status(400).json({msg: "unable to get access token"});
                            return;
                        }
                        if (success) {
                            log.write("Login", "user login success", userId);
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
        log.write("Logout", "unauthorized request");
        res.status(401).json({msg: "unauthorized"});
        return;
    }
    utils.expireToken(req.headers.authorization, function (error, success) {
        if (error) {
            if (error.status === 401) {
                log.write("Logout", "unauthorized request");
                res.status(401).json({msg: "unauthorized"});
                return;
            }
            log.write("Logout", "bad request");
            res.status(400).json({msg: "bad request"});
            return;
        }
        if (success) {
            log.write("Logout", "token expired");
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
        log.write("Register user", "missing required parameter");
        res.status(400).json({msg: "bad request"});
        return;
    }
    log.write("Register user", "request received", options.userId);
    user.registerUser(options, function (error, success) {
        if (error) {
            if (error.status === "409") {
                log.write("Register user", "user registered already", options.userId);
                res.status(409).json({"msg": "user registered already"});
                return;
            }
            log.write("Register user", "error creating user", options.userId);
            res.status(400).json({"msg": "error creating user"});
            return;
        }
        log.write("Register user", "user registeredr", options.userId);
        res.status(201).json({"msg": success});
    });
};

// Function to Get Password recovery link
exports.forgotPasswd = function (req, res) {
    "use strict";
    /*
        curl -X POST http://localhost:5100/forgotpasswd
             -H "Content-Type: application/json"
             -d '{"userId": "someone@example.com"}'
    */
    var options = req.body || {};
    if (!options.userId) {
        log.write("Forgot Passwd", "missing required parameter");
        res.status(400).json({msg: "bad request"});
        return;
    }
    log.write("Forgot Passwd", "request received", options.userId);
    user.passwdRecoveryLink(options.userId, function (error) {
        if (error) {
            if (error.status === "404") {
                log.write("Forgot Passwd", "user not found", options.userId);
                res.status(404).json({"msg": "user not found"});
                return;
            }
            log.write("Forgot Passwd", "error generating recovery link", options.userId);
            res.status(400).json({"msg": "error generating recovery link"});
            return;
        }
        log.write("Forgot Passwd", "passwd recovery link sent", options.userId);
        res.status(200).json({"msg": "passwd recovery link sent"});
    });
};

// Function to Change Password
exports.changePasswd = function (req, res) {
    "use strict";
    /*
        curl -X POST http://localhost:5100/changepasswd/<user id>/<token>
             -H "Content-Type: application/json"
             -d '{"passwd": "new-passwd"}'
    */
    var options = req.body || {};
    if (!req.params.userId || !req.params.token || !options.passwd) {
        log.write("Change Passwd", "missing required parameter");
        res.status(400).json({msg: "bad request"});
        return;
    }
    log.write("Change Passwd", "request received", options.userId);
    user.changePasswd({userId: req.params.userId, token: req.params.token, passwd: options.passwd}, function (error, success) {
        if (error) {
            if (error.status === 404) {
                log.write("Forgot Passwd", "user not found", options.userId);
                res.status(404).json({"msg": "user not found"});
                return;
            }
            if (error.status === 400) {
                log.write("Change Passwd", "user not found", options.userId);
                res.status(400).json({"msg": "invalid request"});
                return;
            }
            res.status(400).json({"msg": "bad request"});
            return;
        }
        if (success) {
            res.status(200).json({"msg": "password changed"});
            return;
        }
    });
};