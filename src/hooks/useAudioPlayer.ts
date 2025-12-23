/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState, useRef, useEffect, useCallback } from "react";
import { Song } from "@/types";

type RepeatMode = "off" | "all" | "one";

export function useAudioPlayer(songs: Song[]) {
  // State Utama
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [likedSongs, setLikedSongs] = useState<number[]>([]);

  // State Shuffle & Repeat
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("all");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // NEW: Ref untuk menyimpan Playlist/Antrian yang sedang aktif
  // Defaultnya berisi semua lagu ('songs')
  const playlistRef = useRef<Song[]>(songs);

  // --- LOGIC FUNCTIONS ---

  // Fungsi untuk update playlist dari luar (tanpa re-render berlebih)
  const setPlaylist = useCallback((newPlaylist: Song[]) => {
    playlistRef.current = newPlaylist;
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      localStorage.setItem("volume", newVolume.toString());
    }
  }, []);

  const playSong = useCallback(
    (song: Song) => {
      if (!audioRef.current) return;
      if (currentSong?.id !== song.id) {
        audioRef.current.src = song.src;
        setCurrentSong(song);
        localStorage.setItem("lastSongId", song.id.toString());
      }
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error("Playback error:", e));
    },
    [currentSong]
  );

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // LOGIC NEXT (DINAMIS SESUAI TAB)
  const handleNext = useCallback(() => {
    if (!currentSong) return;

    // Gunakan playlist yang sedang aktif (Filtered / All)
    const currentList = playlistRef.current;

    // Kalau list kosong (misal favorites kosong), stop.
    if (currentList.length === 0) return;

    let nextIndex;
    if (isShuffle) {
      if (currentList.length === 1) {
        nextIndex = 0;
      } else {
        do {
          nextIndex = Math.floor(Math.random() * currentList.length);
        } while (currentList[nextIndex].id === currentSong.id);
      }
    } else {
      const currentIndex = currentList.findIndex(
        (s) => s.id === currentSong.id
      );

      // Kalau lagu yang lagi main TIDAK ADA di list saat ini (misal lagi main lagu pop, tapi user pindah ke tab 'Rock'),
      // maka lagu selanjutnya adalah lagu PERTAMA dari list 'Rock'.
      if (currentIndex === -1) {
        nextIndex = 0;
      } else {
        nextIndex = (currentIndex + 1) % currentList.length;
      }
    }

    playSong(currentList[nextIndex]);
  }, [currentSong, isShuffle, playSong]); // Hapus 'songs' dari dependency

  // LOGIC PREV (DINAMIS)
  const handlePrev = useCallback(() => {
    if (!currentSong) return;

    const currentList = playlistRef.current;
    if (currentList.length === 0) return;

    const currentIndex = currentList.findIndex((s) => s.id === currentSong.id);

    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    let prevIndex;
    if (currentIndex === -1) {
      prevIndex = 0;
    } else {
      prevIndex = (currentIndex - 1 + currentList.length) % currentList.length;
    }

    playSong(currentList[prevIndex]);
  }, [currentSong, playSong]);

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const toggleLike = (songId: number) => {
    setLikedSongs((prev) => {
      const newLiked = prev.includes(songId)
        ? prev.filter((id) => id !== songId)
        : [...prev, songId];
      localStorage.setItem("likedSongs", JSON.stringify(newLiked));
      return newLiked;
    });
  };

  const toggleShuffle = () => setIsShuffle(!isShuffle);

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  };

  // --- EFFECTS ---

  // 1. Init & Load Storage
  useEffect(() => {
    audioRef.current = new Audio();
    setTimeout(() => {
      const savedVol = localStorage.getItem("volume");
      if (savedVol) {
        const vol = parseFloat(savedVol);
        setVolume(vol);
        if (audioRef.current) audioRef.current.volume = vol;
      }

      const savedLikes = localStorage.getItem("likedSongs");
      if (savedLikes)
        try {
          setLikedSongs(JSON.parse(savedLikes));
        } catch (e) {
          console.error(e);
        }

      const lastSongId = localStorage.getItem("lastSongId");
      if (lastSongId) {
        const foundSong = songs.find((s) => s.id === parseInt(lastSongId));
        if (foundSong) {
          setCurrentSong(foundSong);
          if (audioRef.current) audioRef.current.src = foundSong.src;
        }
      }
    }, 0);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [songs]); // Dependensi songs hanya untuk init

  // 2. Audio Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const onEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === "all" || isShuffle) {
        handleNext();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [handleNext, repeatMode, isShuffle]);

  // 3. KEYBOARD SHORTCUTS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      const audio = audioRef.current;
      if (!audio) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          audio.paused
            ? (audio.play(), setIsPlaying(true))
            : (audio.pause(), setIsPlaying(false));
          break;
        case "ArrowRight":
          e.preventDefault();
          handleNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          handlePrev();
          break;
        case "KeyL":
          audio.currentTime = Math.min(
            audio.currentTime + 5,
            audio.duration || 0
          );
          break;
        case "KeyJ":
          audio.currentTime = Math.max(audio.currentTime - 5, 0);
          break;
        case "KeyM":
          handleVolumeChange(audio.volume > 0 ? 0 : 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          handleVolumeChange(Math.min(audio.volume + 0.1, 1));
          break;
        case "ArrowDown":
          e.preventDefault();
          handleVolumeChange(Math.max(audio.volume - 0.1, 0));
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleVolumeChange, handleNext, handlePrev]);

  // 4. Title
  useEffect(() => {
    if (currentSong) {
      document.title = isPlaying
        ? `▶ ${currentSong.title} - ${currentSong.artist}`
        : `${currentSong.title} - ${currentSong.artist}`;
    } else {
      document.title = "One Music";
    }
  }, [currentSong, isPlaying]);

  return {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    likedSongs,
    isShuffle,
    repeatMode,
    playSong,
    togglePlay,
    handleNext,
    handlePrev,
    handleSeek,
    handleVolumeChange,
    toggleLike,
    toggleShuffle,
    toggleRepeat,
    setPlaylist, // Export fungsi ini
  };
}
