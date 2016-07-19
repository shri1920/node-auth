/*jslint node:true*/
var User = function () {
    "use strict";
    // Function to check whether the user is valid or not
    var isValidUser;
    isValidUser = function (userId, passwd, callback) {
        // TEMP
        var user = {
            "test@test.com": {
                "passwd": "123456"
            },
            "someone@example.com": {
                "passwd": "123456"
            }
        };
        // ===================
        if (user[userId] && user[userId].passwd === passwd) {
            callback(undefined, true);
        } else {
            callback(true, undefined);
        }
    };
    return {
        isValidUser : isValidUser
    };
};
module.exports = new User();