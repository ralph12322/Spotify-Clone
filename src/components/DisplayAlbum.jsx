import React, { useContext, useEffect, useState } from 'react'
import Navbar from './Navbar'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets';
import { PlayerContext } from "../context/PlayerContext";

const DisplayAlbum = ({album}) => {

    const {id} = useParams();
    const [albumsData, setAlbumsData] = useState("");
    const { playWithId, albumData, songData } = useContext(PlayerContext);

    useEffect(() => {
      albumData.map((item, index) =>{
        if(item._id === id) {
          setAlbumsData(item);
        }
      } )
    }, [])

  return albumData ? (
    <>
      <Navbar/>
      <div className='mt-10 flex gap-8 flex-col md:flex-row md:items-end'>
        <img className='w-48 rounded' src = {albumsData.image} alt=''/>
        <div className='flex flex-col'>
          <p>Playlist</p>
          <h2 className='text-5xl font-bold mb-4 md:text-7xl'>{albumsData.name}</h2>
          <h4>{albumsData.desc}</h4>
          <p className='mt-1'>
            <img className='inline-block' src={assets.spotify_logo} alt=''/>
            <b> Spotnify </b>
            • 1,323,320 likes
            • <b> 50 songs, </b>
            about 2 hr 30 mins 
          </p>
        </div>
      </div>
      <div className='grid grid-cols-4 sm:grid-cols-2 mt-10 mb-4 pl-2 text-[#a7a7a7]'>
        <p><b className='mr-20'>#</b>Title</p>
        <p>Album</p>
        <p className='hidden sm:block'>Date Added</p>
        <img className='m-auto sm:block w-4' src={assets.clock_icon}/>
      </div>
      <hr/>
      {
        songData.filter((item) =>item.album === album.name ).map((item, index) => (
          <div onClick={() =>playWithId(item._id)} key={index} className='grid grid-cols-4 sm:grid-cols-2 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer'>
            <p className='text-white'>
              <b className='mr-4 text-[#a7a7a7]'>{index + 1}</b>
              <img className='inline w-10 mr-5' src={item.image} alt=''/>
              <b className='mr-4 text-white'>{item.name}</b>
            </p>
            <p className='text-[15px]'>{albumsData.name}</p>
            <p className='text-[15px] hidden sm:block'>5 days ago</p>
            <p className='text-[15px] text-center'>{item.duration}</p>
          </div>
        ))
      }
    </>
  ) : null
} 

export default DisplayAlbum
