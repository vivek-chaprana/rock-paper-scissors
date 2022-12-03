import socketIo from "socket.io-client";
const ENDPOINT = "https://rock-paper-scissors-o412.onrender.com";
const socket = socketIo(ENDPOINT, { transports: ['websocket'] });
export default socket;