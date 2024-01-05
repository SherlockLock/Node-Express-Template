/*  USER DATABASE
* 
*   This file acts as a makeshift database for our application to perform CRUD operations on our User objects
*
*   Author : Isaac Lock
*/

/*----- INITIALIZATION & DEPENDENCIES -
* Section for all dependencies this file needs to have initialized in order to work as intended.
*/
const User = require('../models/user');

/*----- GLOBAL VARIABLES --------------
* Section for any variables or constants that might be used throughout the routes present in this file.
*/

//Our "Database" that will hold all of our things. We will populate it with some things to start with
let users = [
    new User("email@inter.net", "password")
];

/*----- PRIVATE FUNCTIONS -------------
* Section for all private functions that are only available in this module.
*/

/* Returns a boolean if a user with the provided email exists within our database
*
*/
function emailIsRegistered(email) {
    return users.find(user => user._email === email);
}

/*----- PUBLIC FUNCTIONS --------------
* Section for aLL public functions this module will export for use in other areas of the application.
*/

/* This function will validate a user request and then create a new user in the system.
*
*/
function create(user, next) {

    //Check if the email is already registered in the database.
    if (emailIsRegistered(email)) {
        //If it is, do not create another account with the same email
        next(400, null);
    }
    else {
        //If the email is not already in use, create a new user and send back a JWT token for the user to login with.
        let newUser = new User(user.email, user.password);
        users.push(newUser);
        next(200, newUser.generateJWT());
    }

};

/* This function will validate a login request by searching for a user with the email and then validating the password.
*/
function login(email, password, next) {

    //Search for the user object with the associated email.
    let user = users.find(user => user._email == email);

    //If the user object can not be found, then the request was invalid
    if (!user) {
        next(400, null);
    }
    else {
        //If a user with the email can be found, validate the password that was used
        if (user.validPassword(password)) {
            //If the password was valid, respond with a JWT token for the user to use in subsequent requests
            next(200, user.generateJWT());
        }
        else {
            //Else the password was invalid.
            next(400, null);
        }
    }
}
/* This function will validate a token that was sent to the server for an authenticated user.
*
*/
function validToken(token, next) {
    //Determing if the email within to token is valid and then determine if the token has expired.
    if (users.find(user => token.user.email == user._email) && new Date(token.exp) >= new Date().getDate()) {
        //Both valid, continue with 200
        next(200);
    }
    else {
        //Invalid, unauthorized access detected
        next(403);
    }
}


/*----- EXPORTS -----------------------
* Exports the functions used to interact with this database
*/
module.exports = {
    create,
    login,
    validToken
}