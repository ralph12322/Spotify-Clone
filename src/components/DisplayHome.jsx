import React, { useContext } from 'react'
import Navbar from './Navbar'
import AlbumItem from './AlbumItem'
import SongItem from './SongItem'
import { PlayerContext } from '../context/PlayerContext'

const DisplayHome = () => {

  const {songData, albumData} = useContext(PlayerContext);
  return(
    <>
    <Navbar/>
    <div className='mb-4'>
      <h1 className='my-5 font-bold text-2xl'>Featured Charts</h1>
      <div className='flex overflow-auto'>
      {albumData.map((item, index)=>(<AlbumItem key={index} name={item.name} desc={item.desc} id={item._id} image={item.image}/>))} 
      </div>
    </div>
    <div className='mb-4'>
      <h1 className='my-5 font-bold text-2xl'>Today's Biggest Hits</h1>
      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 overflow-auto'>
      {songData.map((item, index)=>(<SongItem key={index} name={item.name} desc={item.desc} id={item._id} image={item.image}/>))} 
      </div>
    </div>
    </>
  )
}

export default DisplayHome