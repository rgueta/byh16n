"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOnlyCores = exports.getCores = exports.deleteCoreById = exports.createCore = void 0;

var _cores = _interopRequireDefault(require("../models/cores"));

var _mongoose = require("mongoose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createCore = async (req, res) => {
  const {
    Name,
    Address,
    webService,
    Sim,
    Location,
    qty,
    Motor,
    Gate_type,
    Gate_long,
    Gate_heigh,
    Pedestrian_type,
    Pedestrian_long,
    Pedestrian_heigh,
    housing_unit,
    enable,
    contact_name,
    contact_email,
    contact_phone
  } = await req.body;
  const Houses = {
    qty,
    detail: []
  };
  const detail = {
    Motor,
    Gate_type,
    Gate_long,
    Gate_heigh,
    Pedestrian_type,
    Pedestrian_long,
    Pedestrian_heigh
  };
  const newCore = new _cores.default({
    Name,
    Address,
    webService,
    Sim,
    Location,
    Houses,
    detail,
    housing_unit,
    enable,
    contact_name,
    contact_email,
    contact_phone
  });

  try {
    const coreSaved = await newCore.save();
    res.status(200).json(coreSaved);
  } catch (e) {
    console.log({
      'Error saving core': e
    });
    res.status(500).json({
      'error saving Core': e
    });
  }
};

exports.createCore = createCore;

const getCores = async (req, res) => {
  _cores.default.find({}, (err, results) => {
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

exports.getCores = getCores;

const getOnlyCores = async (req, res) => {
  _cores.default.find({}, {
    _id: 1,
    Name: 1
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

exports.getOnlyCores = getOnlyCores;

const deleteCoreById = async (req, res) => {
  const deletedCore = await _cores.default.findByIdAndDelete(req.params.coreId);
  res.status(204).json(deletedCore);
};

exports.deleteCoreById = deleteCoreById;
//# sourceMappingURL=cores.controller.js.map