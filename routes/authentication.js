/*  AUTHENTICATION ROUTES
* 
*   This file contains all of the routes related to logic performed with simple authentication
*
*   Version 1.0.0
*
*   Author : Isaac Lock
*/

//----- INITIALIZATION & DEPENDENCIES -

//Set Up Dependencies
const express = require('express');
const router = express.Router();
const passport = require('passport');

//Set Up Models
const User = require('../models/user');

//----- GLOBAL VARIABLES --------------


//----- FUNCTIONS ---------------------


//----- VALIDATION FUNCTIONS ----------

/* Email Validation
*
*   Regular Expression validation for Email validation
*
*   Returns a boolean indicating if the email is valid
*/
function isEmail(email) {
    var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (email && email !== '' && email.match(emailFormat)) { return true; }
    
    return false;
}

/* Phone Number Validation
*
*   Regular Expression validation for phone number validation
*
*   Returns a boolean indicating if the phone number is valid
*/
function isPhoneNumber(number) {
    var numberFormat = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (number && number !== '' && number.match(numberFormat)) { 
        return true; 
    }

    return false;
}

/* Name Validation
*
*   Ensures the name provided is valid
*
*   Returns a boolean indicating if the name is valid
*/
function isName(name) {
    if (name && name !== '' && name.length > 2 && name.length < 20) { return true; };

    return false;
}

//----- ROUTES ------------------------

/* Route to Login
*   Params: None
*   Body:
*       - email                 : String   
*       - password              : String    
*   Headers: None
*   Notes: 
*       This route will use passport.js to authenticate the user and generate a Jwt
*
*   Authentication Required:    NO
*   Admin Authentication:       NO
*/
router.post('/login', function(req, res, next) {

    passport.authenticate('local', function(err, user, info) {

        //JWT token to return on successful login
        var token;
    
        // If Passport throws/catches an error
        if (err) {
            res.status(500).send({msg: "Could not authenticate user!"});
            return;
        }
	    
        // If a user object is found
        if (user) {
            token = user.generateJwt();
            res.status(200).json({ "token" : token });

        } else {
            // If a user object is not found
            res.status(401).send({msg: "Could not authenticate user!"});
        }
      })(req, res);
    
});

//TODO: Create Logout functions


module.exports = router;