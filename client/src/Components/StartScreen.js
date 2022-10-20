import React, { useEffect, useState } from 'react';
import socket from '../Socket'


const StartScreen = () => {
    const [error, setError] = useState("");


    useEffect(() => {
        
        socket.on("display-error", error => {
            setError(error);
    })
        }, [socket])

    const [createRoom, setCreateRoom] = useState(false);
    const [joinRoom, setJoinRoom] = useState(false);

    const [roomId, setRoomId] = useState("");

    const createRoomClicked = () => {
        setCreateRoom(!createRoom);
        setJoinRoom(false);
    }
    const joinRoomClicked = () => {
        setJoinRoom(!joinRoom);
        setCreateRoom(false);
    }





  return (
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
        <div className="create-room-box"  style={{display: createRoom ? "block" : "none"}}>
            <input type="text" name="roomId" id="roomId" value={roomId} onChange={(event) => {setRoomId(event.target.value)}} /> 
            <button onClick={() => {socket.emit("create-room",roomId)}}>Create</button>
            <button className='cancel-action'>Cancel</button>
        </div>
        
        <div className="join-room-box" style={{display: joinRoom ? "block" : "none"}} >
            <div className="join-with-id">
                <input type="text" id="join-room-input" value={roomId} onChange={(event) => {setRoomId(event.target.value)}} />
                <button id="join-room-btn" onClick={() => {socket.emit("join-room", roomId)}}>Join</button>

                <button id="cancel-join-action" className="cancel-action">Cancel</button>
            </div>

            <button className="join-random" id="join-random" onClick={() => {socket.emit("join-random")}}>Join Random</button>
        </div>
        {error === "" ? null :
        <div classsName="error-message" id="error-message">
        <p>{error}</p>
        </div>
        }

    </div>

    </div>
  )
}

export default StartScreen