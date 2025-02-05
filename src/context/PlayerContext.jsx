import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

// Move Playlist class ABOVE PlayerContextProvider function
class Playlist {
  constructor(songsData) {
    this.originalOrder = [...songsData]; // Keep the original order
    this.songsData = [...songsData];
    this.currentIndex = 0;
  }

  shuffle() {
    let array = [...this.originalOrder]; // Copy of the original array
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    this.songsData = array; // Store shuffled playlist
    this.currentIndex = 0;
    return array;
  }

  current() {
    return this.songsData[this.currentIndex];
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.songsData.length;
    return this.songsData[this.currentIndex];
  }

  previous() {
    this.currentIndex =
      (this.currentIndex - 1 + this.songsData.length) % this.songsData.length;
    return this.songsData[this.currentIndex];
  }
}

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();
  
  const playlistRef = useRef(new Playlist(songsData)); // Store the playlist instance

  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [loop, setLoop] = useState(false);
  const [kalagayan, setKalagayan] = useState(false);
  const [shuffledSongs, setShuffledSongs] = useState([]);
  const [shuffle, setShuffle] = useState(false);
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  const isFirstRender = useRef(true);
  const [playing, setPlaying] = useState(false);

  const playWithId = (id) => {
    playlistRef.current.currentIndex = id; // Update playlist index
    setTrack(playlistRef.current.current());
    setPlaying(true);
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
      playlistRef.current.songsData = [...playlistRef.current.originalOrder];
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

  useEffect(() => {
    const audio = audioRef.current;

    const handleAudioEnd = async () => {
      setPlayStatus(false);
      if(track.id === 7){
        setTrack(songsData[0]);
        console.log(shuffle);
      }
 
      if (loop) {
        setTrack(songsData[track.id]);
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
    if (kalagayan) {
   
      nextTrack = playlistRef.current.previous();
    } else {
      
      if (track.id - 1 < 1) {
        nextTrack = songsData[0]; 
      } else {
        nextTrack = songsData[track.id - 1];
      }
    }
  
    setTrack(nextTrack);
    await audioRef.current.play();
    setPlayStatus(true);
  };

  const next = async () => {
    let nextTrack;
    if (kalagayan) {
      // In shuffle mode, use the Playlist class to get the next track
      nextTrack = playlistRef.current.next();
    } else {
      // In non-shuffle mode, check if we are at the last track and wrap back to the first
      if (track.id + 1 >= songsData.length) {
        nextTrack = songsData[0]; // Wrap to the first track if at the end
      } else {
        nextTrack = songsData[track.id + 1];
      }
    }
  
    setTrack(nextTrack);
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
    shuffle
  };

  return <PlayerContext.Provider value={contextValue}>{props.children}</PlayerContext.Provider>;
};

export default PlayerContextProvider;
