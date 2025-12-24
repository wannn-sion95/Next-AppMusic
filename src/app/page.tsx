"use client";

import { useState, useEffect } from "react";
import { Song } from "@/types"; // Kita import Tipe datanya aja
// import { songs } from "@/data/songs"; <--- HAPUS INI (JANGAN IMPORT LANGSUNG LAGI)
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

// KOMPONEN UI
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import TabSection from "@/components/TabSection";
import SongList from "@/components/SongList";
import Footer from "@/components/Footer";
import MiniPlayer from "@/components/MiniPlayer";
import FullPlayer from "@/components/FullPlayer";
import Toast from "@/components/Toast";

export default function Home() {
  // --- STATE ---
  const [songs, setSongs] = useState<Song[]>([]); // State untuk nampung data dari Backend
  const [isLoading, setIsLoading] = useState(true); // State Loading
  const [searchTerm, setSearchTerm] = useState("");
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All Songs");

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Hook Player (Awalnya kosong, nanti diisi pas data dateng)
  const player = useAudioPlayer(songs);

  // --- 1. FETCH DATA DARI BACKEND (THE NEXT.JS WAY) ---
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("/api/songs"); // Request ke API kita sendiri
        const data = await response.json();
        setSongs(data); // Simpan data ke state
        player.setPlaylist(data); // Update playlist awal player
        setIsLoading(false); // Matikan loading
      } catch (error) {
        console.error("Gagal ambil lagu:", error);
        setIsLoading(false);
      }
    };

    fetchSongs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Jalan sekali pas web dibuka

  // --- LOGIC FILTERING ---
  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesTab = true;
    if (activeTab === "Favorites") {
      matchesTab = player.likedSongs.includes(song.id);
    }

    return matchesSearch && matchesTab;
  });

  // Sync Filter ke Player
  useEffect(() => {
    if (!isLoading) {
      player.setPlaylist(filteredSongs);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredSongs, isLoading]); // Hapus player.setPlaylist dari dependency biar gak loop

  const handleToggleLikeWithToast = () => {
    if (player.currentSong) {
      const isLiked = player.likedSongs.includes(player.currentSong.id);
      player.toggleLike(player.currentSong.id);
      setToastMsg(isLiked ? "Removed from Favorites" : "Added to Favorites");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  // --- LOADING SCREEN (SEMENTARA DATA DIAMBIL) ---
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#09090b] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-[#22c527] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="animate-pulse tracking-widest text-xs font-bold uppercase">
          Loading Library...
        </p>
      </div>
    );
  }

  // --- RENDER UTAMA ---
  return (
    <main className="relative h-screen w-full flex flex-col bg-[#09090b]">
      <div className="aurora-bg"></div>

      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Toast message={toastMsg} isVisible={showToast} />

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-32 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Carousel cuma muncul kalau data udah ada */}
          {!searchTerm && activeTab === "All Songs" && songs.length > 0 && (
            <HeroCarousel songs={songs} onPlay={player.playSong} />
          )}

          <TabSection activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === "Favorites" && filteredSongs.length === 0 && (
            <div className="text-center py-20 text-white/40">
              <i className="ri-heart-broken-line text-4xl mb-4 block"></i>
              <p>No favorite songs yet.</p>
            </div>
          )}

          <SongList songs={filteredSongs} onPlay={player.playSong} />
          <Footer />
        </div>
      </div>

      <MiniPlayer
        currentSong={player.currentSong}
        isPlaying={player.isPlaying}
        onPlayPause={player.togglePlay}
        onNext={player.handleNext}
        onPrev={player.handlePrev}
        onExpand={() => setIsPlayerOpen(true)}
      />

      <FullPlayer
        key={player.currentSong?.id || "empty"}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        currentSong={player.currentSong}
        isPlaying={player.isPlaying}
        onPlayPause={player.togglePlay}
        onNext={player.handleNext}
        onPrev={player.handlePrev}
        progress={player.progress}
        duration={player.duration}
        onSeek={player.handleSeek}
        volume={player.volume}
        onVolumeChange={player.handleVolumeChange}
        isLiked={
          player.currentSong
            ? player.likedSongs.includes(player.currentSong.id)
            : false
        }
        onToggleLike={handleToggleLikeWithToast}
        isShuffle={player.isShuffle}
        repeatMode={player.repeatMode}
        onToggleShuffle={player.toggleShuffle}
        onToggleRepeat={player.toggleRepeat}
      />
    </main>
  );
}
