"use strict"; //para que use ES6

//VARIABLES
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

//Loading Routes
const user_routes = require("./routes/userRoutes");
const inquest_routes = require('./routes/inquestRouter')

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//HTTP Headers
app.use((req, res, next) => {
  res.header("Acces-Control-Allow-Origin", "*");
  res.header(
    "Acces-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Acces-Control-Allow-Request-Method"
  );
  res.header("Acces-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");

  next();
});

//Routes
app.use('/api', user_routes, inquest_routes)

module.exports = app;
