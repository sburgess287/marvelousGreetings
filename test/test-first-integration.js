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

describe('Card API resource', function() {
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

  // Test GET endpoint
  describe('GET endpoint', function(){
    it('should return all existing cards', function() {
      // strategy get all cards
      // verify status and data type
      // prove number cards is equal to number in db
      let res;
      return chai.request(app)
        .get('/cards')
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body).to.have.lengthOf.at.least(1);
          return Card.count();
      })
      .then(function(count) {
        expect(res.body).to.have.lengthOf(count);
      });
    });

    it('should return cards with correct fields', function() {
      
      // Inspect response for correct keys
      let resCard;
      return chai.request(app)
        .get('/cards')
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.lengthOf.at.least(1);

          res.body.forEach(function(card) {
            expect(card).to.be.a('object');
            expect(card).to.include.keys(
              'id', 'headline', 'bodyText', 'character');
          })

          // set resCard to 1st card in array
          resCard = res.body[0];
          // console.log(resCard);
          return Card.findById(resCard.id);
        })
        // verify the id of the response is same as 1st in database
        .then(function(card) {
          //console.log(resCard.headline);
          //console.log(card.headline);
          expect(resCard.id).to.equal(card.id);
          expect(resCard.headline).to.equal(card.headline);
          expect(resCard.bodyText).to.equal(card.bodyText);
          expect(resCard.character).to.equal(card.character);
        })
    })
  })

  // Test POST endpoint
  describe('POST endpoint', function() {
    // Make a POST request with data
    // prove the response object has correct keys
    // verify ID is returned as well

    it('should add a new Card', function() {
      const newCard = {
        headline: faker.lorem.words(),
        bodyText: faker.lorem.text(),
        character: faker.lorem.text(),
      }

      return chai.request(app)
        .post('/cards')
        .send(newCard)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'id', 'headline', 'bodyText', 'character');
          expect(res.body.headline).to.equal(newCard.headline);
          expect(res.body.bodyText).to.equal(newCard.bodyText);
          expect(res.body.character).to.equal(newCard.character);
        })
    })
  })

})