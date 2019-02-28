// auth/router.js

'use strict'
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

// Create JWT
const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  })
}

// create localAuth variable
const localAuth = passport.authenticate('local', {session: false});
router.use(bodyParser.json());

// user provides username/pw to login
// Then JWT is created
// Token is sent back to user, who stores it, uses it for other requests
router.post('/login', localAuth, (req, res) => {
  console.log('when in doubt print something out')
  const authToken = createAuthToken(req.user.serialize());
  res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

module.exports = {router};