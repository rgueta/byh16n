import io from "socket.io-client";

console.log('socket-client connected');
// let socket = io('https://localhost:5000');
let socket = io('https://byh16n-2-4-1.herokuapp.com');

export default socket;
