module.exports = function(app,model,io){
    const socket = io;
    
    app.post('/api/alerts',async (req,res) => {
        
        // console.log(req.body.message);
        console.log(req.params.msg);
        // io.sockets.in(req.params.room).emit('alert', ' - emmited..');
        socket.emit('alert',' - emmited..');
        res.status(201).json({'message' : 'req.body.message'});
    });

    app.post('/api/alerts/:msg/:room',async (req,res) => {
        // const alert = JSON.parse(req.params.alert);
        // console.log(alert);
        console.log('3.- alert msg : ' + req.params.msg + ', room: ' + req.params.room);
        io.sockets.in(req.params.room).emit('alert', req.params.msg);
        // socket.emit('alert',' - emmited..');

        res.status(201).json({'message' : req.params.msg});
    });

    app.get('/api/alerts:msg',async (req,res) => {
        // console.log('alert msg : ' + req.body.msg + ', room: ' + req.params.room);
        // io.sockets.in(req.params.room).emit('alert', ' - emmited..');
        socket.emit('alert',' - emmited..');
        res.status(201).json({'message' : req.params.msg});
    });

    app.get('/api/alerts/:msg/:room',async (req,res) => {
        // const alert = JSON.parse(req.params.alert);
        // console.log(alert);
        console.log('4.- alert msg : ' + req.params.msg + ', room: ' + req.params.room);
        io.sockets.in(req.params.room).emit('alert', req.params.msg);
        // socket.emit('alert',' - emmited..');

        res.status(201).json({'message' : req.params.msg});
    });


    app.get('/api/alerts/:alert',async (req,res) => {
        console.log('si entre..')
        const alert = JSON.parse(req.params.alert);
        console.log(alert);
        console.log('alert msg : ' + alert.msg + ', room: ' + alert.room);
        io.sockets.in(alert.room).emit('alert', alert.msg);
        // socket.emit('alert',' - emmited..');

        res.status(201).json({'message' : alert.msg});
    });



}