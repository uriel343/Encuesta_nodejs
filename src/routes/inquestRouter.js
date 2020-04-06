"use strict";
const express = require("express");
const InquestController = require("../controllers/inquestController");
const md_auth = require("../middlewares/authenticated");

const api = express.Router();

api.post("/addInquest", md_auth.ensureAuth, InquestController.addInquest);
api.put('/opinion/:id', md_auth.ensureAuth, InquestController.finalUserOpinion);
api.put('/comment/:id',md_auth.ensureAuth, InquestController.commentInquest);
api.put('/commentUpdate/:inquestId/:commentId', md_auth.ensureAuth, InquestController.updateComment)
api.delete('/commentDelete/:commentId', md_auth.ensureAuth, InquestController.deleteComment)


module.exports = api;