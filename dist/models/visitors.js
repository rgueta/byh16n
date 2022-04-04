"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const visitorSchema = new _mongoose.Schema({
  userId: {
    type: _mongoose.Schema.Types.ObjectId
  },
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
    type: String
  },
  pwd: {
    type: String,
    trim: true
  },
  address: {
    type: String
  },
  sim: {
    type: String,
    required: true
  },
  gender: {
    type: String
  },
  avatar: {
    type: String
  }
}, {
  timestamps: true,
  versionKey: false
});

visitorSchema.statics.encryptPassword = async pwd => {
  const salt = await _bcryptjs.default.genSalt(10);
  return await _bcryptjs.default.hash(pwd, salt);
};

visitorSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await _bcryptjs.default.compare(password, receivedPassword);
};

var _default = (0, _mongoose.model)('Visitors', visitorSchema);

exports.default = _default;
//# sourceMappingURL=visitors.js.map