/*  AUTHENTICATION ROUTES
* 
*   This file contains all of the routes related to logic performed with simple authentication using the passport module
*
*   Author : Isaac Lock
*/

//----- INITIALIZATION & DEPENDENCIES -

//Set Up Dependencies
const express = require('express');
const router = express.Router();

const userDB = require('../Database/userDatabase');

//----- GLOBAL VARIABLES --------------


//----- FUNCTIONS ---------------------


//----- VALIDATION FUNCTIONS ----------

/* Email Validation
*
*   Regular Expression validation for Email validation
*
*   Returns a boolean indicating if the email is valid
*/
function validEmail(email) {
    var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (email && email !== '' && email.match(emailFormat)) { return true; }
    
    return false;
}

/* Password Validation
*
*   Validates the requested account password meets the criteria listed.
*
*/
function validPassword(password) {
    return password && password !== '' && password.length > 2 && password.length < 20;
}

//----- ROUTES ------------------------

/* Route to Login
*   Params: None
*   Body:
*       - email                 : String   
*       - password              : String    
*   Headers: None
*/
router.post('/login', function(req, res, next) {

    userDB.login(req.body.email, req.body.password, (status, token) => {
        if (status == 200) {
            //Valid login, respond with the generated JWT token for usage in subsequent requests
            res.status(200).json({ token : token });
        }
        else if (status == 400) {
            res.status(401).send({msg: "Could not authenticate user!"});
        }
        else {
            res.status(500).send({msg: "Could not authenticate user!"});
        }
        
    });

});

//TODO: TEST
router.post('/signup', function(req, res, next) {

   //Create user object
   var newUser = {
        email: req.body.email,
        password: req.body.password
    };

    //Validation
    if (!validEmail(newUser.email)) {
        res.status(400).json({msg: "Invalid email!"});
    }
    else if (!validPassword(newUser.password)) {
        res.status(400).json({msg: "Invalid password! Password must be between 2 and 20 characters long."});
    }

    else {

        userDB.create(newUser, (status, token) => {

            if (status == 400) {
                res.status(400).json({msg: "An account with that email has already exists!"});
            }
            else if (status == 200) {
                res.status(200).json({msg: "Account created!", token: token});
            }
            else {
                res.status(500).json({ msg: "Internal Server Error"});
            }

        });

    }

});

module.exports = router;