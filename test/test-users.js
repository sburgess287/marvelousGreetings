'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const { User } = require('../users');

const expect = chai.expect;

chai.use(chaiHttp);

describe('User endpoints', function () {
  const username = 'testUser2';
  const password = 'testpassword2';

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });


  beforeEach(function () { });

  afterEach(function(){
    return User.remove({});
  })

  after(function() {
    return closeServer();
  });

  describe('/users', function() {
    describe('POST', function () {
      it('should reject users missing value for the username', function () {
        return chai
          .request(app)
          .post('/users')
          .send({
            password
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
          })
      })

      it('should reject users missing value for password', function () {
        return chai 
          .request(app)
          .post('/users')
          .send({
            username
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
          })
      })

      it('should reject users with non-string username', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            username: 1234,
            password
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Incorrect field type: expected string');
          })
      })

      it('should reject users with non-string password', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            username, 
            password: 1234
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Incorrect field type: expected string');
          })
      })

      it('should reject users with non-trimmed username', function() {
        return chai 
          .request(app)
          .post('/users')
          .send({
            username: ` ${username}`,
            password
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Cannot start or end with whitespace');
          })
      })

      it('should reject users with non-trimmed password', function() {
        return chai 
          .request(app)
          .post('/users')
          .send({
            username,
            password: ` ${password}`
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Cannot start or end with whitespace');
          })
      })

      it('should reject users with empty username', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            username: '',
            password
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Must be at least 1 characters long')
          })
      })

      it('should reject users with empty password', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password: ''
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Must be at least 10 characters long')
          })
      })

      it('should reject users with password less than 10 characters long', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password: '123456789'
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Must be at least 10 characters long')
          })
      })

      it('should reject users with password more than 72 characters long', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password: new Array(73).fill('a').join('')
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Must be at most 72 characters long')
          })
      })

      it('should reject user with duplicate username', function() {
        return User.create({
          username,
          password
        })
          .then(() => {
            return chai
             .request(app)
             .post('/users')
             .send({ username, password })
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Username already taken')
          })
      })

      it('should create a new user', function() {
        return chai
          .request(app)
          .post('/users')
          .send({ username, password }) 
          .then((res) => {
            expect(res).to.have.status(201);
            console.log(res.body.username)
            expect(res.body.username).to.equal(username);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'username', 'id'
            )

          })
      })
    })
    
  })
})