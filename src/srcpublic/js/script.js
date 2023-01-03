
const socket = io();

function sendAlert(){
    console.log('sent alert');
    socket.emit('alert','Door Open');
  }