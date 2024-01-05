class Thing {

    //----- CONSTRUCTOR ---------------
    constructor(id, type, description) {
        this._id = id;
        this._type = type;
        this._description = description;
    }

    //----- GETTERS -------------------
    get type() {
        return this._type;
    }

    get description() {
        return this._description;
    }

    //----- SETTERS -------------------

    set type(type) {
        this._type = type;
    }

    set description(description) {
        this._description = description;
    }

    //----- PUBLIC FUNCTIONS ----------
    isValid() {
        return typeof this._type === 'string' && typeof this._description === 'string';
    }
}

module.exports = Thing;
