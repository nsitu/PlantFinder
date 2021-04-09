// Libraries
const express = require ('express');  // web app framework
const fetch = require('node-fetch');  // library for making requests
const dotenv = require('dotenv').config()  // makes it easy to work with secret keys stored in  .env

// any available / unused port number will do fine
const port = 7000;

// Express Setup
const app	= express();
app.use( express.json() );

// Enables node to serve up files inside of /public/ folder
// this includes static files (index.html, images, CSS, etc.)
app.use('/PlantFinder', express.static('public') );

app.get('/PlantFinder/token/', (req, res) => {
  // https://docs.trefle.io/docs/advanced/client-side-apps
  let ip = req.headers['x-forwarded-host'];
  fetch( 'https://trefle.io/api/auth/claim', {
      method: 'post',
      body: JSON.stringify({
        origin: 'https://'+ip,
        token: process.env.TREFLE_TOKEN
      }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(result =>  res.send(  result ) )
    .catch(error => console.log('error', error));
});

//Go live
app.listen(port, () => {
  console.log("We are live on " + port);
});
