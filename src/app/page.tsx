/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { songs, Song } from "@/data/songs";
import AlbumCard from "@/components/AlbumCard";
import MiniPlayer from "@/components/MiniPlayer";
import FullPlayer from "@/components/FullPlayer";

export default function Home() {
  // --- 1. STATE & REF ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- 2. LOGIC FUNCTIONS ---
  const playSong = useCallback(
    (song: Song) => {
      if (!audioRef.current) return;
      if (currentSong?.id !== song.id) {
        audioRef.current.src = song.src;
        setCurrentSong(song);
      }
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error("Playback error:", e));
    },
    [currentSong]
  );

  const handleNext = useCallback(() => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    playSong(songs[nextIndex]);
  }, [currentSong, playSong]);

  const handlePrev = useCallback(() => {
    if (!currentSong) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong(songs[prevIndex]);
  }, [currentSong, playSong]);

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

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  // --- 3. EFFECTS ---

  // Random Song (Fix Cascading Render)
  useEffect(() => {
    const timer = setTimeout(() => {
      setFeaturedIndex(Math.floor(Math.random() * songs.length));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Init Audio
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };
    const onEnded = () => {
      handleNext();
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [handleNext]);

  // --- 4. RENDER UI ---
  return (
    <main className="relative h-screen w-full flex flex-col bg-[#09090b]">
      {/* Aurora Background */}
      <div className="aurora-bg"></div>

      {/* HEADER: Search & Title */}
      <div className="flex-none p-6 pt-10 z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              One Music
            </h1>
            <p className="text-white/50 text-sm">
              Listen the music and enjoy your day
            </p>
          </div>

          {/* Search Box */}
          <div className="glass-panel rounded-full px-4 py-2.5 flex items-center gap-2 w-full md:max-w-300px transition-all focus-within:border-white/40">
            <i className="ri-search-line text-white/50"></i>
            <input
              type="text"
              placeholder="Search songs, artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white placeholder-white/30 w-full"
            />
          </div>
        </div>
      </div>

      {/* CONTENT: Scrollable Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-32 px-6 z-10">
        <div className="max-w-5xl mx-auto">
          {/* HERO SECTION */}
          {!searchTerm && (
            <div className="mb-8">
              <div
                className="relative w-full h-90 md:h-100 rounded-3xl overflow-hidden group cursor-pointer shadow-2xl ring-1 ring-white/10"
                onClick={() => playSong(songs[featuredIndex])}
              >
                <img
                  src={songs[featuredIndex].cover}
                  alt="Hero"
                  className="w-full h-full object-cover object-center transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/50 to-transparent flex flex-col justify-center pl-6 md:pl-12">
                  <span className="text-[#22c527] text-[10px] md:text-sm font-bold tracking-widest mb-3 uppercase bg-black/60 w-fit px-3 py-1 rounded-full backdrop-blur-md border border-white/5">
                    Popular Now
                  </span>
                  <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight truncate max-w-[85%] drop-shadow-2xl">
                    {songs[featuredIndex].title}
                  </h2>
                  <p className="text-white/90 text-sm md:text-lg font-medium truncate max-w-[80%] mt-2">
                    {songs[featuredIndex].artist}
                  </p>
                </div>
                <div className="absolute right-6 bottom-4 md:right-10 md:bottom-10 w-12 h-12 md:w-16 md:h-16 bg-[#22c527] rounded-full flex items-center justify-center text-black opacity-100 md:opacity-0 group-hover:opacity-100 transition-all md:translate-y-4 group-hover:translate-y-0 shadow-[0_0_30px_rgba(34,197,39,0.6)] hover:scale-110">
                  <i className="ri-play-fill text-2xl md:text-3xl ml-1"></i>
                </div>
              </div>
            </div>
          )}

          {/* TAB SECTION */}
          <div className="flex items-center gap-6 mb-6 overflow-x-auto scrollbar-hide">
            <button className="text-white font-bold border-b-2 border-[#22c527] pb-1 whitespace-nowrap">
              All Songs
            </button>
            <button className="text-white/40 hover:text-white transition pb-1 whitespace-nowrap">
              Favorites
            </button>
            <button className="text-white/40 hover:text-white transition pb-1 whitespace-nowrap">
              Top Charts
            </button>
            <button className="text-white/40 hover:text-white transition pb-1 whitespace-nowrap">
              Genres
            </button>
          </div>

          {/* GRID LAYOUT */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredSongs.map((song) => (
              <AlbumCard
                key={song.id}
                data={song}
                onClick={() => playSong(song)}
              />
            ))}
          </div>

          {/* === FOOTER BARU === */}
          <footer className="mt-20 mb-10 text-center border-t border-white/5 pt-10">
            <h3 className="text-[#22c527] font-extrabold text-lg tracking-tight mb-2">
              ONE MUSIC
            </h3>
            <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">
              Experience the future of music streaming with immersive audio and
              clean design.
            </p>
            <div className="flex justify-center gap-6 text-white/60 mb-8">
              <i className="ri-github-fill text-xl hover:text-white transition cursor-pointer"></i>
              <i className="ri-twitter-x-fill text-xl hover:text-white transition cursor-pointer"></i>
              <i className="ri-instagram-fill text-xl hover:text-white transition cursor-pointer"></i>
              <i className="ri-linkedin-fill text-xl hover:text-white transition cursor-pointer"></i>
            </div>
            <p className="text-white/20 text-xs">
              &copy; 2025 Created
              by{" "}
              <span className="text-white/60 hover:text-[#22c527] transition font-bold cursor-pointer">
                Wannn Sion
              </span>
            </p>
          </footer>
        </div>
      </div>

      {/* PLAYERS */}
      <MiniPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={togglePlay}
        onNext={handleNext}
        onPrev={handlePrev}
        onExpand={() => setIsPlayerOpen(true)}
      />

      <FullPlayer
        key={currentSong?.id || "empty"}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={togglePlay}
        onNext={handleNext}
        onPrev={handlePrev}
        progress={progress}
        duration={duration}
        onSeek={handleSeek}
      />
    </main>
  );
}
