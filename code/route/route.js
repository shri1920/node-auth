/*jslint node:true*/
var user = require('../authentication/user');

// Function to initiate the use session
exports.setSession = function (req, res) {
    "use strict";
    var userId = req.body.userId,
        passwd = req.body.passwd;
    // userId and passwd are require field for login
    if (!userId && !passwd) {
        res.status(400).json({code: "MISSING_PARAMETER", msg: "require parameter email and passwd is missing"});
        return;
    }
    user.findUser(userId, passwd, function (error, validUser) {
        if (error && !validUser) {
            res.status(400).json({code: "NOT_FOUND", msg: "user not found"});
            return;
        }
        user.login(function (error, token) {
            if (error) {
                res.status(500).json({code: "LOGIN_ERROR", msg: "not able authenticate"});
                return;
            }
            res.status(200).json(token);
        });
    });
};

// Function to destroy the user session
exports.destroySession = function () {
    "use strict";
};

// Function to register the user
exports.registerUser = function () {
    "use strict";
};

// Function to remove the user
exports.removeUser = function () {
    "use strict";
};

