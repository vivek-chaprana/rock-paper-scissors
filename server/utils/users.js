//Connected users object
const connectedUsers = {};
//User choices object
const choices = {};
//Winning Conditions
const moves = {
  rock: "scissor",
  paper: "rock",
  scissor: "paper",
};
//Intialize choice on room creation
const initializeChoices = (roomId) => {
  choices[roomId] = ["", ""];
};
//To check if user is connected
const userConnected = (userId) => {
  connectedUsers[userId] = true;
};
//To make a move
const makeMove = (roomId, player, choice) => {
  console.log(choice + " :  choice");

  if (choices[roomId]) {
    choices[roomId][player - 1] = choice;
  }
  console.log(choices);
};

//Exporting
module.exports = {
  connectedUsers,
  initializeChoices,
  userConnected,
  makeMove,
  moves,
  choices,
};
