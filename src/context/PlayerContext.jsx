import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { url } from "../config/config";

export const PlayerContext = createContext();

class Playlist {
  constructor(songData) {
    this.originalOrder = [...songData];
    this.songData = [...songData];
    this.currentIndex = 0;
  }

  shuffle() {
    this.songData = [...this.originalOrder].sort(() => Math.random() - 0.5);
    this.currentIndex = 0;
    return this.songData;
  }

  current() {
    return this.songData[this.currentIndex];
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.songData.length;
    return this.songData[this.currentIndex];
  }

  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.songData.length) % this.songData.length;
    return this.songData[this.currentIndex];
  }
}

const PlayerContextProvider = ({ children }) => {
  const [songData, setSongData] = useState([]);
  const [albumData, setAlbumData] = useState([]);
  const [track, setTrack] = useState(null);
  const [playStatus, setPlayStatus] = useState(false);
  const [loop, setLoop] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [shuffledSongs, setShuffledSongs] = useState([]);
  const [time, setTime] = useState({ currentTime: { second: 0, minute: 0 }, totalTime: { second: 0, minute: 0 } });
  const [search, setSearch] = useState(false);
  const [mini, setMini] = useState(false);
  const [albumSongs, setAlbumSongs] = useState(new Playlist([]));
  const [albumActive, setAlbumActive] = useState(false);
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();
  const playlistRef = useRef(new Playlist([]));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songsRes, albumsRes] = await Promise.all([
          axios.get(`${url}/api/song/list`),
          axios.get(`${url}/api/album/list`),
        ]);
        setSongData(songsRes.data.songs);
        setAlbumData(albumsRes.data.albums);
        setTrack(songsRes.data.songs[0]);
        playlistRef.current = new Playlist(songsRes.data.songs);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const playAlbum = () => {
    if (albumSongs instanceof Playlist && albumSongs.songData.length > 0) {
      setAlbumActive(true);
      setTrack(albumSongs.current());
    } else {
      console.error("AlbumSongs is not a valid playlist:", albumSongs);
    }
  };  
  
  useEffect(() => {
    if (albumActive && track) {
      play();
    }
  }, [track]); // Auto-play when track changes
  

  const play = async () => {
    if (audioRef.current) {
      await audioRef.current.play();
      setPlayStatus(true);
    }
  };
  
  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayStatus(false);
    }
  };
  
  const playWithId = async (id) => {
    const song = songData.find((item) => item._id === id);
    if (song) {
      setTrack(song);
      await play();
    };
  }; // <-- This was missing
  
  const shuff = () => {
    setShuffle((prev) => {
      if (!prev) {
        setShuffledSongs(playlistRef.current.shuffle());
      } else {
        setShuffledSongs([]); // Reset shuffled list
      }
      return !prev;
    });
  };
  

  useEffect(() => {
    if (shuffledSongs.length > 0) {
      setTrack(shuffledSongs[0]);
    }
  }, [shuffledSongs]);

  const handleAudioEnd = async () => {
    setPlayStatus(false);
  
    if (loop) {
      await play();
      return;
    }
  
    if (albumActive) {
      setTrack(albumSongs.next());  // Move to next track in album
      await play();
      return;
    }    
  
    if (shuffle && shuffledSongs.length > 0) {
      const currentIndex = shuffledSongs.findIndex((item) => item._id === track._id);
      setTrack(shuffledSongs[(currentIndex + 1) % shuffledSongs.length]);
      await play();
      return;
    }
  
    // Default to the next track in the main song list
    const currentIndex = songData.findIndex((item) => item._id === track._id);
    setTrack(songData[(currentIndex + 1) % songData.length]);
    await play();
  };  

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleAudioEnd);
      audioRef.current.ontimeupdate = () => {
        const currentTime = audioRef.current.currentTime;
        const duration = audioRef.current.duration;
        setTime({
          currentTime: {
            second: Math.floor(currentTime % 60),
            minute: Math.floor(currentTime / 60),
          },
          totalTime: {
            second: Math.floor(duration % 60),
            minute: Math.floor(duration / 60),
          },
        });
        seekBar.current.style.width = `${(currentTime / duration) * 100}%`;
        seekBar.current.style.backgroundColor = "#323232";
      };
      return () => audioRef.current.removeEventListener("ended", handleAudioEnd);
    }
  }, [track, loop, shuffle]);

  const volumeBar = useRef(null);
  const [volume, setVolume] = useState(1); // Default volume (100%)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume; // Set initial volume
    }
  }, [volume]); // Update whenever `volume` changes

  const next = async () => {
    if (albumActive) {
      setTrack(albumSongs.next());
    } else {
      setTrack(shuffle ? playlistRef.current.next() : songData[(songData.indexOf(track) + 1) % songData.length]);
    }
    await play();
  };  

  const previous = async () => {
    if (albumActive) {
      setTrack(albumSongs.previous());
    } else {
      setTrack(shuffle ? playlistRef.current.previous() : songData[(songData.indexOf(track) - 1 + songData.length) % songData.length]);
    }
    await play();
  };  

  const mute = () => {
    setVolume(0);
    if (audioRef.current) {
      audioRef.current.volume = 0;
    }
  };  

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
    seekSong: (e) => {
      audioRef.current.currentTime = (e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration;
    },
    loopSong: () => setLoop((prev) => !prev),
    shuffle,
    shuff,
    songData,
    albumData,
    loop,
    isSearch: () => setSearch((prev) => !prev),
    search,
    handleVolumeChange: (e) => {
      const newVolume = e.target.value / 100; // Convert 0-100 range to 0-1
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
    },
    volume,
    volumeBar,
    mute,
    mini,
    isMini: () => setMini((prev) => !prev),
    albumSongs,
    setAlbumSongs,
    albumActive,
    setAlbumActive,
    playAlbum
  };

  return <PlayerContext.Provider value={contextValue}>{children}</PlayerContext.Provider>;
};

export default PlayerContextProvider
