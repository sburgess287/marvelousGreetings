// users/models.js

'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// create use model to export and use in the authentication strategy

module.exports = {User};