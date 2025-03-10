import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import DisplayHome from './DisplayHome';
import { PlayerContext } from '../context/PlayerContext';

const SideBar = () => {
  
  const {mini, isMini, search, isSearch, songName, setSongName} = useContext(PlayerContext)
  const navigate = useNavigate();
  

  return (
    <div className='w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex'>
      <div className='bg-[#121212] h-[15%] rounded flex flex-col justify-around'>
          <div onClick={() => {
            navigate('/');
            if (mini) {
              isMini();
            }
            }}  className='flex items-center gap-3 pl-8'>
            <img className='w-6 cursor-pointer' src={assets.home_icon} alt = ""/>
            <p className='font-bold cursor-pointer'>Home</p> 
          </div>
          {
            search ? 
            <div className='flex items-center gap-3 pl-8'>
                    <img className='w-6 cursor-pointer' onClick={isSearch} src={assets.search_icon} alt = ""/>
                    <form>
                    <input className='text-black' type='text' value={songName} onChange={(e) => setSongName(e.target.value)}
                      placeholder="Enter song..."/>
                    </form>
                    </div>
             : <div className='flex items-center gap-3 pl-8'>
             <img className='w-6 cursor-pointer' onClick={isSearch} src={assets.search_icon} alt = ""/>
             <p className='font-bold' onClick={isSearch}>Search</p>
             </div>
          }
          
      </div>
      <div className='bg-[#121212] h-[85%] rounded'>
        <div className='p-4 flex item-center justify-between'>
          <div className='flex items-center gap-3'>
            <img className='w-8' src={assets.stack_icon} alt=''/>
            <p className='font-semibold'>Your Library</p>
          </div>
          <div className='flex items-center gap-3'>
            <img className='w-5' src= {assets.arrow_icon} alt=''/>
            <img className='w-5' src= {assets.plus_icon} alt=''/>
          </div>
        </div>
        <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4'>
          <h1>Create your first playlist</h1>
          <p className='font-light'>not yet done</p>
          <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>Create Playlist</button>
        </div>
        <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start gap-1 pl-4 mt-4'>
          <h1>Let's find some podcast to follow</h1>
          <p className='font-light'>it's not functionable</p>
          <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>Browse Podcast</button>
        </div>
      </div>
    </div>
  )
}

export default SideBar
