'use strict'; 

const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());

const { PORT, DATABASE_URL } = require('./config');
const { Cards } = require('./models.js');

app.use(express.static('public'));
app.use(morgan('common'));

// Tried to create test data but this failed; skip and go to db modeling
// Cards.create("Hello", "This is BodyText", "Wolverine");


app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
})

// GET endpoint for cards
// When I hit this endpoint in postman, says undefined, I will come back to this
// app.get("/cards", (req, res) => {
//   res.json(Cards.get());
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
  return Cards.create({
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


let server; 

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app 
      .listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
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