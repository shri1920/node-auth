/*jslint node:true*/
var Mailer = function () {
    "use strict";
    var mailer = require('nodemailer'),
        send;
    // Function to send mail
    send = function (from, to, sub, text, html, callback) {
        var transport, mailOptions;
        transport = mailer.createTransport("SMTP", {
            service: "Gmail",
            auth: {
                user: "gmail.user@gmail.com",
                pass: "passwd"
            }
        });
        mailOptions = {
            from    : from,
            to      : to,
            subject : sub,
            text    : text, // plain text body
            html    : html  // html body
        };
        // send mail with defined transport object
        transport.sendMail(mailOptions, function (error, response) {
            callback(error, response);
        });
    };
    return {
        send: send
    };
};
module.exports = new Mailer();