'use strict'; 
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

// Use destructuring assignment so two variables called router have diff names
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth')

mongoose.Promise = global.Promise;

const app = express();
app.use(express.json());

const { PORT, DATABASE_URL } = require('./config');
const { Card } = require('./cards/models');
const { User } = require('./users/models')

app.use(express.static('public'));
app.use(morgan('common'));

// Serve static file
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
})

// Authentication
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/users/', usersRouter);
app.use('/auth/', authRouter);

// Declare jwtAuth to authenticate
const jwtAuth = passport.authenticate('jwt', { session: false });

// GET endpoint for all cards by that User
app.get("/cards", jwtAuth, (req, res) => {
  Card
    .find()
    .where("user_id", req.user.id)
    .then(cards => {
      res.json(cards.map(card => card.serialize()))
  })
    .catch(err => {
      console.err(err);
      res.status(500).json({ error: 'something went wrong'});
    })
})


// GET endpoint for retrieving specific card by id
app.get('/cards/:id', jwtAuth, (req, res) => {
  Card 
    .findById(req.params.id)
    .then(card => res.json(card.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: '500 server error' });
    })
})


// POST endpoint for cards
app.post('/cards', jwtAuth, (req, res) => {
  const requiredFields = ["headline", "bodyText", "character"]
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
 
  Card
    .create({
      headline: req.body.headline,
      bodyText: req.body.bodyText, 
      character: req.body.character,
      user_id: req.user.id // getting from Bearer token
    })
    .then(card => res.status(201).json(card.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: `Internal Server Error`});
    })
})

// DELETE endpoint for deleting specific card
app.delete('/cards/:id', jwtAuth, (req, res) => {
  Card
    .findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'success'});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: '500 server error' });
    })
})

// PUT endpoint for editing specific card
app.put('/cards/:id', jwtAuth, (req, res) => {
  // remove the req.body.id and verify test
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: `Request path id and request body id values must match`
    })
  }
  const updated = {};
  const updateableFields = ['headline', 'bodyText', 'character'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field]
    }
  })

  Card
    .findByIdAndUpdate(req.params.id, { $set: updated}, { new: true })
    .then(updatedCard => res.status(204).end())
    .catch(err => res.status(500).json({ message: '500 server error' }));
});

// catch all endpoint if client makes request to non-existent endpoint
app.use("*", function(req, res){
  res.status(404).json({ message: "Page not found"})
})

let server; 

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app 
        .listen(port, () => {
          console.log(`Your app is listening on port ${port} WOO`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    })
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  })
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };