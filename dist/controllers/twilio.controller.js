"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendMsgOpen = exports.sendMsgAccess = void 0;

var _twilio = require("twilio");

var _number = require("twilio/lib/rest/pricing/v2/number");

var _config = _interopRequireDefault(require("../../src/config"));

var _Users = _interopRequireDefault(require("../models/Users"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const client = new _twilio.Twilio(_config.default.twilio.SID, _config.default.twilio.AUTH_TOKEN);

const sendMsgOpen = async (req, res) => {
  try {
    client.messages.create({
      body: req.params.msg,
      messagingServiceSid: 'MGe8f3e7143c2962fbeac086f010615494',
      to: req.params.phone
    }).then(message => console.log(message.sid)).done();
  } catch (err) {
    res.status(404).json({
      'msg': 'twilio send error' + JSON.stringify(err)
    });
  }

  res.status(201).json({
    'msg': 'twilio send ok'
  });
};

exports.sendMsgOpen = sendMsgOpen;

const sendMsgAccess = async (req, res) => {
  return; // console.log('twilio access params --> ', req.params);

  const msg = req.params.msg.split(','); // console.log('MEssage --> ', msg);

  const foundUSer = _Users.default.findOne({
    _id: msg[1]
  });

  if (foundUSer) {
    console.log('Si se encontro usuario');

    if (msg[0].toLowerCase() == 'blocked') {
      console.log('Set Blocked status to ID -->', req.params.userId);
      await _Users.default.findByIdAndUpdate(msg[1], {
        $set: {
          status: 4
        }
      }, {
        new: false
      }, (err, result) => {
        if (err) {
          return res.status(200).json({
            'msg': 'error',
            'status': 'Could not updated status blocked'
          });
        }

        console.log('return value after updated blocked --> ', result);
      });
    } else if (msg[0].toLowerCase() == 'unblocked') {
      console.log('Si es Unblocked command');

      _Users.default.findByIdAndUpdate(msg[1], {
        $set: {
          status: 1
        }
      }, {
        new: false
      }, (err, result) => {
        if (err) {
          return res.status(200).json({
            'msg': 'error',
            'status': 'Could not updated status blocked'
          });
        }

        console.log('return value after updated  unblocked --> ', result);
      });
    }
  } else {
    console.log('No se encontro usuario');
  }

  try {
    client.messages.create({
      body: req.params.msg,
      messagingServiceSid: 'MGe8f3e7143c2962fbeac086f010615494',
      to: req.params.phone
    }).then(message => console.log(message.sid)).done();
  } catch (err) {
    res.status(404).json({
      'msg': 'twilio send error' + JSON.stringify(err)
    });
  }

  res.status(201).json({
    'msg': 'twilio send ok'
  });
};

exports.sendMsgAccess = sendMsgAccess;
//# sourceMappingURL=twilio.controller.js.map