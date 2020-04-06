"use strict";
// iat crea la fecha del token y exp es el tiempo de vida del token
const jwt = require("jwt-simple");
const moment = require("moment");
const SECRET = "CLAVE_SECRETA_IN6BM";

exports.createToken = user => {
  let payload = {
    sub: user._id,
    name: user.name,
    user: user.user,
    email: user.email,
    rol: user.rol,
    imageURL: user.imageURL,
    iat: moment().unix(),
    exp: moment()
      .day(30, "days")
      .unix()
  };

  return jwt.encode(payload, SECRET);
};
