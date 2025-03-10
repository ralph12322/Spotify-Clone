import React from "react";
import { useNavigate } from "react-router-dom";

const AlbumItem = ({image, name, desc, id}) => {

    const navigate = useNavigate()

  return(
    <div onClick={()=>navigate(`/album/${id}`)} className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]">
      <div className='w-full flex items-center justify-center'>
        <img className="w-140 h-[200px] object-cover rounded-lg" src={image} alt=""/>
      </div>

      <p className="font-bold mt-2 mb-1">{name}</p>    
      <p className="text-slate-200 text-sm">{desc}</p>
    </div>
  )
}

export default AlbumItem
