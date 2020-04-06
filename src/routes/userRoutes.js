"use strict";

const express = require("express");
const UserController = require("../controllers/userController");
const md_auth = require('../middlewares/authenticated');
const multiparty = require('connect-multiparty')
const md_upload = multiparty({ uploadDir: './src/uploads/users'})

//Routes

const api = express.Router();
api.post("/register", UserController.register);
api.post("/login", UserController.login);
api.get('/ejemplo', md_auth.ensureAuth, UserController.exampleToken);
api.put('/editUser/:id', md_auth.ensureAuth, UserController.editUser);
api.get('/getUsers', md_auth.ensureAuth, UserController.getUsers);
api.get('/findUser/:id', md_auth.ensureAuth, UserController.getUserById)
api.delete('/deleteUser/:id', md_auth.ensureAuth, UserController.deleteUser)
api.post('/uploadImageUser/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImageUser)
api.get('/obtainImage/:image', UserController.obtainImage )

module.exports = api;
