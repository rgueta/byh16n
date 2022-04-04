"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const codeSchema = new _mongoose.Schema({
  code: {
    type: String
  },
  initial: {
    type: String,
    required: true
  },
  expiry: {
    type: String,
    required: true
  },
  source: {
    user: {
      type: _mongoose.Schema.Types.ObjectId,
      required: true
    },
    platform: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  comment: {
    type: String
  },
  visitorId: {
    type: _mongoose.Schema.Types.ObjectId,
    required: true
  },
  enable: {
    type: Number,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

var _default = (0, _mongoose.model)('Codes', codeSchema);

exports.default = _default;
//# sourceMappingURL=Codes.js.map