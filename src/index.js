//--- this file is just to run the app
import app from './app';
import { Server } from "http";
import axios from "axios";

// socket.io
import socket from "socket.io";



// index setup
const PORT = process.env.PORT;

// #region   -------- http  -----------------------------
const httpServer = new Server(app,);
httpServer.listen(PORT,'0.0.0.0');

// #endregion ------ http  ---------

// socket.io
const io = socket(httpServer,{
    cors:{
        origin: '*'
    }
})

// global var to user from another files like controllers files
global._io = io;



console.log('Server listen on port: '+ PORT 
    + ', '+ new Date().toISOString());

// Firebase ALerts  -----------------
app.use("/api/alerts/:core/:msg/:title?/:subtitle?", async (req, res, next) => {

    const config = {
        method: 'POST',
        url: process.env.FIREBASE_URI,
        headers: {
            'content-type': 'application/json',
            'Authorization':  'key=' + process.env.FIREBASE_API_KEY
        },
        data:  JSON.stringify({to: `/topics/${req.params.core}`, notification: {
            body: req.params.msg,
            title: req.params.title,
            subtitle: req.params.subtitle
        }})
    }

    let resp = '';
    await axios(config)
    .then((result) => {
        resp = result.data
    })
    .catch((err) => console.log('axios error: ', err));

   return await res.status(200).send(resp);

 });

//  socket.io implementation

io.on('connection', (socket) =>{
    console.log(`socket --> ${socket.id} connected.`);

    // socket.on('codeEvent',(socket) => {
    //     console.log('codeEvent catchup..!!!!, socket: ', socket);
    //     io.sockets.emit('codeEvent',{'msg':'event triggered'})
    // })
});
