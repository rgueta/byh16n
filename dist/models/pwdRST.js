"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const pwdRSTSchema = new _mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  confirmed: {
    type: Boolean,
    required: true,
    default: false
  },
  reseted: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true,
  versionKey: false
});

var _default = (0, _mongoose.model)('pwdRST', pwdRSTSchema);

exports.default = _default;
//# sourceMappingURL=pwdRST.js.map