//Array of rooms
const rooms = [];

//Create Room Function
const createRoom = (roomId, player1Id) => {
    rooms[roomId] = [player1Id, ""];
}

//Join Room Function
const joinRoom = (roomId, player2Id) => {
    rooms[roomId][1] = [player2Id];
}

//Exit Room Function
const exitRoom= (roomId, player) => {
    if(player === 1){
        delete rooms[roomId];
    }else{
        rooms[roomId][1]="";
    }
}

//Exporting Functions
module.exports = {rooms, createRoom, joinRoom, exitRoom};