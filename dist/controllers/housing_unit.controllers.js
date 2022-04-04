"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOnlyHousing_unit = exports.getHousing_unit = exports.deleteHousing_unitById = exports.createHousing_unit = void 0;

var _housing_unit = _interopRequireDefault(require("../models/housing_unit"));

var _mongoose = require("mongoose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createHousing_unit = async (req, res) => {
  const {
    name,
    sim,
    location,
    avatar,
    division,
    enable,
    contact_email,
    contact_name,
    contact_phone
  } = await req.body;
  const detail = {};
  const newHousing_unit = new _housing_unit.default({
    name,
    sim,
    location,
    avatar,
    detail,
    division,
    enable,
    contact_name,
    contact_email,
    contact_phone
  });

  try {
    const housing_unitSaved = await newHousing_unit.save();
    res.status(200).json(housing_unitSaved);
  } catch (e) {
    console.log({
      'Error saving Housing_unit': e
    });
    res.status(500).json({
      'error saving Housing_unit': e
    });
  }
};

exports.createHousing_unit = createHousing_unit;

const getHousing_unit = async (req, res) => {
  _housing_unit.default.find({}, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: err
      });
    } else {
      res.status(200).json(results);
    }
  });
};

exports.getHousing_unit = getHousing_unit;

const getOnlyHousing_unit = async (req, res) => {
  _housing_unit.default.find({}, {
    _id: 1,
    name: 1
  }, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        message: err
      });
    } else {
      res.status(200).json(results);
    }
  });
};

exports.getOnlyHousing_unit = getOnlyHousing_unit;

const deleteHousing_unitById = async (req, res) => {
  const deletedHousingUnit = await _housing_unit.default.findByIdAndDelete(req.params.housing_unitId);
  res.status(204).json(deletedHousingUnit);
};

exports.deleteHousing_unitById = deleteHousing_unitById;
//# sourceMappingURL=housing_unit.controllers.js.map