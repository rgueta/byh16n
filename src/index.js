//--- this file is just to run the app
import config from "./config";
import app from './app';
import fs from 'fs';
import dotenv from "dotenv";
dotenv.config()

// index setup
const PORT = config.app.port;

import { Server } from "socket.io";

//#region ---- https --------------------------------------
// import { createServer } from "https";

// const httpsServer = createServer({
//   key : fs.readFileSync('key.pem'),
//   cert : fs.readFileSync('cert.pem')
// },app);


// const io = new Server(httpsServer, {
//     cors:{
//         origin: '*',
//         methods:['GET','POST']
//     }
//   // ...
// });

// httpsServer.listen(PORT);
//#endregion ------- hhtps  ------


// #region   -------- http  -----------------------------
import { createServer } from "http";

const httpServer = createServer(app);


const io = new Server(httpServer, {
    cors:{
        origin: '*',
        methods:['GET','POST']
    }
  // ...
});

httpServer.listen(process.env.PORT || PORT);
// #endregion ------ http  ---------



//#region ----- sockets -------------------------------------------------------

io.sockets.on('connection', (socket) => {

    //sample to emit with rooms
    // io.sockets.in(room).emit('event', data);


    socket.on('create',(room) => {
      console.log('user joined to room: ', room);
      socket.join(room);
    });
     
    socket.on('set-name', (name) => {
      let now = new Date();
      console.log('socket set-name user: ' + JSON.stringify(name) +  ` at ${now.toLocaleString()}`);

      socket.username = name;
      io.emit('users-changed', {user: name, event: 'joined'});    
    });
    
    socket.on('send-message', (message) => {
      io.emit('message', {msg: message.text, user: socket.username, createdAt: new Date()});    
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socket.on('disconnect', function(){
      io.emit('users-changed', {user: socket.username, event: 'left'});   
    });

    // console.log('a user connected, socket -> ' +socket.id + ' - ' + socket.handshake.headers['user-agent']);
    // console.log(socket.handshake.headers['user-agent']);
  });

  import modelAlerts from './models/alerts';

require('./routes/routes')(app,modelAlerts,io);

// #endregion  --------------------------------------------------------------

console.log('server listen on port', process.env.PORT || PORT)

