"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const alertsSchema = new _mongoose.Schema({
  privada: {
    type: _mongoose.Schema.Types.ObjectId,
    required: true
  },
  item: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

var _default = (0, _mongoose.model)('Alerts', alertsSchema);

exports.default = _default;
//# sourceMappingURL=alerts.js.map