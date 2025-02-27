import React, { useContext } from 'react'
import { PlayerContext } from '../context/PlayerContext'
import Player from './Player'
import Navbar from './Navbar';

const ExpandedPlayer = () => {

  const {track} = useContext(PlayerContext);
  return (
    <div className='h-screen'>
      <Navbar/>
      <img className='w-[100%] h-[50%] rounded p-5' src={track.image} alt=''/>
      <Player/>
    </div>
  )
}

export default ExpandedPlayer