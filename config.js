"use strict"

exports.DATABASE_URL = 
  process.env.DATABASE_URL || "mongodb://localhost/marvelousgreetings"
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://localhost/test-marvelousgreetings";
exports.PORT = process.env.PORT || 8080;