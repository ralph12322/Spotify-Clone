import React, { useContext } from 'react'
import SideBar from './components/sidebar'
import Player from './components/Player'
import Display from './components/Display'
import { PlayerContext } from './context/PlayerContext'

const App = () => {

  const {mini, audioRef, track, songData } = useContext(PlayerContext)

  return (
    <div className='h-screen bg-black'>
      {
        songData.length !== 0
          ? <>
            <div className='h-[90%] flex'>
              <SideBar />
              <Display />
            </div>
            {
              !mini ? <Player /> : null
            }

          </>
          : null
      }
      <audio ref={audioRef} src={track ? track.file : ""} preload='auto'></audio>
    </div>
  )
}

export default App
