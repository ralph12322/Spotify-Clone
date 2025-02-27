import React, { useContext } from 'react'
import { PlayerContext } from '../context/PlayerContext'
import Player from './Player'
import Navbar from './Navbar';

const ExpandedPlayer = () => {

  const {track} = useContext(PlayerContext);
  return (
    <div className='h-[100%] overflow-auto rounded'>
      <Navbar/>
      <img className='w-full h-[77vh] object-contain rounded p-5' src={track.image} alt=''/>
      <Player/>
    </div>
  )
}

export default ExpandedPlayer