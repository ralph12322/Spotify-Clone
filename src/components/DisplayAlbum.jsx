import React, { useContext, useEffect, useState } from 'react'
import Navbar from './Navbar'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets';
import { PlayerContext } from "../context/PlayerContext";
import { Playlist } from '../context/PlayerContext';

const DisplayAlbum = ({album}) => {

    const {id} = useParams();
    const [albumsData, setAlbumsData] = useState("");
    const { playWithId, albumData, songData, albumSongs, setAlbumSongs, albumActive, setAlbumActive, playAlbum } = useContext(PlayerContext);

    useEffect(() => {
      albumData.map((item, index) =>{
        if(item._id === id) {
          setAlbumsData(item);
        }
      } )
      const filteredSongs = songData.filter((item) => item.album === album.name);
      setAlbumSongs(new Playlist(filteredSongs)); 
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
            • <b> {`${albumSongs.songData.length} Songs`} </b>
            about 2 hr 30 mins 
          </p>
        </div>
      </div>
      <div className='flex'>
        <img className='overflow-hidden w-[5rem] h-[5rem] bg-[hsl(0,0%,98.4%,0.2)] opacity-80 transition duration-300 ease-in-out hover:opacity-100 cursor-pointer' onClick={playAlbum} src={assets.playAlbum} alt="" />
      </div>
      <div className='w-full grid grid-cols-3 sm:grid-cols-5 mt-10 mb-4 pl-2 text-[#a7a7a7]'>
        <p><b className='p-1.5'>#</b></p>
        <p>Title</p>
        <p className='hidden sm:block'>Album</p>
        <p className='hidden sm:block'>Date Added</p>
        <img className='m-auto sm:block w-4' src={assets.clock_icon}/>
      </div>
      <hr/>
      {
        songData.filter((item) =>item.album === album.name ).map((item, index) => (
          <div onClick={() =>playWithId(item._id)} key={index} className='grid grid-cols-3 sm:grid-cols-5 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer'>
            <div className='flex items-center'>
               <b className='pr-1.5 text-[#a7a7a7]'>{index + 1}</b>
               <img className='h-10 w-10 ml-10 mr-5 hidden sm:block' src={item.image} alt='' />
            </div>

            <p className='text-white'>
              <b className='mr-4 text-white'>{item.name}</b>
            </p>
            <p className='text-[15px] hidden sm:block'>{albumsData.name}</p>
            <p className='text-[15px] hidden sm:block'>5 days ago</p>
            <p className='text-[15px] text-center'>{item.duration}</p>
          </div>
        ))
      }
    </>
  ) : null
} 

export default DisplayAlbum
