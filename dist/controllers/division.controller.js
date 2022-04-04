"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDivisionsLite = exports.getDivisions = exports.createDivision = void 0;

var _divisions = _interopRequireDefault(require("../models/divisions"));

var _mongoose = require("mongoose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createDivision = async (req, res) => {
  const {
    Name,
    City,
    Location,
    Pc,
    Country
  } = req.body;
  const newDivision = (0, _divisions.default)({
    Name,
    City,
    Location,
    Pc,
    Country
  });
  const divisionSaved = await newDivision.save();
  res.status(201).json(divisionSaved);
};

exports.createDivision = createDivision;

const getDivisions = async (req, res) => {
  await _divisions.default.find((err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: err
      });
    } else {
      console.log(result);
      res.status(200).json(result);
    }
  });
};

exports.getDivisions = getDivisions;

const getDivisionsLite = async (req, res) => {
  await _divisions.default.find({}, {
    _id: 1,
    Name: 1
  }, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: err
      });
    } else {
      console.log(result);
      res.status(200).json(result);
    }
  });
};

exports.getDivisionsLite = getDivisionsLite;
//# sourceMappingURL=division.controller.js.map