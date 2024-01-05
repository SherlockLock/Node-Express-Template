const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class User {

    //----- CONSTRUCTOR ---------------
    constructor(email, password) {
        this._email = email;
        this._salt = crypto.randomBytes(16).toString('hex');
        this._hash = crypto.pbkdf2Sync(password, this._salt, 1000, 64, 'sha512').toString('hex');
    }

    //----- PUBLIC FUNCTIONS ----------
    validPassword(password) {
        let hash = crypto.pbkdf2Sync(password, this._salt, 1000, 64, 'sha512').toString('hex');
        return this._hash === hash;
    }

    generateJWT() {
        
        let expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
    
        return jwt.sign(
            {
                user: {
                    email: this._email
                },
                exp: parseInt(expiry.getTime() / 1000),
            }, 
            process.env.LOGIN_SECRET
        );

    }

}

module.exports = User;