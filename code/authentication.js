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
router.post('/login', route.setSession);
// Api to destroy the user session
router.post('/logout', route.destroySession);
// Api to register the user to the system
router.post('/registeruser', route.registerUser);
// Api to remove the user from the system
router.post('/removeuser', route.removeUser);
// Register the router
app.use('/', router);

// Start the Authentication server
app.listen(app.get('port'));
console.log('Authentication server running at port no: ' + app.get('port'));