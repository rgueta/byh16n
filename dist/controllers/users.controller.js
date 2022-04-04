"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUserById = exports.getUsers = exports.getUserById = exports.getUserByCore = exports.deleteUserById = exports.createUser = exports.RegisterUser = void 0;

var _Users = _interopRequireDefault(require("../models/Users"));

var _mongoose = require("mongoose");

var _express = require("express");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createUser = async (req, res) => {
  console.log('Create rUser -->', req.body);

  try {
    const {
      name,
      email,
      username,
      house,
      uuid,
      sim,
      gender,
      avatar,
      pwd,
      core
    } = await req.body;
    const roles = req.body.roles.map(_mongoose.Types.ObjectId);
    const foundUser = await _Users.default.findOne({
      email: req.body.email
    });

    if (!foundUser) {
      // const newUser = new Users({name,email,username,house,uuid,sim,gender,avatar,pwd,core,roles});
      // const userSaved = await newUser.save();
      res.status(200).send({
        'status': 200,
        'msg': 'User saved'
      });
    } else {
      console.log('User already exists -> ' + JSON.stringify(foundUser));
      res.status(200).send({
        'status': 201,
        'msg': 'User already exists'
      });
    }
  } catch (err) {
    return res.status(200).send({
      'status': 401,
      'msg': err.message
    });
  }
};

exports.createUser = createUser;

const RegisterUser = async (req, res) => {
  console.log('RegisterUser -->', req.body);
};

exports.RegisterUser = RegisterUser;

const getUsers = async (req, res) => {
  const users = await _Users.default.find();
  res.json(users);
};

exports.getUsers = getUsers;

const getUserById = async (req, res) => {
  const user = await _Users.default.findById(req.params.userId);
  console.log(req.params.userId);
  res.status(200).json(user);
};

exports.getUserById = getUserById;

const getUserByCore = async (req, res) => {
  _Users.default.find({
    'core': _mongoose.Types.ObjectId(req.params.coreId)
  }, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      res.status(200).json(result);
    }
  });
};

exports.getUserByCore = getUserByCore;

const updateUserById = async (req, res) => {
  const updatedUser = await Codes.findByIdAndUpdate(req.params.userId, req.body, {
    new: true
  });
  res.status(200).json(updatedCode);
};

exports.updateUserById = updateUserById;

const deleteUserById = async (req, res) => {
  const deletedUser = await Codes.findByIdAndDelete(req.params.userId);
  res.status(204).json(deletedUser);
};

exports.deleteUserById = deleteUserById;
//# sourceMappingURL=users.controller.js.map