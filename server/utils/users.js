const connectedUsers = {};
const choices = {};
const moves = {
    "rock": "scissor",
    "paper": "rock",
    "scissor": "paper"
};

const initializeChoices = (roomId) => {
    choices[roomId] = ["", ""]
    
}

const userConnected = (userId) => {
    connectedUsers[userId] = true;
    
}

const makeMove = (roomId, player, choice) => {
    console.log(choice  +" :  choice");
    
    if(choices[roomId]){
        choices[roomId][player - 1] = choice;
    }
    console.log(choices);
    
}

module.exports = {connectedUsers, initializeChoices, userConnected, makeMove, moves, choices};