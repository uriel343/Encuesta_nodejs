"use strict";
//Jason web Token
const jwt = require("jwt-simple");
//Time life of the token
const moment = require("moment");
const SECRET = 'CLAVE_SECRETA_IN6BM'

exports.ensureAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({
      message: "The petition fail"
    });
  }
  let token = req.headers.authorization.replace(/['"]+/g, "");
  try {
    var payload = jwt.decode(token, SECRET);
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({
        message: "The Token was expired"
      });
    }
  } catch (ex) {
    return res.status(404).send({
      message: "Invalid Token"
    });
  }

  req.user = payload;
  next();
};
