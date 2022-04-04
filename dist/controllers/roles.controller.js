"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRoles = exports.createRoles = void 0;

var _Roles = _interopRequireDefault(require("../models/Roles"));

var _mongoose = require("mongoose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createRoles = async (req, res) => {};

exports.createRoles = createRoles;

const getRoles = async (req, res) => {
  const roles = await _Roles.default.find();
  res.json(roles);
};

exports.getRoles = getRoles;
//# sourceMappingURL=roles.controller.js.map