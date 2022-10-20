import React, { useState, useEffect } from "react";
import socket from "../Socket";

import Rock from "../Assets/rock.png";
import Paper from "../Assets/paper.png";
import Scissors from "../Assets/scissor.png";

const GameplayScreen = () => {
  const [error, setError] = useState("");
  const [waitMessage, setWaitMessage] = useState(true);

  if(error !== ""){
    console.log(error);
  }

  useEffect(() => {
    socket.on("display-error", (error) => {
      setError(error);
      console.log(error = " . ERR");
      
    });

    socket.on("room-created", (id) => {
      setPlayerId(1);
      setRoomId(id);
    });

    socket.on("room-joined",id => {
      console.log("Room JOined");
      setPlayerId(2);
      setRoomId(id);
      setplayerOneConnected(true);
      setWaitMessage(false);
      console.log("JOINED");

    });

    socket.on("player-1-connected", () => {
      setplayerOneConnected(true);
      console.log("P ONE C");

    });

    socket.on("player-2-connected", () => {
      setplayerTwoIsConnected(true);
      setCanChoose(true);
      setWaitMessage(null);
      console.log("P TWO C");
      
    });

    socket.on("player-1-disconnected", () => {
      reset();
      console.log("P ONE D");
      
    });

    socket.on("player-2-disconnected", () => {
      setCanChoose(false);
      setplayerTwoIsConnected(false);
      setWaitMessage(true);
      setmyScorePoints(0);
      setenemyScorePoints(0);
      console.log("P TWO D");
      
    });

    socket.on("draw", (message) => {
      setWinningMessage(message);
      console.log("DRAW CALLED");
      
    });

    socket.on("player-1-wins", ({ myChoice, enemyChoice }) => {
      if (playerId === 1) {
        let message =
          "You choose " +
          myChoice +
          " and the enemy choose " +
          enemyChoice +
          " . So you win!";
        setWinningMessage(message);
        setmyScorePoints(myScorePoints+1);
        console.log("P ONE WINS");
        
      } else {
        let message =
          "You choose " +
          myChoice +
          " and the enemy choose " +
          enemyChoice +
          " . So you lose!";
        setWinningMessage(message);
        setenemyScorePoints(enemyScorePoints+1);
        console.log("P TWO WIN");
        
      }
    });

    socket.on("player-2-wins", ({ myChoice, enemyChoice }) => {
      if (playerId === 2) {
        let message =
          "You choose " +
          myChoice +
          " and the enemy choose " +
          enemyChoice +
          " . So you win!";
        setWinningMessage(message);
        setmyScorePoints(myScorePoints+1);
        console.log("P TWO WIN");

      } else {
        let message =
          "You choose " +
          myChoice +
          " and the enemy choose " +
          enemyChoice +
          " . So you lose!";
        setWinningMessage(message);
        setenemyScorePoints(enemyScorePoints + 1);
        console.log("P ONE WINS");

      }
    });
    // eslint-disable-next-line
  }, [socket]);

  const [canChoose, setCanChoose] = useState(false);
  const [playerOneConnected, setplayerOneConnected] = useState(false);
  const [playerTwoIsConnected, setplayerTwoIsConnected] = useState(false);
  const [myChoice, setMyChoice] = useState("");
  const [myScorePoints, setmyScorePoints] = useState(0);
  const [enemyScorePoints, setenemyScorePoints] = useState(0);
  const [roomId, setRoomId] = useState("");
  const [playerId, setPlayerId] = useState("");

  const [activeCh, setActiveCh] = useState("");


  const makeMove = (ch) => {
    if (
      canChoose &&
      myChoice === "" &&
      playerOneConnected &&
      playerTwoIsConnected
    ) {
      console.log("MAKE MOVE CALL");
      
      setMyChoice(ch);
      choose(myChoice);
      socket.emit("make-move", { playerId, myChoice, roomId });
    }
  };
  function choose(choice) {
    if (choice === "rock") {
      setActiveCh("rock");
      console.log("rock chosen");
      
    } else if (choice === "paper") {
      setActiveCh("paper");
      console.log("paper chosen");
      
    } else {
      setActiveCh("scissor");
      console.log("scissor chosen");
      
    }

    setCanChoose(false);
  }
  function removeChoice(choice) {
    console.log("REMOVE CHOICE CALL");
    
    setActiveCh("");
    canChoose(true);
    setMyChoice("");
  }

  const setWinningMessage = (message) => {
    console.log("WIN MSG CALL");
    
    console.log(message);

    setTimeout(() => {
        removeChoice(myChoice);
        console.log("Removing win message");
        
    }, 3000)
  };

  const reset = () => {
    setCanChoose(false);
    setplayerOneConnected(false);
    setplayerTwoIsConnected(false);
    setmyScorePoints(0);
    setenemyScorePoints(0);
    setWaitMessage(true);
  };

  return (
    <>
      {waitMessage ? (
        <div className="wait-status">
          <p>Waiting for another player to join...</p>
        </div>
      ) :<> </>}
      <div>
        <div className="connected-players">
          <div className="player">
            <span
              className={"dot " + playerOneConnected ? "connected" : " "}
              id="player-1"
            ></span>
            <span id="player-1-tag">
              {playerId === 1 ? "You (Player 1)" : "Enemy (Player 2)"}
            </span>
          </div>
          <div className="player">
            <span
              className={"dot " + playerTwoIsConnected ? "connected" : " "}
              id="player-2"
            ></span>
            <span id="player-2-tag">
              {playerId === 1 ? "Enemy (Player 2)" : "You (Player 1)"}
            </span>
          </div>

          <div className="score">
            <div>
              You : <span id="my-score"> 0 </span>
            </div>
            <div>
              Enemy : <span id="enemy-score"> 0 </span>
            </div>
          </div>
        </div>
        <div className="choices">
          <div className={"choice " + (activeCh === "rock" ? "active" : "")}>
            <img src={Rock} alt="rock" onClick={makeMove("rock")} />
            <p>ROCK</p>
          </div>
          <div className={"choice " + (activeCh === "paper" ? "active" : "")}>
            <img src={Paper} alt="paper" onClick={makeMove("paper")} />
            <p>PAPER</p>
          </div>
          <div className={"choice " + (activeCh === "sicssor" ? "active" : "")}>
            <img src={Scissors} alt="scissors" onClick={makeMove("scissor")} />
            <p>SCISSORS</p>
          </div>
        </div>
        <div className="message"></div>
      </div>
    </>
  );
};

export default GameplayScreen;
