import { createContext, useEffect, useRef, useState } from "react";
import axios from 'axios'
import { url } from "../config/config";

export const PlayerContext = createContext();

// Move Playlist class ABOVE PlayerContextProvider function
class Playlist {
  constructor(songData) {
    this.originalOrder = [...songData]; // Keep the original order
    this.songData = [...songData];
    this.currentIndex = 0;
  }

  shuffle() {
    let array = [...this.originalOrder]; // Copy of the original array
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    this.songData = array; // Store shuffled playlist
    this.currentIndex = 0;
    return array;
  }

  current() {
    return this.songData[this.currentIndex];
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.songData.length;
    return this.songData[this.currentIndex];
  }

  previous() {
    this.currentIndex =
      (this.currentIndex - 1 + this.songData.length) % this.songData.length;
    return this.songData[this.currentIndex];
  }
}

const PlayerContextProvider = (props) => {

  const [songData, setSongData] = useState([]);
  const [albumData, setAlbumData] = useState([]);

  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();
  
  const playlistRef = useRef(new Playlist(songData)); // Store the playlist instance

  const [track, setTrack] = useState(songData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [loop, setLoop] = useState(false);
  const [kalagayan, setKalagayan] = useState(false);
  const [shuffledSongs, setShuffledSongs] = useState([]);
  const [shuffle, setShuffle] = useState(false);
  const [search, setSearch] = useState(false);
  const [songName, setSongName] = useState("");
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  const isFirstRender = useRef(true);
  const [playing, setPlaying] = useState(false);


  const getSongData = async () =>{
    try {
      const response = await axios.get(`${url}/api/song/list`);
      setSongData(response.data.songs);
      setTrack(response.data.songs[1])
    } catch (error) {
      
    }
  }

  const get = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      setAlbumData(response.data.albums)
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    getSongData();
    get();
  },[])

  const playWithId = async (id) => {
    await songData.map((item)=>{
      if(id === item._id){
        setTrack(item);
        }
    } )

    await audioRef.current.play();
    setPlayStatus(true);
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (playing && audioRef.current) {
      audioRef.current.play();
      setPlayStatus(true);
    }
  }, [track]); // Runs when track changes

  const shuff = () => {
    setShuffle((prev) => !prev); // Toggle shuffle mode
    if (kalagayan) {
      // If shuffle was enabled, disable it and reset the playlist to its original order
      playlistRef.current.songData = [...playlistRef.current.originalOrder];
      setKalagayan(false); // Turn off shuffle mode
    } else {
      // If shuffle is disabled, shuffle the playlist
      setShuffledSongs(playlistRef.current.shuffle()); // Shuffle and update state
      setKalagayan(true); // Turn on shuffle mode
    }
  };
  

  useEffect(() => {
    if (shuffledSongs.length > 0) {
      setTrack(shuffledSongs[0]);
      audioRef.current.play();
      setPlayStatus(true);
    }
  }, [shuffledSongs]);

  const loopSong = () => {
    setLoop((prev) => !prev);
  };

  const isSearch = () => {
    setSearch((prev) => !prev);
  };

  useEffect(() => {
    const audio = audioRef.current;

    const handleAudioEnd = async () => {
      setPlayStatus(false);
      if(track.id === 7){
        setTrack(songData[0]);
        console.log(shuffle);
      }
 
      if (loop) {
        setTrack(songData[track.id]);
        await audioRef.current.play();
        setPlayStatus(true);
      }
      
      if (shuffle){
        if(track.id === 7){
          setTrack(shuffledSongs[0]);
        }
        else{
          setTrack(shuffledSongs[track.id + 1])
          await audioRef.current.play();
          setPlayStatus(true);
        }
        
      }
    };

    if (audio) {
      audio.addEventListener("ended", handleAudioEnd);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("ended", handleAudioEnd);
      }
    };
  }, [audioRef, loop, playStatus, track]);

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  const previous = async () => {
    let nextTrack;

    songData.map((item, index)=> {
      if (kalagayan) {
   
        nextTrack = playlistRef.current.previous();
      } else {
        
        if (track._id === item._id && index > 0) {
          nextTrack = songData[index - 1];
        } else {
          nextTrack = songData[0];
        }
      }
    })
    
  
    await setTrack(nextTrack);
    await audioRef.current.play();
    setPlayStatus(true);
  };

  const next = async () => {
    let nextTrack;

    songData.map((item, index)=> {
      if (kalagayan) {
        nextTrack = playlistRef.current.next();
      } else {
        
        if (track._id === item._id && index < songData.length -1) {
          nextTrack = songData[index + 1]; 
          console.log(index);
          console.log(songData.length);
        }else{
          nextTrack = songData[1]
        }
      }  
    })
      await setTrack(nextTrack);
      await audioRef.current.play();
      setPlayStatus(true);
    
  };
  

  const seekSong = async (e) => {
    audioRef.current.currentTime =
      (e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration;
  };

  useEffect(() => {
    setTimeout(() => {
      audioRef.current.ontimeupdate = () => {
        seekBar.current.style.width =
          Math.floor((audioRef.current.currentTime / audioRef.current.duration) * 100) + "%";
        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60),
            minute: Math.floor(audioRef.current.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60),
            minute: Math.floor(audioRef.current.duration / 60),
          },
        });
      };
    }, 1000);
  }, [audioRef]);

  const contextValue = {
    audioRef,
    seekBg,
    seekBar,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    next,
    previous,
    seekSong,
    loopSong,
    loop,
    shuff,
    shuffle,
    isSearch,
    search,
    songName,
    setSongName,
    songData,
    albumData
  };

  return <PlayerContext.Provider value={contextValue}>{props.children}</PlayerContext.Provider>;
};

export default PlayerContextProvider;
