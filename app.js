// This Node app serves two purposes:
// 1. Provide front end users with up to date access tokens.
// 2. Deliver the front end of our app (via /public/ folder)

// Libraries
// To install, use "npm install" from the command line
const express = require ('express');  // web app framework
const fetch = require('node-fetch');  // library for making requests
const ip = require("ip");             // ip address tools for node
const dotenv = require('dotenv').config()

// Trefle Secret Authentication Token
// https://trefle.io/reference#section/Authentication
const token = process.env.TREFLE_TOKEN;

// any available / unused port number will do fine
const port = 7000;


// Trefle requires us to generate a front-end token specific to this address.
const userTokenUrl = 'https://trefle.io/api/auth/claim?token='+token+'&origin='+address;

// Express Setup
const app	= express();
app.use( express.json() );

// Enables node to serve up files inside of /public/ folder
// this includes static files (index.html, images, CSS, etc.)
app.use('/PlantFinder', express.static('public') );

// when the user requests a front-end token,
// fetch one from Trefle and return it
app.get('/PlantFinder/token', (req, res) => {

  fetch(
    'https://trefle.io/api/auth/claim', {
      method: 'post',
      body: JSON.stringify({
        origin: 'https://'+ip.address()+'/PlantFinder',
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        token: process.env.TREFLE_TOKEN
      }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(result =>  res.send(  result ) )
    .catch(error => console.log('error', error))

})

//Go live
app.listen(port, () => {
  console.log("We are live on " + port);
});
