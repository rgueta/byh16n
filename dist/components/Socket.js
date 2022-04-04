"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _socket = _interopRequireDefault(require("socket.io-client"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('socket-client connected');
let socket = (0, _socket.default)('https://localhost:5000');
var _default = socket;
exports.default = _default;
//# sourceMappingURL=Socket.js.map