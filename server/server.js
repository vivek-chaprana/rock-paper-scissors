const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors")

const app = express();
const port= process.env.PORT ;

app.use(cors());

app.get("/",(req,res)=>{
    res.send("Hello Fraands Chai Pee Loo !");
})

const server = http.createServer(app);



const io=socketIO(server);



const {userConnected, connectedUsers, initializeChoices, moves, makeMove, choices} = require("./utils/users");
const {createRoom, joinRoom, exitRoom, rooms} = require("./utils/rooms");


io.on("connection", socket => {
    console.log(`User connected with id : ${socket.id}`)
    socket.on("create-room", (roomId) => {
        if(rooms[roomId]){
            const error = "This room already exists";
            socket.emit("display-error", error);
        }else{
            userConnected(socket.client.id);
            createRoom(roomId, socket.client.id);
            socket.emit("room-created", roomId);
            socket.emit("player-1-connected");
            socket.join(roomId);
        }
    })

    socket.on("join-room", roomId => {
        if(!rooms[roomId]){
            const error = "This room doesn't exist";
            socket.emit("display-error", error);
            
        }else{
            userConnected(socket.client.id);
            joinRoom(roomId, socket.client.id);
            socket.join(roomId);

            socket.emit("room-joined", roomId);
            socket.emit("player-2-connected");
            socket.broadcast.to(roomId).emit("player-2-connected");
            initializeChoices(roomId);
            
        }
    })

    socket.on("join-random", () => {
        let roomId = "";

        for(let id in rooms){
            if(rooms[id][1] === ""){
                roomId = id;
                break;
            }
        }

        if(roomId === ""){
            const error = "All rooms are full or none exists";
            socket.emit("display-error", error);
            
        }else{
            userConnected(socket.client.id);
            joinRoom(roomId, socket.client.id);
            socket.join(roomId);

            socket.emit("room-joined", roomId);
            socket.emit("player-2-connected");
            socket.broadcast.to(roomId).emit("player-2-connected");
            initializeChoices(roomId);
            
        }
    });

    socket.on("make-move", (obj) => {
        let roomId = obj.roomId;
        let playerId = obj.playerId;
        let myChoice = obj.ch === 1 ? "rock" : obj.ch === 2 ? "paper" : "scissor"
        makeMove(roomId, playerId, myChoice);

        if(choices[roomId][0] !== "" && choices[roomId][1] !== ""){
            let playerOneChoice = choices[roomId][0];
            let playerTwoChoice = choices[roomId][1];

            if(playerOneChoice === playerTwoChoice){
                let message = "Both of you chose " + playerOneChoice + " . So it's draw";
                io.to(roomId).emit("draw", message);
                
            }else if(moves[playerOneChoice] === playerTwoChoice){
                const choiceObj = {playerOneChoice,playerTwoChoice};
                io.to(roomId).emit("player-1-wins", choiceObj);
            }else{
                const choiceObj = {playerOneChoice,playerTwoChoice};
                io.to(roomId).emit("player-2-wins", choiceObj);
            }
            choices[roomId] = ["", ""];
        }
    });

    socket.on("disconnect", () => {
        if(connectedUsers[socket.client.id]){
            let player;
            let roomId;

            for(let id in rooms){
                if(rooms[id][0] === socket.client.id || 
                    rooms[id][1] === socket.client.id){
                    if(rooms[id][0] === socket.client.id){
                        player = 1;
                    }else{
                        player = 2;
                    }

                    roomId = id;
                    break;
                }
            }

            exitRoom(roomId, player);

            if(player === 1){
                io.to(roomId).emit("player-1-disconnected");
            }else{
                io.to(roomId).emit("player-2-disconnected");
            }
        }
    })
})

server.listen(port, () => console.log(`Server started on port ${port}
http://localhost:${port}`));