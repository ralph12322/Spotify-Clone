import React, { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";

const SongItem = ({image, name, desc, id}) => {
  
    const {playWithId} = useContext(PlayerContext)

  return(
    <div onClick={() => {
      playWithId(id)

    }} 
    className="min-w-[180px] p-2 px-3 rounded cursor-pointer center hover:bg-[#ffffff26] flex flex-col items-center text-center">
    <img className="rounded h-[125px]" src={image} alt=""/>
    <p className="font-bold mt-2 mb-1">{name}</p>    
    <p className="text-slate-200 text-sm">{desc}</p>
  </div>
  )
}

export default SongItem
