/*  ROUTES
* 
*   This file contains all of the routes related to a specific resource the server has control over. 
*
*   For this particular example, we will be working with a made up object called a "thing". This template will
*   showcase how a server could handle a variety of basic requests a client might make regarding our ficticous 
*   object. 
*
*   Author : Isaac Lock
*/

/*----- INITIALIZATION & DEPENDENCIES -
* Section for all dependencies this file needs to have initialized in order to work as intended.
*/

const express = require('express');
const router = express.Router();

const Thing = require('../models/thing');

/*----- GLOBAL VARIABLES --------------
* Section for any variables or constants that might be used throughout the routes present in this file.
*/

let idCounter = 4;

//Our "Database" that will hold all of our things. We will populate it with some things to start with
let things = [
    new Thing(1, "foo", "A public foo thing"),
    new Thing(2, "bar", "A public bar thing"),
    new Thing(3, "foo", "A public foo thing")
];

/*----- FUNCTIONS ---------------------
* Section for any functions that might be used within the routes present in this file.
*/

function getAllThings(next) {
    //Do work to get your things
    let allThings = things;

    //Determine request status for the operation and proceed to next step
    if (allThings === things) {
        next(200, allThings);
    }
    else {
        next(500, null);
    }

}

function getThing(id, next) {
    //Do work to get thing
    let thing = things.find(thing => thing._id == id)

    //Determine request status for the operation and proceed to next step
    if (thing !== undefined) {
        next(200, thing);
    }
    else {
        next(500, null);
    }

}

function saveThing(newThing, next) {
    //Do work to save thing
    things.push(newThing);

    //Determine if save was successful and proceed to next step
    if (things.includes(newThing)) {
        next(201, newThing);
    }
    else {
        next(500, null);
    }
}

function updateThing(updatedThing, next) {

    // Do work to update the thing

    //For this implementation we will find the index of the thing we want to update and make decisions from there
    const index = things.findIndex(thing => thing._id === updatedThing._id);

    //Resource could not be found
    if (index === -1) {
        next(404, null);
    }
    else { //Resource found

        //Our Update Logic after we verified the resource exists
        things[index] = updatedThing;

        if (things.includes(updatedThing)) {
            next(200, updatedThing);
        }
        else {
            next(500, null);
        }

    }

}

function deleteThing(id, next) {

    // Do work to delete the thing

    //For this implementation we will find the index of the thing we want to delete and make decisions from there
    const index = things.findIndex(thing => thing._id == id);
    
    if (index === -1) {
        next(404, null);
    } else {

        //Our delete logic after we have verified the resource exists
        let deletedThing = things[index];
        things.splice(index, 1);

        // Determine if work was successful
        if (!things.includes(deletedThing)) {
            next(200, deletedThing);
        }
        else {
            next(500, null);
        }

    }

}

/* Function that generates a "unique ID" by returning the current count of 
* the variabel idCounter and then incrementing it by one.
*/
function uid() {
    return idCounter++;
}

/*----- MIDDELWARE --------------------
* Section for all of middleware routes.
*/

/* Simple Middleware for all routes to /publicThings/:id that verify
* any request made with an id parameter is a number
*/
router.all('/publicThings/:id', function(req, res, next) {
    if (isNaN(req.params.id)) {
        res.status(400).json({msg: "Invalid ID for public thing"});
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
router.get('/publicThings', function(req, res, next) {

    //Retrieve our things from somewhere and then return them when we have them
    //The following will be a common pattern you will see and use throughout this file. 

    //Depending on the datastructure/database you are using, performing CRUD operations might take time
    // and have the potential for failing. It is imperative that you not only account for this, but respond 
    // accordingly to maintain a RESTful architecture. 

    //One effective way of handling this is the use of a completion function that is built into
    // the Javascript language. The following is an example of how this would look in practice. 

    getAllThings((status, things) => {
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
router.get('/publicThings/:id', function(req, res, next) {
    getThing(req.params.id, (status, thing) => {
        if (status == 200) {
            res.status(200).json({msg: "Successful GET for thing with id " + req.params.id, thing: thing})
        }
        else {
            res.status(404).json({msg: "Failed to GET thing with id " + req.params.id})
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
router.post('/publicThings', function(req, res, next) {

    //Create the object that you will be saving
    let newThing = new Thing(
        uid(),
        req.body.type,
        req.body.description
    );

    //Validate Thing
    if (newThing.isValid()) {

        //Save thing
        saveThing(newThing, (status, savedThing) => {

            if (status == 201) {
                //Send Successful Response
                res.status(201).json({msg: "Successfully POSTed thing", thing: savedThing})
            }
            else {
                //Send Failure Response
                res.status(500).json({msg: "Failed to POST thing"})
            }

        });

        
    }
    else {
        //Validation failure, send failed response
        res.status(400).json({msg: "Failed to POST thing because it is not valid"})
    }

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
router.put('/publicThings/:id', function(req, res, next) {


    let updatedThing = new Thing(
        Number(req.params.id),
        req.body.type,
        req.body.description
    );

    //Validate the thing
    if (updatedThing.isValid()) {

        updateThing(updatedThing, (status, updatedThing) => {
            //If the update was successful
            if (status == 200) {
                //Inform the client that the server has successfully updated the thing and send them the new version
                res.status(200).json({ msg: "Successfully PUT thing", thing: updatedThing})
            }
            else if (err == 404) {
                res.status(404).json({msg: "Resource does not exist"});
            }
            else { //the update failed and the object will not change its state
                //Inform the client that this PUT has failed
                res.status(500).json({msg: "Failed to PUT thing for some reason"})
            }
        });
        
    }
    else {
        //Validation failure, send failed response
        res.status(400).json({msg: "Failed to PUT thing"})
    }

});

/* Generic DELETE
*   Parameters: 
*       - id                : String    | id of the thing to be deleted
*   Body: None
*   Headers: None
*
*/
router.delete('/publicThings/:id', function(req, res, next) {
    deleteThing(req.params.id, (status, deletedThing) => {
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