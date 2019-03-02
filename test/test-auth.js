'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');
const { Card } = require('../cards/models');
const { User } = require('../users');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Auth endpoints', function () {
  const username = 'testUser';
  const password = 'testpassword';

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });
  
  beforeEach(function () {
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        password
      })
    )}
  )

  afterEach(function () {
    return User.remove({});
  });

  after(function () {
    return closeServer();
  });

  describe('/auth/login', function () {

    it('should reject requests with no credentials', function() {
      return chai 
        .request(app)
        .post('/auth/login')
        .then((res) => {
          expect(res).to.have.status(400);
        })
    })
    
    it('should reject requests with incorrect username', function () {
      return chai
        .request(app)
        .post('/auth/login')
        .send({ username: 'incorrectUsername', password })
        .then((res) => {
          expect(res).to.have.status(401);
        })
    })

    it('should reject request with incorrect password', function () {
      return chai
        .request(app)
        .post('/auth/login')
        .send({ username, password: 'someWrongPassword' })
        .then((res) => {
          expect(res).to.have.status(401);
        })
    })


  // the end of /auth/login
  })


// the end
})