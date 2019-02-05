'use strict'; 

const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());

// add routers here: ie const cardRouter = require("./cards/router.js")

app.use(express.static('public'));
app.use(morgan('common'));

app.get('/', (req, res) => {
  res.sendFile('/index.html');
})

app.use('/cards', cardsRouter);



// let server; 

// function runServer() {
//   const port = process.env.PORT || 8080;
//   return new Promise((resolve, reject) => {
//     server = app 
//       .listen(port, () => {
//         console.log(`Your app is listening on port ${port}`);
//         resolve(server);
//       })
//       .on("error", err => {
//         reject(err);
//       });
//   });
// }

// function closeServer() {
//   return new Promise((resolve, reject) => {
//     console.log('Closing server');
//     server.close(err => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve();
//     });
//   });
// }

if (require.main === module) {
  app.listen(process.env.PORT || 8080, function() {
    console.info(`App listening on ${this.address().port}`);
  });
  //runServer().catch(err => console.error(err));
}

// module.exports = { app, runServer, closeServer };
module.exports = { app };