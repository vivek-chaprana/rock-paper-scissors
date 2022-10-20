import React, { useEffect, useState } from 'react'
import './App.css'
import StartScreen from './Components/StartScreen'
import GameplayScreen from './Components/GameplayScreen'
import socket from './Socket'

const App = () => {
  const [inRoom, setInRoom] = useState(false);
  useEffect(() => {
    socket.on("room-created",id => {
      setInRoom(true);
    })
    socket.on("room-joined",id => {
      setInRoom(true);
      
    })
    socket.on("player-1-disconnected", () => {
      setInRoom(false);
  })
  //eslint-disable-next-line
  },[socket])

  return (
    <>
    <MainHead />
   { inRoom ? <GameplayScreen /> : <StartScreen /> }
      
    </>
  )
}

const MainHead = () => {
  return <>
    <h1 className='main-heading'>Rock Paper Scissors</h1>
  </>
}

// Functions
export default App;