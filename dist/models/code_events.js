"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const code_eventsSchema = new _mongoose.Schema({
  codeId: {
    type: _mongoose.Schema.Types.ObjectId,
    required: true
  },
  picId: {
    type: String,
    required: true
  },
  CoreSim: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

var _default = (0, _mongoose.model)('code_events', code_eventsSchema);

exports.default = _default;
//# sourceMappingURL=code_events.js.map