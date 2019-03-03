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
    username: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}

})

// Virtual to create prehook to retrieve author of cards
cardSchema.pre('find', function(next) {
    this.populate('user');
    next();
})

// Card instance method to create card object to return
cardSchema.methods.serialize = function() {
    return {
        id: this._id,
        headline: this.headline, 
        bodyText: this.bodyText, 
        character: this.character,
        username: this.username
    }
}

const Card = mongoose.model("card", cardSchema);
  
module.exports = { Card };