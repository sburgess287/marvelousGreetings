'use strict'; 

const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());

const { PORT, DATABASE_URL } = require('./config');
const { Cards } = require('./cards/router');

app.use(express.static('public'));
app.use(morgan('common'));

// Tried to create test data but this failed; skip and go to db modeling
// Cards.create("Hello", "This is BodyText", "Wolverine");


app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
})

// When I hit this endpoint in postman, says undefined
app.get("/cards", (req, res) => {
  res.json(Cards.get());
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