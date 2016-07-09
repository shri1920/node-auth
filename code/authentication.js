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

// Set the port no
app.set('port', process.env.PORT || 5100);

router = express.Router();
// Api to set the session
router.post('/login', route.logIn);
// Api to destroy the user session
router.post('/logout', route.logOut);
// Api to register the user to the system
router.post('/registeruser', route.registerUser);
// Api to generate and share the recover password link
router.post('/recoverpasswd', route.recoverPasswd);
// Api to change the passwd
router.post('/changepasswd/:userId', route.changePasswd);
// Register the router
app.use('/', router);

// Start the Authentication server
app.listen(app.get('port'));
console.log('Authentication server running at port no: ' + app.get('port'));