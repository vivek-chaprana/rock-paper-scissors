import socketIo from "socket.io-client";
const ENDPOINT = "https://rps-vicky.herokuapp.com/";
const socket = socketIo(ENDPOINT, { transports: ['websocket'] });
export default socket;