"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const roleSchema = new _mongoose.Schema({
  name: {
    type: String,
    required: true
  }
}, {
  versionKey: false
});

var _default = (0, _mongoose.model)('Roles', roleSchema);

exports.default = _default;
//# sourceMappingURL=Roles.js.map