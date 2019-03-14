"use strict"

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Schema for cards
const cardSchema = mongoose.Schema({
    headline: { type: String, required: true},
    bodyText: { type: String, required: true},
    character: { type: String, required: true}, 
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
})

// Card instance method to create card object to return
cardSchema.methods.serialize = function() {
    return {
        id: this._id,
        headline: this.headline, 
        bodyText: this.bodyText, 
        character: this.character,
        user_id: this.user_id,
    }
}

const Card = mongoose.model("card", cardSchema);
  
module.exports = { Card };