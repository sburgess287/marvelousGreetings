'use strict'; 

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const app = express();
app.use(express.json());

const { PORT, DATABASE_URL } = require('./config');
const { Card } = require('./cards/models');

app.use(express.static('public'));
app.use(morgan('common'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
})


// GET endpoint for all cards
app.get("/cards", (req, res) => {
  console.log("hello 1st line of get endpoint");
  Card
    .find()
    .then(cards => {
      console.log("got past cards.find line of get endpoint");
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

// remove later
// app.get('/cards', (req, res) => {
//   res.send("hello");
// })

// GET endpoint for retrieving specific card by id
app.get('/cards/:id', (req, res) => {
  console.log("get cards by id endpoint ran");
  Card 
    .findById(req.params.id)
    .then(card => res.json(card.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: '500 server error' });
    })
})


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
  Card
    .create({
      headline: req.body.headline,
      bodyText: req.body.bodyText, 
      character: req.body.character
    })
    .then(card => res.status(201).json(card.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: `Internal Server Error`});
    })
})

// DELETE endpoint for deleting specific card
app.delete('/cards/:id', (req, res) => {
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
app.put('/cards/:id', (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: `Request path id and request body id values must match req.params.id: ${req.params.id}, req.body.id: ${req.body.id}`
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
  // app.listen(process.env.PORT || 8080, function() {
  //   console.info(`App listening on ${this.address().port}`);
  // });
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
// module.exports = { app };