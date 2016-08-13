/*jslint node:true*/
var Mailer = function () {
    "use strict";
    var mailer = require('nodemailer'),
        send;
    // Function to send mail
    send = function (to, sub, body, callback) {
        /*var transport, mailOptions;
        transport = mailer.createTransport("SMTP", {
            service: "Gmail",
            auth: {
                user: "gmail.user@gmail.com",
                pass: "passwd"
            }
        });
        mailOptions = {
            from    : "someone@companyname.com",
            to      : to,
            subject : sub,
            text    : body
        };*/
        console.log(to);
        console.log(sub);
        console.log(body);
        // send mail with defined transport object
        callback(undefined, true);
        /*transport.sendMail(mailOptions, function (error, response) {
            callback(error, response);
        });*/
    };
    return {
        send: send
    };
};
module.exports = new Mailer();