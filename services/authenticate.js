/*  AUTHENTICATE SERVICE
* 
*   Middleware function used to verify JWT token to see if the user is authenticated
*
*   Author : Isaac Lock
*/

const jwt = require('jsonwebtoken');
const userDB = require('../Database/userDatabase');

async function authenticate(req, res, next) {

    //Parse out the token from the request headers
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    //Token was not found
    if (token == null) {
        return res.sendStatus(401);
    } 
  
    //Decode the token that was found using our login secret
    jwt.verify(token, process.env.LOGIN_SECRET, async (err, token) => {
  
        //Some error occured while decoding the token
        if (err) {
            return res.status(403).json({msg: "Unauthorized Access"});
        } 
        else {    
            
            //Token was decoded, now validate it with our database
            userDB.validToken(token, (status) => {
                if (status == 200) {
                    next(); //Valid token, continue routing
                }
                else if (status == 403) {
                    res.status(403).json({msg: "Unauthorized Access"});
                }
                else {
                    res.status(500).json({msg: "Internal Server Error"});
                }
            });

      }
  
    })
}

module.exports = authenticate;