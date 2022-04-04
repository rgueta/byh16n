"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateVisitorById = exports.updateSimpleVisitorById = exports.getVisitorsByUser = exports.getVisitors = exports.getVisitorById = exports.deleteVisitorById = exports.createVisitor = void 0;

var _Visitors = _interopRequireDefault(require("../models/Visitors"));

var _mongoose = require("mongoose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createVisitor = async (req, res) => {
  console.log('createVisitor --> ' + JSON.stringify(req.body));

  try {
    const {
      userId,
      name,
      email,
      username,
      pwd,
      address,
      sim,
      gender,
      avatar
    } = req.body;
    const newVisitor = new _Visitors.default({
      userId,
      name,
      email,
      username,
      pwd,
      address,
      sim,
      gender,
      avatar
    });
    console.log('newVisitor -> ', newVisitor);
    return;
    const visitorSaved = await newVisitor.save(); // console.log('visitors --> ' + JSON.stringify(req.body));

    res.status(201).json({
      'visitorSaved': visitorSaved
    }); // res.json('creating visistor')
  } catch (err) {
    console.log(err);
    res.status(404).json(err);
  }
};

exports.createVisitor = createVisitor;

const getVisitors = async (req, res) => {
  const visitors = await _Visitors.default.find();
  res.json(visitors);
};

exports.getVisitors = getVisitors;

const getVisitorsByUser = async (req, res) => {
  console.log('get Visitors for user: ' + req.params.userId);
  const visitors = await _Visitors.default.aggregate([{
    $match: {
      'userId': {
        '$eq': _mongoose.Types.ObjectId(req.params.userId)
      }
    }
  }, {
    $project: {
      _id: 1,
      name: 1,
      email: 1,
      username: 1,
      sim: 1,
      avatar: 1
    }
  }]);
  console.log('Visitors from userId' + req.params.userId);
  res.status(200).json(visitors);
};

exports.getVisitorsByUser = getVisitorsByUser;

const getVisitorById = async (req, res) => {
  const visitor = await _Visitors.default.findById(req.params.visitorId);
  console.log(req.params.visitorId);
  res.status(200).json(visitor);
};

exports.getVisitorById = getVisitorById;

const updateVisitorById = async (req, res) => {
  const updatedVisitor = await _Visitors.default.findByIdAndUpdate(req.params.visitorId, req.body, {
    new: true
  });
  res.status(200).json(updatedVisitor);
};

exports.updateVisitorById = updateVisitorById;

const updateSimpleVisitorById = async (req, res) => {
  console.log('updateSimpleVisitorById params -->', req.body);
  await _Visitors.default.findByIdAndUpdate(req.params.visitorId, req.body, {
    new: false
  }, (err, result) => {
    if (err) return res.status(401).json({
      'msg': 'can not update visitor ' + err
    });
    console.log('updated Ok ' + result);
  }); // if(!updatedVisitor) return res.status(401).json({'msg':'can not update visitor '}); 

  res.status(200).json(updatedVisitor); // res.status(200).json({'msg':'testing'});
};

exports.updateSimpleVisitorById = updateSimpleVisitorById;

const deleteVisitorById = async (req, res) => {
  const deletedVisitor = await _Visitors.default.findByIdAndDelete(req.params.visitorId);
  res.status(204).json(deletedVisitor);
};

exports.deleteVisitorById = deleteVisitorById;
//# sourceMappingURL=visitors.controller.js.map