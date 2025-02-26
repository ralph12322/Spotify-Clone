import React, { useContext } from 'react'
import { PlayerContext } from '../context/PlayerContext'
import Player from './Player'

const ExpandedPlayer = () => {

  const {track} = useContext(PlayerContext);
  return (
    <div>
      <img className='w-12' src={track.image} alt=''/>
      <Player/>
    </div>
  )
}

export default ExpandedPlayer