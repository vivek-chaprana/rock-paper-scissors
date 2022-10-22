import React, { useEffect, useState } from "react";
import "./App.css";
import socket from "./Socket";
import Rock from "./Assets/rock.png";
import Paper from "./Assets/paper.png";
import Scissors from "./Assets/scissor.png";

const App = () => {
  //APP
  const [inRoom, setInRoom] = useState(false);
  //StartSCreen
  const [createRoom, setCreateRoom] = useState(false);
  const [joinRoom, setJoinRoom] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  //Gameplay
  const [waitMessage, setWaitMessage] = useState(true);
  // dinad
  const [canChoose, setCanChoose] = useState(false);
  const [playerOneConnected, setplayerOneConnected] = useState(false);
  const [playerTwoIsConnected, setplayerTwoIsConnected] = useState(false);
  const [myChoice, setMyChoice] = useState("");
  const [myScorePoints, setmyScorePoints] = useState(0);
  const [enemyScorePoints, setenemyScorePoints] = useState(0);
  const [playerId, setPlayerId] = useState(0);

  const [activeCh, setActiveCh] = useState("");

  useEffect(() => {
    socket.on("display-error", (error) => {
      setError(error);
      console.log((error = " . ERR"));
    });

    socket.on("room-created", (id) => {
      console.log("room-created from app js");
      setInRoom(true);
      console.log("RM CR");

      setPlayerId(1);
      setRoomId(id);
      console.log("playerId : " + playerId);

    });

    socket.on("room-joined", (id) => {
      console.log("room-joined from app js");
      setInRoom(true);
      console.log("Room JO");
      setPlayerId(2);
      setRoomId(id);
      setplayerOneConnected(true);
      setWaitMessage(false);
      console.log("JOINED");
      console.log("playerId : " + playerId);
      
    });
    socket.on("player-1-connected", () => {
      console.log("P ONE C");
      setplayerOneConnected(true);
    });
    socket.on("player-2-connected", () => {
      console.log("P TWO C");
      setplayerTwoIsConnected(true);
      setCanChoose(true);
      setWaitMessage(null);
    });

    socket.on("player-1-disconnected", () => {
      console.log("player-1 from app js");
      setInRoom(false);
      console.log("P ONE D");
      reset();
    });
    socket.on("player-2-disconnected", () => {
      console.log("P TWO D");
      setCanChoose(false);
      setplayerTwoIsConnected(false);
      setWaitMessage(true);
      setmyScorePoints(0);
      setenemyScorePoints(0);
    });
    socket.on("draw", (message) => {
      setWinningMessage(message);
      console.log("DRAW CALLED");
    });

    socket.on("player-1-wins", (obj) => {
      console.log("Playeeerrrrr id iz : " + playerId);
      const p1Ch = obj.playerOneChoice;
      const p2Ch = obj.playerTwoChoice;
      if(playerId === 1){
        let message = `You choose ${p1Ch} and the enemy choose ${p2Ch} . So you win!`
        setWinningMessage(message);
        setmyScorePoints(myScorePoints+1);
        console.log("You (P1) Won.")
      }else{
        let message = `You choose ${p2Ch} and the enemy choose ${p1Ch} . So you lose!`
        setWinningMessage(message);
        setenemyScorePoints(enemyScorePoints+1);
        console.log("You (P2) lost.")
      }
    });

    socket.on("player-2-wins", (obj) => {
      console.log("Playeeerrrrr id iz : " + playerId);
      const p1Ch = obj.playerOneChoice;
      const p2Ch = obj.playerTwoChoice;
      if(playerId === 2){
        let message = `You choose ${p2Ch} and the enemy choose ${p1Ch} . So you win!`
        setWinningMessage(message);
        setmyScorePoints(myScorePoints+1);
        console.log("You (P2) Won.")
      }else{
        let message = `You choose ${p1Ch} and the enemy choose ${p2Ch} . So you lose!`
        setWinningMessage(message);
        setenemyScorePoints(enemyScorePoints+1);
        console.log("You (P1) lost.")
      }
    });
    return () => {
      socket.off('display-error');
      socket.off('room-created');
      socket.off('room-joined');
      socket.off('player-1-connected');
      socket.off('player-2-connected');
      socket.off('player-1-disconnected');
      socket.off('player-2-disconnected');
      socket.off('draw');
      socket.off('player-1-wins');
      socket.off('player-2-wins');
    };

  });

  const createRoomClicked = () => {
    setCreateRoom(!createRoom);
    setJoinRoom(false);
  };
  const joinRoomClicked = () => {
    setJoinRoom(!joinRoom);
    setCreateRoom(false);
  };

  const makeMove = (ch) => {
    console.log("MAKE MOVE CALL 1");
    console.log(`
  ${canChoose} : canChooose,
  ${myChoice} : myChoice,
  ${playerOneConnected} : playerOneConnected,
  ${playerTwoIsConnected} : playerTwoIsConnected
  `);

    if (
      canChoose &&
      myChoice === "" &&
      playerOneConnected &&
      playerTwoIsConnected
    ) {
      console.log("MAKE MOVE CALL");
      console.log(ch + " :  ch");

      if (ch === 1) {
        setMyChoice("rock");
        choose("rock");
        const obj = {playerId, ch, roomId}
        console.log(obj)
        socket.emit("make-move", obj);
      } else if (ch === 2) {
        setMyChoice("paper");
        choose("paper");
        const obj = {playerId, ch, roomId}
        console.log(obj)
        socket.emit("make-move", obj);
      } else {
        setMyChoice("scissor");
        choose("scissor");
        const obj = {playerId, ch, roomId}
        console.log(obj)
        socket.emit("make-move", obj);
      }
      console.log(ch + " : ch");
      console.log("At last myChoice : " + myChoice);
    }
  };
  function choose(choice) {
    console.log("CHOOSE CALL");

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
    setCanChoose(true);
    setMyChoice("");
  }

  const setWinningMessage = (message) => {
    console.log("WIN MSG CALL");

    console.log(message);

    setTimeout(() => {
      removeChoice(myChoice);
      console.log("Removing win message");
    }, 3000);
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
      <MainHead />

      {inRoom ? (
        <>
          {waitMessage ? (
            <div className="wait-status">
              <p>Waiting for another player to join...</p>
            </div>
          ) : (
            <> </>
          )}
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
              <div
                className={"choice " + (activeCh === "rock" ? "active" : "")}
                onClick={() => makeMove(1)}
              >
                <img src={Rock} alt="rock" />
                <p>ROCK</p>
              </div>
              <div
                className={"choice " + (activeCh === "paper" ? "active" : "")}
                onClick={() => makeMove(2)}
              >
                <img src={Paper} alt="paper" />
                <p>PAPER</p>
              </div>
              <div
                className={"choice " + (activeCh === "sicssor" ? "active" : "")}
                onClick={() => makeMove(3)}
              >
                <img src={Scissors} alt="scissors" />
                <p>SCISSORS</p>
              </div>
            </div>
            <div className="message"></div>
          </div>
        </>
      ) : (
        <div className="start-screen">
          <div>
            <div>
              <button onClick={createRoomClicked}>Create Room</button>
            </div>
            <div>
              <button onClick={joinRoomClicked}>Join Room</button>
            </div>
          </div>
          <div>
            <div
              className="create-room-box"
              style={{ display: createRoom ? "block" : "none" }}
            >
              <input
                type="text"
                name="roomId"
                id="roomId"
                value={roomId}
                onChange={(event) => {
                  setRoomId(event.target.value);
                }}
              />
              <button
                onClick={() => {
                  socket.emit("create-room", roomId);
                }}
              >
                Create
              </button>
              <button className="cancel-action">Cancel</button>
            </div>

            <div
              className="join-room-box"
              style={{ display: joinRoom ? "block" : "none" }}
            >
              <div className="join-with-id">
                <input
                  type="text"
                  id="join-room-input"
                  value={roomId}
                  onChange={(event) => {
                    setRoomId(event.target.value);
                  }}
                />
                <button
                  id="join-room-btn"
                  onClick={() => {
                    socket.emit("join-room", roomId);
                  }}
                >
                  Join
                </button>

                <button id="cancel-join-action" className="cancel-action">
                  Cancel
                </button>
              </div>

              <button
                className="join-random"
                id="join-random"
                onClick={() => {
                  socket.emit("join-random");
                }}
              >
                Join Random
              </button>
            </div>
            {error === "" ? null : (
              <div classsName="error-message" id="error-message">
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
const MainHead = () => {
  return (
    <>
      <h1 className="main-heading">Rock Paper Scissors</h1>
    </>
  );
};

// Functions
export default App;
