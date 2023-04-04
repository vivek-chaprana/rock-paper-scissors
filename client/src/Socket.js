import socketIo from "socket.io-client";
const ENDPOINT = "https://rock-paper-scissors-backend.onrender.com/";
const socket = socketIo(ENDPOINT, { transports: ['websocket'] });
export default socket;