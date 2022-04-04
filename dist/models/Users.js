"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const userSchema = new _mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true
  },
  pwd: {
    type: String,
    required: true,
    trim: true
  },
  core: {
    type: _mongoose.Schema.Types.ObjectId,
    required: true
  },
  house: {
    type: Number,
    required: true
  },
  uuid: {
    type: String,
    required: true
  },
  sim: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  roles: [{
    ref: 'Roles',
    type: _mongoose.Schema.Types.ObjectId
  }],
  status: {
    type: Number
  }
}, {
  timestamps: true,
  versionKey: false
});

userSchema.statics.encryptPassword = async pwd => {
  const salt = await _bcryptjs.default.genSalt(10);
  return await _bcryptjs.default.hash(pwd, salt);
};

userSchema.statics.comparePassword = async (password, receivedPassword) => {
  console.log('receivedPassword --> ' + receivedPassword);
  return await _bcryptjs.default.compare(password, receivedPassword);
};

var _default = (0, _mongoose.model)('Users', userSchema);

exports.default = _default;
//# sourceMappingURL=Users.js.map