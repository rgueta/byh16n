"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

// const code_eventsSchema = new Schema({
//     codeId : {type : Schema.Types.ObjectId, required : true},
//     picId : {type : String, required : true},
//     CoreSim : {type : String, required : true}
//     },
//     {
//         timestamps:true,
//         versionKey:false
// });
const divisionsSchema = new _mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  City: {
    type: String,
    required: true
  },
  Location: {
    type: [String],
    required: true
  },
  Pc: Number,
  Country: {
    type: String,
    required: true
  },
  Description: {
    type: String
  }
}, {
  timestamps: true,
  versionKey: false
});

var _default = (0, _mongoose.model)('divisions', divisionsSchema); // export default model('code_events', divisionSchema);


exports.default = _default;
//# sourceMappingURL=divisions.js.map