import React, { useContext } from 'react'
import { PlayerContext } from '../context/PlayerContext'
import Player from './Player'
import Navbar from './Navbar';

const ExpandedPlayer = () => {

  const {track} = useContext(PlayerContext);
  return (
    <div>
      <Navbar/>
      <img className='w-full h-full' src={track.image} alt=''/>
      <Player/>
    </div>
  )
}

export default ExpandedPlayer