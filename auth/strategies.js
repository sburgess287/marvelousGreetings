// Authentication strategies
'use strict'

const { Strategy: LocalStrategy } = require('passport-local');

const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { User } = require('../users/models');
const { JWT_SECRET } = require('../config');

// create Local strategy
const localStrategy = new LocalStrategy(function(username, password, callback) {
  let user;
  User.findOne({ username: username })
    .then(_user => {
      user = _user; 
      if (!user) {
        // return rejected promise to be handled in catch block
        return Promise.reject({
          reason: 'LoginError', 
          message: 'Incorrect username or password'
        })
      }
      // valid password
      return user.validatePassword(password)
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        })
      }
      // pass in user assigned to req in req.user
      return callback(null, user)
    })
    .catch(err => {
      if (err.reason === "LoginError") {
        return callback(null, false, err)
      }
      return callback(err, false)
    })
})


// JWT strategy
const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    algorithms: ['HS256']
  },
  function(payload, callback) {
    callback(null, payload.user);
  }
)

module.exports = { localStrategy, jwtStrategy };