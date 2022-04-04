import io from "socket.io-client";

console.log('socket-client connected');
let socket = io('https://localhost:5000');

export default socket;
