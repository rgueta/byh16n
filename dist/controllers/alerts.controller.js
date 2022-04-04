"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAlerts = exports.createAlert = void 0;

var _alerts = _interopRequireDefault(require("../models/alerts"));

var _mongoose = require("mongoose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import socket from "../components/Socket";
// import socket from 'socket.io';
const getAlerts = async (req, res) => {
  // Alerts.find({}, (err, results) => {
  //     if (err) {
  //       console.log(err);
  //       res.status(500).json({message: err});
  //     } else {
  //       res.status(200).json(results);
  //     }
  //   }); 
  const alerts = await _alerts.default.find();
  res.json(alerts);
};

exports.getAlerts = getAlerts;

const createAlert = async (req, res) => {
  console.log(req.body.message); // socket.emit('alert',' - emmited')
  // const { privada,item,message} = req.body;
  // const newAlert = new Alerts({privada,item,message});
  // const AlertSaved = await newAlert.save();
  // // console.log(req.body);
  // res.status(201).json(AlertSaved);

  res.status(201).json({
    'message': req.body.message
  });
};

exports.createAlert = createAlert;
//# sourceMappingURL=alerts.controller.js.map