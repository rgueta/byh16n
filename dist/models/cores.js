"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const coresSchema = new _mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  Address: {
    type: String,
    required: true
  },
  Sim: {
    type: String,
    required: true
  },
  Location: {
    type: [String],
    required: true
  },
  Houses: {
    qty: {
      type: Number,
      required: true
    },
    detail: [{
      houseId: {
        type: String,
        required: true
      },
      userId: {
        type: _mongoose.Schema.Types.ObjectId,
        required: true
      },
      pic: {
        type: String
      },
      description: {
        type: String
      }
    }]
  },
  detail: {
    Motor: {
      type: String,
      required: true
    },
    Gate_type: {
      type: String,
      required: true
    },
    Gate_long: {
      type: Number,
      required: true
    },
    Gate_heigh: {
      type: Number,
      required: true
    },
    Pedestrian_type: {
      type: String,
      required: true
    },
    Pedestrian_long: {
      type: Number,
      required: true
    },
    Pedestrian_heigh: {
      type: Number,
      required: true
    }
  },
  housing_unit: {
    type: _mongoose.Schema.Types.ObjectId,
    required: true
  }
}, // });
{
  timestamps: true,
  versionKey: false
});

var _default = (0, _mongoose.model)('Cores', coresSchema);

exports.default = _default;
//# sourceMappingURL=cores.js.map