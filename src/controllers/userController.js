"use strict";
//Imports
const bcrypt = require("bcrypt-nodejs");
const User = require("../models/user");
const jwt = require("../services/jwt");
const path = require("path");
const fs = require("fs");

function exampleToken(req, res) {
  res.status(200).send({
    message: "HOLAAAAA!"
  });
}

function register(req, res) {
  let users = new User();
  let params = req.body;

  if (params.name && params.user && params.password) {
    users.name = params.name;
    users.user = params.user;
    users.email = params.email;
    users.rol = "ROLE_USER";
    users.image = null;
    User.find({ $or: [{ user: users.user }, { email: users.email }] }).exec(
      (err, usersExisting) => {
        if (err)
          return res.status(500).send({
            message: "Error in the User Request "
          });

        if (usersExisting && usersExisting.length >= 1) {
          return res.status(500).send({
            message: "This user already exist"
          });
        } else {
          bcrypt.hash(params.password, null, null, (err, hash) => {
            users.password = hash;
            users.save((err, userSave) => {
              if (err)
                return res.status(500).send({
                  message: "The process to save this user fails"
                });
              if (userSave) {
                res.status(200).send({
                  user: userSave
                });
              } else {
                res.status(404).send({
                  message: "The user cannot register"
                });
              }
            });
          });
        }
      }
    );
  } else {
    res.status(200).send({
      message: "Fill in the blanks"
    });
  }
}

function login(req, res) {
  let params = req.body;

  User.findOne({ email: params.email }, (err, user) => {
    if (err) {
      return res.status(500).send({
        message: "Request Error"
      });
    }
    if (user) {
      bcrypt.compare(params.password, user.password, (err, check) => {
        if (check) {
          //Parametro temporal que no afectara al Modelo Usuario
          if (params.getToken) {
            return res.status(200).send({
              token: jwt.createToken(user)
            });
          } else {
            user.password = undefined;
            return res.status(200).send({
              user
            });
          }
        } else {
          return res.status(404).send({
            message: "User not logged"
          });
        }
      });
    } else {
      return res.status(404).send({
        message: "User not logged"
      });
    }
  });
}

function editUser(req, res) {
  let userId = req.params.id; //esto es para la URL
  let params = req.body;

  delete params.password;
  if (userId !== req.user.sub) {
    return res.status(500).send({
      message: "You don't have anny permission to edit this user"
    });
  }

  User.findByIdAndUpdate(
    userId,
    params,
    { new: true },
    (err, userDataUpdated) => {
      if (err) return res.status(500).send({ message: "Error of request" });
      if (!userDataUpdated)
        return res
          .status(404)
          .send({ message: "Cannot Update the data of the User" });

      return res.status(200).send({ user: userDataUpdated });
    }
  );
}

function getUserById(req, res) {
  let userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) return res.status(404).send({ message: "The user doesn't find" });
    if (!user) return res.status(404).send({ message: "Query error" });
    return res.status(200).send({ user });
  });
}

function getUsers(req, res) {
  User.find({}, { password: 0 }, (err, user) => {
    if (err) return res.status(404).send({ message: "Users don't exist" });
    if (!user) return res.status(404).send({ message: "Query error" });
    return res.status(200).send({ object: user });
  });
}

function deleteUser(req, res) {
  let userId = req.params.id;

  if (userId !== req.user.sub) {
    return res.status(500).send({
      message: "You don't have anny permission to delete this user"
    });
  }

  User.findByIdAndDelete(userId, (err, userDeleted) => {
    if (err)
      return res.status(404).send({ message: "This User doesn't exist" });
    if (!userDeleted)
      return res
        .status(404)
        .send({ message: "User not found, please make sure about the user " });
    return res.status(200).send({ message: userDeleted });
  });
}

function uploadImageUser(req, res) {
  let userId = req.params.id;

  if (userId !== req.user.sub) {
    return res.status(500).send({
      message: "You don't have anny permission to delete this user"
    });
  }

  if (req.files) {
    let file_path = req.files.imageURL.path;
    console.log(file_path);
    let file_split = file_path.split("\\");
    console.log(file_split);

    //Para obtener el nombre del archivo
    let file_name = file_split[3];
    console.log(file_name);

    //elimina el punto de extension de archivo
    let ext_split = file_name.split(".");
    console.log(ext_split);

    //[nombre, png] Obtener extension
    let file_ext = ext_split[1];

    let file_ext_lower = file_ext.toLowerCase();
    console.log(file_ext_lower);

    if (
      file_ext_lower === "png" ||
      file_ext_lower === "jpg" ||
      file_ext_lower === "jpeg" ||
      file_ext_lower === "gif"
    ) {
      User.findByIdAndUpdate(
        userId,
        { imageURL: file_name },
        { new: true },
        (err, userUpdated) => {
          if (err)
            return res.status(500).send({
              message: "Error to upload file"
            });
          if (!userUpdated) {
            return res.status(404).send({
              message: "User not found, please check the id"
            });
          }
          return res.status(200).send({
            userImage: userUpdated
          });
        }
      );
    } else {
      return denegateExtension(
        res,
        file_path,
        "This extension isn't valid, please try again"
      );
    }
  }
}

function denegateExtension(res, file_path, message) {
  fs.unlink(file_path, err => {
    return res.status(200).send({ message: message });
  });
}

function obtainImage(req,res){
  let imageName = req.params.image;
  var file_path = `./src/uploads/users/${imageName}`
  fs.exists(file_path, (exists)=>{
    if (exists) {
      res.sendFile(path.resolve(file_path))
    }else{
      res.status(404).send({message: 'The image doesnt exist'})
    }
  }) 
}



module.exports = {
  register,
  login,
  exampleToken,
  editUser,
  getUsers,
  getUserById,
  deleteUser,
  uploadImageUser,
  obtainImage
};
