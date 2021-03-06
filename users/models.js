// Users models

'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// create user schema to export and use in the authentication strategy
const UserSchema = mongoose.Schema({
  username: {
    type: String, 
    required: true, 
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  
});

// return username and id to reference
UserSchema.methods.serialize = function() {
  return {
    username: this.username || '',
    id: this.id
  };
};

// Method returns boolean value if pw is valid
UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password)
}

// Set how many rounds of salting algorithm should be used
UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}

const User = mongoose.model('User', UserSchema);

// export all methods above for use in app
module.exports = {User};