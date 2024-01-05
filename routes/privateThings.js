/*  PRIVATE ROUTES
* 
*   This file contains all of the routes related to a specific resource the server has control over. 
*
*   For this particular example, we will be working with a made up object called a "thing". This template will
*   showcase how a server could handle a variety of basic requests a client might make regarding our ficticous 
*   object. 
*
*   The only difference between privateThings and publicThings is that the former includes a middleware that
*   validates the JWT token the request sent to check if the user has logged in and authenticated with the server.
*   This means that any request made to the server for these resources must include a JWT token that the server provided.
*
*   Author : Isaac Lock
*/

/*----- INITIALIZATION & DEPENDENCIES -
* Section for all dependencies this file needs to have initialized in order to work as intended.
*/

const express = require('express');
const router = express.Router();

const privateThingDB = require('../Database/thingDatabase');
const authenticate = require('../services/authenticate');

/*----- GLOBAL VARIABLES --------------
* Section for any variables or constants that might be used throughout the routes present in this file.
*/

/*----- PRIVATE FUNCTIONS -------------
* Section for any functions that might be used within the routes present in this file.
*/

/*----- MIDDELWARE --------------------
* Section for all of middleware routes.
*/

router.all('/privateThings', authenticate, function(req, res, next) { next(); });

/* Simple Middleware for all routes to /privateThings/:id that verify
* any request made with an id parameter is a number
*/
router.all('/privateThings/:id', function(req, res, next) {
    if (isNaN(req.params.id)) {
        res.status(400).json({msg: "Invalid ID for private thing"});
    }
    else {
        next();
    }
});

/*----- ROUTES ------------------------
* Section for all of the routes that are related to requests a client would make regarding our things
*/

/* Generic GET
*   Parameters:     None
*   Body:           None
*   Headers:        None
*
*/
router.get('/privateThings', function(req, res, next) {

    //Retrieve our things from somewhere and then return them when we have them
    //The following will be a common pattern you will see and use throughout this file. 

    //Depending on the datastructure/database you are using, performing CRUD operations might take time
    // and have the potential for failing. It is imperative that you not only account for this, but respond 
    // accordingly to maintain a RESTful architecture. 

    //One effective way of handling this is the use of a completion function that is built into
    // the Javascript language. The following is an example of how this would look in practice. 

    privateThingDB.getAll((status, things) => {
        if (status == 200) {
            res.status(200).json({msg: "Successful GET for things", things: things})
        }
        else {
            res.status(500).json({msg: "Failed to GET things"})
        }
    });


});

/* Generic GET of specific thing by it's ID
*   Parameters:     
*       - id                : String    | id of the thing requested
*   Body:       None
*   Headers:    None
*
*/
router.get('/privateThings/:id', function(req, res, next) {
    privateThingDB.get(req.params.id, (status, thing) => {
        if (status == 200) {
            res.status(200).json({msg: "Successful GET for thing with id " + req.params.id, thing: thing})
        }
        else if (status == 404) {
            res.status(404).json({msg: "Failed to GET thing with id " + req.params.id})
        }
        else {
            res.status(500).json({msg: "Failed to GET thing"});
        }
    });
});

/* Generic POST
*   Parameters:     None
*   Body:       
*       - type                 : String    | type of Thing
*       - description          : String    | description of Thing
*   Headers:    None
*
*/
router.post('/privateThings', function(req, res, next) {

    //Save thing
    privateThingDB.save(req.body.type, req.body.description, (status, savedThing) => {

        if (status == 201) {
            //Send Successful Response
            res.status(201).json({msg: "Successfully POSTed thing", thing: savedThing})
        }
        else if (status == 400) {
            //New resource was not valid
            res.status(400).json({msg: "Failed to POST thing because it was not valid"})
        }
        else {
            //Send Failure Response
            res.status(500).json({msg: "Failed to POST thing"})
        }

    });

});

/* Generic PUT
*   Parameters:     
*       - id                   : String/Number      | id of the thing to update
*   Body:      
*       - type                 : String             | type of the thing
*       - description          : String             | description of thing
*   Headers:    None
*
*/
router.put('/privateThings/:id', function(req, res, next) {

    privateThingDB.update(req.params.id, req.body.type, req.body.description, (status, updatedThing) => {

        //If the update was successful
        if (status == 200) {
            //Inform the client that the server has successfully updated the thing and send them the new version
            res.status(200).json({ msg: "Successfully PUT thing", thing: updatedThing})
        }
        else if (status == 404) {
            res.status(404).json({msg: "Resource does not exist"});
        }
        else if (status == 400) {
            res.status(400).json({msg: "Failed to PUT thing because it was not valids"});
        }
        else { //the update failed and the object will not change its state
            //Inform the client that this PUT has failed
            res.status(500).json({msg: "Failed to PUT thing for some reason"});
        }
    });

});

/* Generic DELETE
*   Parameters: 
*       - id                : String    | id of the thing to be deleted
*   Body: None
*   Headers: None
*
*/
router.delete('/privateThings/:id', function(req, res, next) {
    privateThingDB.remove(req.params.id, (status, deletedThing) => {
        if (status == 200) {
            res.status(200).json({msg: "Successfully DELETEd thing", deletedThing: deletedThing})
        }
        else if (status == 404) {
            //Inform the client that this DELETE has failed
            res.status(404).json({msg: "Resource does not exist"})
        }
        else {
            //Inform the client that this DELETE has failed
            res.status(500).json({msg: "Failed to DELETE thing for some reason"})
        }
    })
});

/*----- EXPORTS -----------------------
* Exports this router file enabling it to be used in the main server.js file
*/
module.exports = router;