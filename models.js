"use strict"

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

// Schema for cards
const cardSchema = mongoose.Schema({
    headline: { type: String, required: true},
    bodyText: { type: String, required: true},
    character: { type: String, required: true} // ?
})