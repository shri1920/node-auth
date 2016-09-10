
/*
    Project: Token based Authentication
    Author: shrisha.sb@mobinius.com
*/

/*jslint node:true*/

var express    = require('express'),
    app        = express(),
    bodyParser = require('body-parser'),
    router,
    route      = require('./route/route');

// Body-parser (To parse the request body)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
/* 
    Add to avoid cross origin access.
    Access-Control-Allow-Origin is set to '*' so that server REST APIs are accessible for all the domains.
    By setting domain name to some value, the API access can be restricted to only the mentioned domain. 
    Eg, Access-Control-Allow-Origin: 'mywebsite.com'
*/
app.use(function (req, res, next) {
    "use strict";
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "content-type");
    next();
});

// Set the port no
app.set('port', process.env.PORT || 5100);

router = express.Router();
// Api to allow the user to log in
router.post('/login', route.logIn);
// Api to log out the logged in user
router.post('/logout', route.logOut);
// Api to register the user to the system
router.post('/registeruser', route.registerUser);
// Api to confirm user registration
router.post('/confirmuser/:userId', route.confirmUser);
// Api to get passwd recovery link
router.post('/forgotpasswd', route.forgotPasswd);
// Api to change the passwd
router.post('/changepasswd/:userId', route.changePasswd);
// Api to verify the Token (To access the protected info)
router.post('/verify', route.verify);

app.use('/', router);

// Start the Authentication server
app.listen(app.get('port'));
console.log('Authentication server Started @ ' + new Date() + ' Running on port no: ' + app.get('port'));