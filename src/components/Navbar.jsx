import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { PlayerContext } from '../context/PlayerContext';

const Navbar = () => {

  const navigate = useNavigate();
  const { isMini, mini } = useContext(PlayerContext);

  return(
    <>
    <div className='w-full flex justify-between items-center font-semibold'>
      <div className='flex items-center gap-2'>
        <img onClick={() => {
          navigate(-1);
          if (mini) {
            isMini();
          }
          }} className='w-8 bg-black p-2 rounded-2xl cursor-pointer' src={assets.arrow_left} alt=''/>
        <img onClick={() => {
          navigate(+1);
          if (!mini) {
            isMini();
          }
          }} className='w-8 bg-black p-2 rounded-2xl cursor-pointer' src={assets.arrow_right} alt=''/>
      </div>
      <div className='flex items-center gap-4'>
        <a href="https://spotify-admin-eta.vercel.app" target="_blank">ADD SONGS</a>
        <p className='bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer'>LMB crushie</p>
        <p className='bg-black py-1 px-3 rounded-2xl text-[15px] cursor-pointer'>Install App</p>
        <p className='bg-purple-500 text-black w-8 h-8 rounded-full flex items-center justify-center'>RS</p>
      </div>
    </div>
    <div className='flex items-center gap-2 mt-4'>
      <p className='bg-white text-black px-4 py-1 rounded-2xl cursor-pointer'>All</p>
      <p className='bg-black px-4 py-1 rounded-2xl cursor-pointer'>Music</p>
      <p className='bg-black px-4 py-1 rounded-2xl cursor-pointer'>Podcast</p>
    </div>
    </>
  )
}

export default Navbar
