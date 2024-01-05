/*  AUTHENTICATION SERVICE
* 
*   Configuration for Passport module authentication.
*
*   Author : Isaac Lock
*/

const passport = require('passport');

//Passport configuration for authentication
const LocalStrategy = require('passport-local').Strategy;

const User = require('../../models/Users/User');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    User.findOne({ email: username }, function (err, user) {
        //Error occured while searching for User
        if (err) { 
            return done(err); 
        }
        // Return if user not found in database
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        // Return if password is wrong
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Password is wrong' });
        }
        // If credentials are correct, return the user object
        return done(null, user);
    });
  }
));