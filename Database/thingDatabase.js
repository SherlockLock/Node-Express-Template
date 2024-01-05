/*  THING DATABASE
* 
*   This file acts as a makeshift database for our application to perform CRUD operations on our Thing resources
*
*   Author : Isaac Lock
*/

/*----- INITIALIZATION & DEPENDENCIES -
* Section for all dependencies this file needs to have initialized in order to work as intended.
*/
const Thing = require('../models/thing');

/*----- GLOBAL VARIABLES --------------
* Section for any variables or constants that might be used throughout the routes present in this file.
*/

//A counter to use for ID's of new things that can be created
let idCounter = 4;

//Our "Database" that will hold all of our things. We will populate it with some things to start with
let things = [
    new Thing(1, "foo", "A foo thing"),
    new Thing(2, "bar", "A bar thing"),
    new Thing(3, "foo", "A foo thing")
];

/*----- PRIVATE FUNCTIONS -------------
* Section for all private functions that are only available in this module.
*/

/* Function that generates a "unique ID" by returning the current count of 
* the variabel idCounter and then incrementing it by one.
*/
function uid() {
    return idCounter++;
}

/*----- PUBLIC FUNCTIONS --------------
* Section for aLL public functions this module will export for use in other areas of the application.
*/

/* Returns a list of all the things in our "database".
*/
function getAll(next) {
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

/* Returns a thing requested based on its ID
*/
function get(id, next) {
    //Do work to get thing
    let thing = things.find(thing => thing._id == id)

    //Determine request status for the operation and proceed to next step
    if (thing !== undefined) {
        next(200, thing);
    }
    else {
        next(404, null);
    }

}

/*  Validates the thing we want to save and then inserts it into our "database"
*
*/
function save(type, description, next) {

    //Do work to save thing

    //Create a new thing
    let newThing = new Thing(
        uid(),
        type,
        description
    );

    //Validate the object
    if (!newThing.isValid()) {
        next(400, null);
    }

    //Insert the object into our "database"
    things.push(newThing);

    //Determine if save was successful and proceed to next step
    if (things.includes(newThing)) {
        next(201, newThing);
    }
    else {
        next(500, null);
    }
}

/* Updates a thing in our "database" by first verifying that the thing with the id exists and then replacing the thing
* in our list with our updated Thing
*/
function update(id, type, description, next) {

    // Do work to update the thing

    //Create the updated thing
    let updatedThing = new Thing(
        Number(id),
        type,
        description
    );

    //Validate the object
    if (!updatedThing.isValid()) {
        next(400, null);
    }


    //For this implementation we will find the index of the thing we want to update and make decisions from there
    const index = things.findIndex(thing => thing._id === updatedThing._id);

    //Resource could not be found, so return a 404
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

/* Deletes a thing from our "database" by first verifying that the thing with the id exists and then splicing the area
* around the thing in our list.
*/
function remove(id, next) {

    // Do work to delete the thing

    //For this implementation we will find the index of the thing we want to delete and make decisions from there
    const index = things.findIndex(thing => thing._id == id);
    
    //If our index is -1 then the id of the resource we wanted to delete was not found, so we must return a 404
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

/*----- EXPORTS -----------------------
* Exports the functions used to interact with this database
*/
module.exports = {
    getAll,
    get,
    save,
    update,
    remove
}