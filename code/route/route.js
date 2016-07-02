/*jslint node:true*/
var user = require('../utils/user');

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
        res.status(400).json({code: "MISSING_PARAMETER", msg: "require parameter missing"});
        return;
    }
    console.log("[Register User] | Request received from " + options.userId);
    user.registerUser(options, function (error, success) {
        if (error) {
            if (error.status === "409") {
                console.log("[Register User] | User registered already" + options.userId);
                res.status(409).json({"msg": "user registered already"});
                return;
            }
            console.log("[Register User] | error creating user" + options.userId);
            res.status(400).json({"msg": "error creating user"});
            return;
        }
        res.status(201).json({"msg": success});
    });
};

// Function to initiate the use session
exports.logIn = function (req, res) {
    "use strict";
    /*
        curl -X POST http://localhost:5100/login
             -H "Content-Type: application/json"
             -d '{"userId": "someone@example.com", "passwd": "123456"}'
    */
    var userId = req.body.userId,
        passwd = req.body.passwd;
    // userId and passwd are require field for login
    if (!userId && !passwd) {
        res.status(401).json({msg: "login failed"});
        return;
    }
    console.log("[Login] | Request received from " + userId);
    user.getToken(userId, passwd, function (error, token) {
        if (error) {
            console.log("[Login] | Login failed " + userId);
            res.status(401).json({msg: "login failed"});
            return;
        }
        res.status(200).json(token);
    });
};