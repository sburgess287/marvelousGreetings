"use strict"

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// import User schema to be associate with the card
const { User } = require("../users");


// Schema for cards
const cardSchema = mongoose.Schema({
    headline: { type: String, required: true},
    bodyText: { type: String, required: true},
    character: { type: String, required: true}, 
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    // character_id: { type: String } // remove if not needed for modularizing

})

// Card instance method to create card object to return
cardSchema.methods.serialize = function() {
    return {
        id: this._id,
        headline: this.headline, 
        bodyText: this.bodyText, 
        character: this.character,
        user_id: this.user_id,
        // character_id: this.character_id, remove if not needed for modularizing
    }
}

const Card = mongoose.model("card", cardSchema);
  
module.exports = { Card };