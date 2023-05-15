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
  console.log(socket.handshake);
  console.log('Core ID --> ' + socket.handshake.headers['coreid']);


  // join event
  await socket.to(socket.handshake.headers['coreid']).emit('joined','user joined to room ' + socket.handshake.headers['coreid'])

// List sockets available  --------------
  app.use("/api/sockets", async (req, res) => {
    let clients = await io.local.fetchSockets();
    res.status(200).json({'msg':'sockets clients listed'});
    console.log('--- Socket clients -->');
    console.table(clients);

  });

  // List room available  --------------
  app.use("/api/alert/:room/:title/:msg", async (req, res) => {
    console.log('Si entro al router de alertas..! ' + new Date().toLocaleString());
    res.send({'Alert room ': req.params.room});
    socket.to(req.params.room).emit('Alert',{title: req.params.title,msg:req.params.msg});

    var roster = await socket.in(req.params.room).fetchSockets();
    console.table(roster)

  });

    
    socket.on('join', async (room) => {
      try{
        await socket.join(room);
        await console.log('user joined to room: ', room);
        await socket.to(room).emit('joined','user joined to room ' + room)
      }catch(ex){
        console.log('error join room: ', room + '\nError: '+ ex);
      }
      
    });

    socket.on('check',(msg) => {
      console.log(msg + ', id: ' + socket.id + ', ' + new Date().toLocaleString());
    })
    
    
    // socket.on('join', async (room) => {
    //   try{
    //     await socket.join(room,() =>{
    //       console.log('user joined to room: ', room);
    //     });
    //   }catch(ex){
    //     console.log('error join to room: ', room, '\nError:' + ex);
    //   }
      
    //   await socket.in(room).emit('joined','user joined to room ' + room)
    // });
     
    // await socket.on('set-name', (name) => {
    //   let now = new Date();
    //   console.log('socket set-name user: ' + JSON.stringify(name) +  ` at ${now.toLocaleString()}`);

    //   socket.username = name;
    //   io.emit('users-changed', {user: name, event: 'joined'});    
    // });
    
    socket.on('send-message', (message) => {
      io.emit('message', {msg: message.text, user: socket.username, createdAt: new Date()});    
    });

   

    // console.log('a user connected, socket -> ' +socket.id + ' - ' + socket.handshake.headers['user-agent']);
    // console.log(socket.handshake.headers['user-agent']);

    await console.log('-------------------------------------------------------------')
  });

  io.sockets.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  io.sockets.on('disconnect', () => {
    /*
      socket.rooms is empty here 
      leaveAll() has already been called
    */
   console.log('Disconnection '+ new Date().toLocaleString())
  });

  // import modelAlerts from './models/alerts';

// require('./routes/routes')(app,modelAlerts,io);


// #endregion  --------------------------------------------------------------

console.log('server listen on port', PORT)

