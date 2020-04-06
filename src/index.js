"use strict";
const mongoose = require("mongoose");
const app = require("./app");
const DB = "c-137";

mongoose.Promise = global.Promise;
mongoose
  .connect(`mongodb://localhost:27017/${DB}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Se encuentra conectado a la base de datos");

    app.set("port", process.env.PORT || 3000);
    app.listen(app.get("port"), () => {
      console.log(`the app is runing on port ${app.get("port")}`);
    });
  })
  .catch(err => console.log(err));
