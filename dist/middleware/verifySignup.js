"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkRolesExists = exports.checkDuplicateUsernameEmail = void 0;

var _Roles = require("../models/Roles");

var _Users = _interopRequireDefault(require("../models/Users"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//- when have time get this roles from mongo
const checkDuplicateUsernameEmail = async (req, res, next) => {
  const user = await _Users.default.findOne({
    username: req.body.username
  });
  if (user) return res.status(400).json({
    message: 'Username already exists'
  });
  const email = await _Users.default.findOne({
    email: req.body.email
  });
  if (email) return res.status(400).json({
    message: 'Email already exists'
  });
  next();
};

exports.checkDuplicateUsernameEmail = checkDuplicateUsernameEmail;

const checkRolesExists = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!_Roles.ROLES.includes(req.body.roles[i])) {
        return res.status(400).json({
          message: `Role ${req.body.roles[i]} does not exists`
        });
      }
    }
  }

  next();
};

exports.checkRolesExists = checkRolesExists;
//# sourceMappingURL=verifySignup.js.map