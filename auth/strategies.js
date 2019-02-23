// auth/strategies.js
'use strict'

const { Strategy: LocalStrategy } = require('passport-local');

const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const { User } = require('../users/models');
const { JWT_SECRET } = require('../config');

// error says local strategy is not defined

module.exports = { localStrategy, jwtStrategy };