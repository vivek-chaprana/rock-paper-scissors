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
  const [message,  setMessage] = useState("");

  useEffect(() => {
    socket.on("display-error", (error) => {
      setError(error);
    });

    socket.on("room-created", (id) => {
      console.log("room-created from app js");
      setInRoom(true);
      setPlayerId(1);
      setRoomId(id);
    });

    socket.on("room-joined", (id) => {
      setInRoom(true);
      setPlayerId(2);
      setRoomId(id);
      setplayerOneConnected(true);
      setWaitMessage(false);
    });
    socket.on("player-1-connected", () => {
      setplayerOneConnected(true);
    });
    socket.on("player-2-connected", () => {
      setplayerTwoIsConnected(true);
      setCanChoose(true);
      setWaitMessage(null);
    });

    socket.on("player-1-disconnected", () => {
      setInRoom(false);
      reset();
    });
    socket.on("player-2-disconnected", () => {
      setCanChoose(false);
      setplayerTwoIsConnected(false);
      setWaitMessage(true);
      setmyScorePoints(0);
      setenemyScorePoints(0);
    });
    socket.on("draw", (message) => {
      setWinningMessage(message);
    });

    socket.on("player-1-wins", (obj) => {
      const p1Ch = obj.playerOneChoice;
      const p2Ch = obj.playerTwoChoice;
      if (playerId === 1) {
        let message = `You choose ${p1Ch} and the enemy choose ${p2Ch} . So you win!`;
        setWinningMessage(message);
        setmyScorePoints(myScorePoints + 1);
        console.log("You (P1) Won.");
      } else {
        let message = `You choose ${p2Ch} and the enemy choose ${p1Ch} . So you lose!`;
        setWinningMessage(message);
        setenemyScorePoints(enemyScorePoints + 1);
        console.log("You (P2) lost.");
      }
    });

    socket.on("player-2-wins", (obj) => {
      const p1Ch = obj.playerOneChoice;
      const p2Ch = obj.playerTwoChoice;
      if (playerId === 2) {
        let message = `You choose ${p2Ch} and the enemy choose ${p1Ch} . So you win!`;
        setWinningMessage(message);
        setmyScorePoints(myScorePoints + 1);
        console.log("You (P2) Won.");
      } else {
        let message = `You choose ${p1Ch} and the enemy choose ${p2Ch} . So you lose!`;
        setWinningMessage(message);
        setenemyScorePoints(enemyScorePoints + 1);
        console.log("You (P1) lost.");
      }
    });
    return () => {
      socket.off("display-error");
      socket.off("room-created");
      socket.off("room-joined");
      socket.off("player-1-connected");
      socket.off("player-2-connected");
      socket.off("player-1-disconnected");
      socket.off("player-2-disconnected");
      socket.off("draw");
      socket.off("player-1-wins");
      socket.off("player-2-wins");
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
    console.log(`
  ${canChoose} : canChooose,
  ${myChoice} : myChoice,
  ${playerOneConnected} : playerOneConnected,
  ${playerTwoIsConnected} : playerTwoIsConnected
  `);
  setMessage("Waiting for opponent to make a move ... ")

    if (
      canChoose &&
      myChoice === "" &&
      playerOneConnected &&
      playerTwoIsConnected
    ) {

      if (ch === 1) {
        setMyChoice("rock");
        setCanChoose(false);
        setActiveCh("rock")
        const obj = { playerId, ch, roomId };
        socket.emit("make-move", obj);
      } else if (ch === 2) {
        setMyChoice("paper");
        setCanChoose(false);
        setActiveCh("paper")
        const obj = { playerId, ch, roomId };
        socket.emit("make-move", obj);
      } else {
        setMyChoice("scissor");
        setCanChoose(false);
        setActiveCh("scissor")
        const obj = { playerId, ch, roomId };
        socket.emit("make-move", obj);
      }
    }
  };
  function removeChoice(choice) {
    console.log("REMOVE CHOICE CALL");
    setActiveCh("");
    setCanChoose(true);
    setMyChoice("");
  }

  const setWinningMessage = (message) => {
    setMessage(message)
    setTimeout(() => {
      removeChoice(myChoice);
      console.log("Removing win message");
    }, 5000);
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
        <div className="bg-light pt-5">
          {waitMessage ? (
            <div className="wait-status text-center py-3 ">
              <p className="fs-6 text-black fade-in">
                Waiting for another player to join...
              </p>
              <div class="spinner-border spinner-border-sm" role="status"></div>
            </div>
          ) : null}
          <div className="w-75 mx-auto ">
            <div className="connected-players">
              <div className="d-flex justify-content-center">
                <div className="player pe-3 border-end">
                  <div
                    className={
                      playerOneConnected
                        ? "spinner-grow spinner-grow-sm text-success"
                        : "spinner-grow spinner-grow-sm text-danger"
                    }
                    role="status"
                  ></div>
                  <span className="ps-2" id="player-1-tag">
                    {playerId === 1 ? "You (Player 1)" : "Enemy (Player 2)"}
                  </span>
                </div>
                <div className="player ps-3 border-start">
                  <span
                    className={
                      playerTwoIsConnected
                        ? "spinner-grow spinner-grow-sm text-success"
                        : "spinner-grow spinner-grow-sm text-danger"
                    }
                    role="status"
                    id="player-2"
                  ></span>
                  <span className="ps-2" id="player-2-tag">
                    {playerId === 1 ? "Enemy (Player 2)" : "You (Player 1)"}
                  </span>
                </div>
              </div>

              <div className="score d-flex justify-content-center">
                <div className="pe-3 border-end">
                  You : <span id="my-score"> {myScorePoints} </span>
                </div>
                <div className="ps-3 border-start">
                  Enemy : <span id="enemy-score"> {enemyScorePoints} </span>
                </div>
              </div>
            </div>
            <div className="choices row mt-5">
              <div
                id="rock"
                className={
                  (activeCh === "rock") ? "active-rock col text-center" : (activeCh === "" || null || undefined) ? "col text-center" : "col text-center not-active"
                }
                onClick={() => makeMove(1)}
              >
                <div className="p-3 rounded-circle border">
                  <img src={Rock} alt="rock" />
                </div>
                <p className="fw-bolder">ROCK</p>
              </div>
              <div
                id="paper"
                className={
                  (activeCh === "paper") ? "active-paper col text-center" : (activeCh === "" || null || undefined) ? "col text-center" : "col text-center not-active"
                }
                onClick={() => makeMove(2)}
              >
                <div className="p-3 rounded-circle border">
                  <img className="" src={Paper} alt="paper" />
                </div>
                <p className="fw-bolder">PAPER</p>
              </div>
              <div
                id="scissors"
                className={
                  (activeCh === "scissor") ? "active-scissor col text-center" : (activeCh === "" || null || undefined) ? "col text-center" : "col text-center not-active"
                }
                onClick={() => makeMove(3)}
              >
                <div className="p-3 rounded-circle border">
                  <img src={Scissors} alt="scissors" />
                </div>
                <p className="fw-bolder">SCISSORS</p>
              </div>
            </div>
            {
              (message === "" || null || undefined || false )? null :
            <div className="py-4 message text-center w-100">
             <p className="fw-normal fs-5">{message}</p> 
            </div>
            }
          </div>
        </div>
      ) : (
        <div className="start-screen bg-light">
          <div className="d-flex justify-content-center pt-5 pb-3">
            <div className="mx-3">
              <button
                className="btn btn-outline-success"
                onClick={createRoomClicked}
              >
                Create Room
              </button>
            </div>
            <div className="mx-3">
              <button
                className="btn btn-outline-success"
                onClick={joinRoomClicked}
              >
                Join Room
              </button>
            </div>
          </div>
          <div>
            <div
              className="create-room-box "
              style={{ display: createRoom ? "block" : "none" }}
            >
              <div className="form-floating d-flex justify-content-center mx-auto w-75 ">
                <input
                  className="form-control"
                  placeholder="Enter a new room id"
                  type="text"
                  name="roomId"
                  id="roomId"
                  value={roomId}
                  onChange={(event) => {
                    setRoomId(event.target.value);
                  }}
                />
                <label htmlFor="roomId">Enter a Room ID</label>
                <button
                  className="btn btn-outline-primary ms-2 px-3"
                  onClick={() => {
                    socket.emit("create-room", roomId);
                  }}
                >
                  Create
                </button>
              </div>
              <div className="d-flex justify-content-center mt-3 mb-5">
                <button
                  className="cancel-action btn btn-outline-warning px-4 py-2 fs-6"
                  onClick={() => setCreateRoom(false)}
                >
                  Cancel
                </button>
              </div>
              <div className="details"></div>
            </div>

            <div
              className="join-room-box"
              style={{ display: joinRoom ? "block" : "none" }}
            >
              <div className="join-with-id">
                <div className="form-floating d-flex justify-content-center mx-auto w-75 ">
                  <input
                    className="form-control"
                    placeholder="Enter Room ID"
                    name="join-room-input"
                    type="text"
                    id="join-room-input"
                    value={roomId}
                    onChange={(event) => {
                      setRoomId(event.target.value);
                    }}
                  />
                  <label htmlFor="join-room-input">Enter Room ID</label>
                  <button
                    id="join-room-btn"
                    className="btn btn-outline-primary ms-2 px-4"
                    onClick={() => {
                      socket.emit("join-room", roomId);
                    }}
                  >
                    Join
                  </button>
                </div>
                <div className="d-flex justify-content-center my-3">
                  <button
                    id="cancel-join-action"
                    className="btn btn-outline-warning px-4 py-2 fs-6"
                    onClick={() => setJoinRoom(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-outline-primary px-3 mb-3"
                  id="join-random"
                  onClick={() => {
                    socket.emit("join-random");
                  }}
                >
                  Join Random
                </button>
                <br />
              </div>
            </div>
            {error === "" ? null : (
              <div className="error w-75 py-3 bg-danger mx-auto rounded">
                <div
                  className="w-100 pe-3 d-flex justify-content-end text-white"
                  onClick={() => setError("")}
                >
                  x
                </div>
                <p className="fs-5 text-white text-center">{error}</p>
              </div>
            )}
          </div>
          <div className="msg text-center mt-2 mb-4">
            <p className="fs-4 fw-normal ">
              Join or Create a Room to play the game.
            </p>
          </div>
          <Rules />
        </div>
      )}
    </>
  );
};
const MainHead = () => {
  return (
    <>
      <h1 className="main-heading text-center pt-2 mb-0 bg-light">
        Rock Paper Scissors
      </h1>
    </>
  );
};

const Rules = () => {
  return (
    <div className="rules w-75 mx-auto">
      <div className="ms-2 me-auto">
        <div className="fw-bolder fs-5">Rock paper Scissors</div>
        <p>
          Rock Paper Scissors is a zero sum game that is usually played by two
          people using their hands and no tools. The idea is to make shapes with
          an outstretched hand where each shape will have a certain degree of
          power and will lead to an outcome.
        </p>
      </div>
      <div className="fw-bolder fs-5">
        What are the shapes of Rock Paper Scissors?
      </div>
      <div className="row text-center">
        <div className="col">
          <div className="">
            <img
              src={Rock}
              alt="rock"
              className="img-thumbnail rounded p-2 bg-transparent"
            />
          </div>
          <p className="fw-bolder">ROCK</p>
          <p>
            The rock is when you place your hand into the form of a simple fist.
          </p>
        </div>
        <div className="col">
          <div className="">
            <img
              src={Paper}
              alt="paper"
              className="img-thumbnail rounded p-2 bg-transparent"
            />
          </div>
          <p className="fw-bolder">PAPER</p>
          <p>
            The paper is when you place your hand in an outstretched position.
          </p>
        </div>
        <div className="col">
          <div className="">
            <img
              src={Scissors}
              alt="scissors"
              className="img-thumbnail rounded p-2 bg-transparent"
            />
          </div>
          <p className="fw-bolder">SICSSORS</p>
          <p>
            This is when you hold your fist with your index and middle finger
            pointing outwards in a V shape.
          </p>
        </div>
      </div>
      <div className="ms-2 me-auto">
        <div className="fw-bolder fs-5">Why is Rock Paper Scissors played?</div>
        <p>
          This game is played by children and adults and is popular all over the
          world. Apart from being a game played to pass time, the game is
          usually played in situations where something has to be chosen. It is
          similar in that way to other games like flipping the coin, throwing
          dice or drawing straws. There is no room for cheating or for knowing
          what the other person is going to do so the results are usually very
          satisfying with no room for fighting or error.
        </p>
      </div>
      <div className="ms-2 me-auto">
        <div className="fw-bolder fs-5">What are the rules of RPS?</div>
        <p>
          Although the game has a lot of complexity to it, the rules to play it
          are pretty simple.
        </p>
        <p>
          The game is played where players deliver hand signals that will
          represent the elements of the game; rock, paper and scissors. The
          outcome of the game is determined by 3 simple rules:
        </p>
        <ul>
          <li>Rock wins against scissors.</li>
          <li>Scissors win against paper.</li>
          <li>Paper wins against rock.</li>
        </ul>
      </div>
    </div>
  );
};

// Functions
export default App;
