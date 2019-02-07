"use strict"

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Schema for cards
const cardSchema = mongoose.Schema({
    headline: { type: String, required: true},
    bodyText: { type: String, required: true},
    character: { type: String, required: true}
})


// Card instance method to create card object to return
cardSchema.methods.serialize = function() {
    return {
        id: this._id, 
        headline: this.headline, 
        bodyText: this.bodyText, 
        character: this.character
    }
}

const Card = mongoose.model("card", cardSchema);
  
module.exports = { Card };