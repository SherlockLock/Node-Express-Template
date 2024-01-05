/*  AUTHENTICATION SERVICE
* 
*   Function used to verify JWT token to see if the user is authenticated
*
*   Author : Isaac Lock
*/

const User = require('../../models/Users/User');
const jwt = require('jsonwebtoken');

async function authenticateUserToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) {
        return res.sendStatus(401);
    } 
  
    jwt.verify(token, process.env.LOGIN_SECRET, async (err, tokenUser) => {
  
      if (err) {
        return res.sendStatus(403);
      } 
      else {

        if (!tokenUser.user) {
            return res.sendStatus(403);
        }
        
        User.findById(tokenUser.user._id, function(err, user) {

            if (err) {
                res.sendStatus(403);
            }
            else {
        
                if (user.status == 'active') {
                    next();
                }
                else {
                    res.sendStatus(403);
                }
            }

        });

      }
  
    })
}

module.exports = authenticateUserToken;