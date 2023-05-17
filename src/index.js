//--- this file is just to run the app
import app from './app';

// index setup
const PORT = process.env.PORT;

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
});


httpServer.listen(PORT);
// #endregion ------ http  ---------



//#region ----- sockets -------------------------------------------------------


io.sockets.on('connection', async (socket) => {
  await console.log('-------------------------- sockets  ------------------------')

  console.log('New connection id: ' + socket.id + ', ' + new Date().toLocaleString());

  console.info(socket.handshake);
  console.log('Core ID --> ' + socket.handshake.headers['coreid']);


  socket.on('join', async (room) => {
    try{
      await socket.join(room);
      await console.log('user joined to room: ', room);
      await socket.to(room).emit('joined','user joined to room ' + room)
    }catch(ex){
      console.log('error join room: ', room + '\nError: '+ ex);
    }
    
  });

    socket.on('ping',(msg) => {
      console.log('ping ' + `${socket.id}, `+ new Date().toLocaleString());
    })
        
    socket.on('send-message', (message) => {
      io.emit('message', {msg: message.text, user: socket.username, createdAt: new Date()});    
    });

    socket.on('disconnect', () => {
     console.log('Disconnection [ '+ socket.id + ' ], ' + new Date().toLocaleString())
     socket.emit('desconexion');
    });

    await console.log('-------------------------------------------------------------')
  });

  // List room available  --------------
  app.use("/api/alert/:room/:title/:msg", async (req, res) => {
    console.log('Si entro al router de alertas..! ' + new Date().toLocaleString());
    res.send({'Alert room ': req.params.room});
    io.sockets.to(req.params.room).emit('Alert',{title: req.params.title,msg:req.params.msg});

    var roster = await io.sockets.in(req.params.room).fetchSockets();
    console.table(roster)

  });

  // List sockets available  --------------
  app.use("/api/sockets", async (req, res) => {
    let clients = await io.local.fetchSockets();
    res.status(200).json({'msg':'sockets clients listed'});
    console.log('--- Socket clients -->');
    console.table(clients);
    console.log('--- Socket rooms -->');
    console.table(io.sockets.adapter.rooms);

  });

  io.sockets.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  

  // import modelAlerts from './models/alerts';

// require('./routes/routes')(app,modelAlerts,io);


// #endregion  --------------------------------------------------------------

console.log('server listen on port', PORT)

