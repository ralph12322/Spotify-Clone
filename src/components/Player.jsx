import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { PlayerContext } from '../context/PlayerContext'
import { useNavigate } from 'react-router-dom';

const Player = () => {

  const {isMini, mini, mute, play, pause, track, seekBar, seekBg, playStatus,time, seekSong, loopSong, loop, next, previous, shuff, shuffle, volume, volumeBar, handleVolumeChange} = useContext(PlayerContext);
  const navigate = useNavigate();

  return track ? (
    <div className='h-[10%] bg-black flex justify-between items-center text-white px-4 rounded'>
      <div className='hidden lg:flex items-center w-[15vw] gap-4 ml-15'>
        <img className='w-12' src={track.image} alt=''/>
        <div>
          <p>{track.name}</p>
        </div>
      </div>
      <div className='flex flex-col items-center gap-1 m-auto'>
        <div className='flex gap-4'>
          {
            shuffle ? <img onClick = {shuff} className='w-4 cursor-pointer' src={assets.shuffleOn} alt=''/>  : <img onClick = {shuff} className='w-4 cursor-pointer' src={assets.shuffle_icon} alt=''/>
          }
          <img onClick={previous} className='w-4 cursor-pointer' src={assets.prev_icon} alt=''/>
          {
            playStatus ? <img onClick={pause} className='w-4 cursor-pointer' src={assets.pause_icon} alt=''/> : <img onClick={play} className='w-4 cursor-pointer' src={assets.play_icon} alt=''/>
          }
          <img onClick={next} className='w-4 cursor-pointer' src={assets.next_icon} alt=''/>
          {
            loop ? <img onClick={loopSong} className='w-4 cursor-pointer' src={assets.loopOn_icon} alt=''/> : <img onClick={loopSong} className='w-4 cursor-pointer' src={assets.loop_icon} alt=''/>
          }
          
        </div>
        <div className='flex items-center gap-5'>
          <p>{time.currentTime.minute}:{time.currentTime.second}</p>
          <div onClick={seekSong} ref={seekBg} className='w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer'>
            <hr ref={seekBar} className='h-1 border-none w-1 bg-green-800 rounded-full'></hr>
          </div>
          <p>{time.totalTime.minute}:{time.totalTime.second}</p>
        </div>
      </div>
      <div className='hidden lg:flex items-center gap-2 opacity-75'>
        <img className='w-4' src={assets.plays_icon} alt=''/>
        <img className='w-4' src={assets.mic_icon} alt=''/>
        <img className='w-4' src={assets.queue_icon} alt=''/>
        <img className='w-4' src={assets.speaker_icon} alt=''/>
        <img onClick={mute} className='w-4 cursor-pointer' src={assets.volume_icon} alt=''/>
        <div className="flex items-center">
        <input
          ref={volumeBar}
          type="range"
          min="0"
          max="100"
          value={volume * 100}
          onChange={handleVolumeChange}
          className="w-full cursor-pointer accent-green-500"
        />
      </div>
        <img className='w-4' src={assets.mini_player_icon} alt=''/>
        {
  !mini ? (
    <img
      onClick={() => {
        navigate(`/player`);
        isMini();
      }}
      className="w-4 cursor-pointer"
      src={assets.zoom_icon}
      alt=""
    />
  ) : (
    <img
      onClick={() => {
        navigate(-1);
        isMini();
      }}
      className="w-4 cursor-pointer"
      src={assets.zoom_icon}
      alt=""
    />
  )
}


      </div>
    </div>
  ) : null
}

export default Player
