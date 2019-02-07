'use strict'; 

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const app = express();
app.use(express.json());

const { PORT, DATABASE_URL } = require('./config');
const { Card } = require('./models');

app.use(express.static('public'));
app.use(morgan('common'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
})


// GET endpoint for cards
app.get("/cards", (req, res) => {
  console.log("hello 1st line of get endpoint");
  Card
    .find()
    .then(cards => {
      console.log("got past cards.find line of get endpoint: does not get here");
      res.json(cards.map(card => card.serialize()))
    // res.json(cards.map(card => {
    //   return {
    //     id: req.body.id,
    //     headline: req.body.headline,
    //     bodyText: req.body.bodyText,
    //     character: req.body.character
    //   }
    // }))
  })
    .catch(err => {
      console.err(err);
      res.status(500).json({ error: 'something went wrong'});
    })
})

// experiment, remove later
// app.get('/cards', (req, res) => {
//   res.send("hello");
// })

// POST endpoint for cards
app.post('/cards', (req, res) => {
  const requiredFields = ["headline", "bodyText", "character"]
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing ${field} in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  console.log('past required fields');
  Card
    .create({
      headline: req.body.headline,
      bodyText: req.body.bodyText, 
      character: req.body.character
    })
    .then(card => res.status(201).json(card.serialize()))
// .then(card => res.status(201))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: `Internal Server Error`});
    })
})

// catch all endpoint if client makes request to non-existent endpoint
app.use("*", function(req, res){
  res.status(404).json({ message: "Hello Sarah, happy to see you! Also, Not found"})
})

let server; 

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app 
      .listen(port, () => {
        console.log(`Your app is listening on port ${port} WOO`);
        resolve(server);
      })
      .on("error", err => {
        reject(err);
      });
  });
}

function closeServer() {
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
}

if (require.main === module) {
  // app.listen(process.env.PORT || 8080, function() {
  //   console.info(`App listening on ${this.address().port}`);
  // });
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
// module.exports = { app };