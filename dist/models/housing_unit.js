"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const housing_unitSchema = new _mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sim: {
    type: String,
    required: true
  },
  location: {
    type: [String],
    required: true
  },
  avatar: {
    type: String
  },
  detail: {
    type: {
      String
    }
  },
  division: {
    type: _mongoose.Schema.Types.ObjectId,
    required: true
  },
  enable: {
    type: Boolean
  },
  contact_email: {
    type: String
  },
  contact_name: {
    type: String
  },
  contact_phone: {
    type: String
  }
}, {
  timestamps: true,
  versionKey: false
});

var _default = (0, _mongoose.model)('housing_unit', housing_unitSchema);

exports.default = _default;
//# sourceMappingURL=housing_unit.js.map