/* ----- ----------  | TEMPLATE SERVER | ---------- -----
*	The following application is an Template server using Node.JS and the Express framework.
*
*	This file serves as the entry point and is the file you run to initizalize the application.
*	
*	
*	Author: Isaac Lock
*
*/

// ----- DEPENDENCIES -----
const express  = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// const path = require('path');

const dotenv = require("dotenv");                   //Set up access to your .env file
dotenv.config();                                    //configure your .env file for access in the app

//Configure Services
// require('./services/Authenticator');

/* ----- GLOBAL VARIABLES --
* All global variables used within this file.
*/

const portNumber = 3000;

/* ----- ROUTING FILES -----
* Link the files you will route to depending on the request. 
*
*/
// const authRouter = require('./routes/authentication');
const publicThingRouter = require('./routes/publicThings');
// const privateThingRouter = require('./routes/privateThings')

// ----- APP INITIALIZATION -----
const app = express();              //Initalize express app
app.disable('x-powered-by');        //Generally best to disable this as it prevents hostile agents from knowing the type of server you are running
app.use(bodyParser.json());         //Allows for easy parsing of HTTP request bodies
app.use(express.json());
// app.use(cookieParser());
app.use(logger('dev'));             //Allows us to see requests made to the server in the terminal window

// app.use(express.urlencoded({ extended: false }));
// app.use(cors({
// 	credentials: true
// }));

// app.use(session({
// 	secret: process.env.SESSION_SECRET,
// 	resave: true,
// 	saveUninitialized: false,
// 	cookie: {
// 		// httpOnly: true,
// 		secure: false, //TODO: figure out how to change for true in production
// 		// sameSite: true,
// 		// maxAge: 1000 * 60 * 10
// 	},
// 	name: "sid",
// 	rolling: true,
// 	// store: // Something like mongoSessionStore
// }));
// app.use(passport.authenticate('session'));
// app.use(passport.initialize());
// app.use(passport.session());

//----- SECURITY MIDDLEWARE -----------

app.use(function (req, res, next) {

    //Set the origin server we will allow requests from
	if (process.env.NODE_ENV == 'development' ) {
		res.setHeader('Access-Control-Allow-Origin', process.env.DEV_ORIGIN_SERVER);
	}
	else {
		res.setHeader('Access-Control-Allow-Origin', process.env.PROD_ORIGIN_SERVER);
	}

    //Declare Methods you will allow the client to use to make requests to this server
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');

    //Declare Headers you will allow the client to access
	// res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Set-Cookie');

    //Declare Headers you will expose
	// res.setHeader('Access-Control-Expose-Headers', 'X-csrf');   //Custom Header X-csrf is security token we will use to validate requests with
	
    //Allow access to Credentials
    // res.setHeader('Access-Control-Allow-Credentials', true);
  
    //Move through middleware to continue routing through the application
	next();
});

//----- ROUTES ------------------------

// app.use('/', authRouter);
app.use('/api/v1', publicThingRouter);
// app.use('/api/v1', privateThingRouter);

//Port Setup
app.listen(portNumber, function(){
	console.log("Server Running");
	console.log("Listening on port: " + portNumber)
	console.log("------------------------------");
});

//----- ERROR HANDLERS ----------------

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
	res.status(404).json({msg: "Could not find resource"});
});

// Catch Unauthorized errors
app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(403).json({msg: "Unauthroized Access"});
	}
    else {
        res.status(500).json({msg: "Internal Server Error"})
    }
});


module.exports = app;