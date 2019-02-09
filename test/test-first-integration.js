'use strict'

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const {app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { Card } = require('../cards/models');

const expect = chai.expect;

chai.use(chaiHttp);

// Seed the database using the Faker Library
function seedCardData(){
  console.info('seeding card data');
  const seedData = [];
  for (let i=1; i<=5; i++){
    seedData.push(generateCardData());
  }
  return Card.insertMany(seedData);
}

// Generate object representing a Card
function generateCardData(){
  return {
    headline: faker.lorem.words(),
    bodyText: faker.lorem.text(),
    character: faker.lorem.text()
  }
}

// Delete the database/Teardown
function tearDownDb(){
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('First Example test', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  })

  beforeEach(function(){
    return seedCardData();
  })

  afterEach(function() {
    return tearDownDb();
  })

  after(function() {
    return closeServer();
  })

  it('page exists', function() {
    return chai
      .request(app)
      .get('/')
      .then(function(res) {
        expect(res).to.have.status(200);
    })
  })


})