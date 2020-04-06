"use strict";
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
//Creating Schema
let userSchema = Schema({
  name: String,
  user: String,
  email: String,
  password: String,
  rol: String,
  imageURL: String
});

module.exports = mongoose.model("user", userSchema);