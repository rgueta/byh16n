"use strict";

var _config = _interopRequireDefault(require("./config"));

var _app = _interopRequireDefault(require("./app"));

var _fs = _interopRequireDefault(require("fs"));

var _socket = require("socket.io");

var _http = require("http");

var _alerts = _interopRequireDefault(require("./models/alerts"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//--- this file is just to run the app
// index setup
const PORT = _config.default.app.port;
const httpServer = (0, _http.createServer)(_app.default);
const io = new _socket.Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  } // ...

});
httpServer.listen(process.env.PORT || PORT); // #endregion ------ http  ---------
//#region ----- sockets -------------------------------------------------------

io.sockets.on('connection', socket => {
  //sample to emit with rooms
  // io.sockets.in(room).emit('event', data);
  socket.on('create', room => {
    console.log('user joined to room: ', room);
    socket.join(room);
  });
  socket.on('set-name', name => {
    let now = new Date();
    console.log('socket set-name user: ' + JSON.stringify(name) + ` at ${now.toLocaleString()}`);
    socket.username = name;
    io.emit('users-changed', {
      user: name,
      event: 'joined'
    });
  });
  socket.on('send-message', message => {
    io.emit('message', {
      msg: message.text,
      user: socket.username,
      createdAt: new Date()
    });
  });
  socket.on("connect_error", err => {
    console.log(`connect_error due to ${err.message}`);
  });
  socket.on('disconnect', function () {
    io.emit('users-changed', {
      user: socket.username,
      event: 'left'
    });
  }); // console.log('a user connected, socket -> ' +socket.id + ' - ' + socket.handshake.headers['user-agent']);
  // console.log(socket.handshake.headers['user-agent']);
});

require('./routes/routes')(_app.default, _alerts.default, io); // #endregion  --------------------------------------------------------------


console.log('server listen on port', PORT);
//# sourceMappingURL=index.js.map