"use strict"

exports.DATABASE_URL = 
  process.env.DATABASE_URL || "mongodb://localhost/cardTestDb";
  // process.env.DATABASE_URL || "mongodb://localhost/marvelousgreetings-app"; ??
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://localhost/test-marvelousgreetings-app";
exports.PORT = process.env.PORT || 8080;