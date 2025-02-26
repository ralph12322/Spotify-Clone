import React from 'react'
import { PlayerContext } from '../context/PlayerContext'

const ExpandedPlayer = () => {

  const {track} = PlayerContext
  return (
    <div>
      <img className='w-12' src={track.image} alt=''/>
    </div>
  )
}

export default ExpandedPlayer