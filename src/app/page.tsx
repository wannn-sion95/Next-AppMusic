"use client";

import { useState, useEffect } from "react";
import { songs } from "@/data/songs";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

// KOMPONEN UI
import Header from "@/components/Header"; // Header Baru
import HeroCarousel from "@/components/HeroCarousel"; // Carousel Baru
import TabSection from "@/components/TabSection";
import SongList from "@/components/SongList";
import Footer from "@/components/Footer";
import MiniPlayer from "@/components/MiniPlayer";
import FullPlayer from "@/components/FullPlayer";
import Toast from "@/components/Toast"; // Toast Notifikasi

export default function Home() {
  // --- 1. STATE MANAGEMENT ---
  const [searchTerm, setSearchTerm] = useState("");
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All Songs");

  // State untuk Toast Notifikasi
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // --- 2. HOOK AUDIO PLAYER (OTAK APLIKASI) ---
  const player = useAudioPlayer(songs);

  // --- 3. LOGIC FILTERING (SEARCH & TABS) ---
  const filteredSongs = songs.filter((song) => {
    // A. Filter berdasarkan Search Text
    const matchesSearch =
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase());

    // B. Filter berdasarkan Tab (Favorites)
    let matchesTab = true;
    if (activeTab === "Favorites") {
      matchesTab = player.likedSongs.includes(song.id);
    }

    return matchesSearch && matchesTab;
  });

  // Sinkronisasi Filtered Songs ke Playlist Player
  // Agar tombol Next/Prev mengikuti list yang sedang tampil
  useEffect(() => {
    player.setPlaylist(filteredSongs);
  }, [filteredSongs, player.setPlaylist]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- 4. WRAPPER FUNCTION UNTUK LIKE + TOAST ---
  const handleToggleLikeWithToast = () => {
    if (player.currentSong) {
      const isLiked = player.likedSongs.includes(player.currentSong.id);

      // Toggle Like di Logic
      player.toggleLike(player.currentSong.id);

      // Tampilkan Visual Toast
      setToastMsg(isLiked ? "Removed from Favorites" : "Added to Favorites");
      setShowToast(true);

      // Auto Hide setelah 2 detik
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  // --- 5. RENDER UI ---
  return (
    <main className="relative h-screen w-full flex flex-col bg-[#09090b]">
      {/* Background Aurora */}
      <div className="aurora-bg"></div>

      {/* HEADER BARU (Sticky & Floating) */}
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* TOAST NOTIFICATION (Muncul di atas player) */}
      <Toast message={toastMsg} isVisible={showToast} />

      {/* AREA KONTEN UTAMA (Scrollable) */}
      <div className="flex-1 overflow-y-auto scrollbar-hide pb-32 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          {" "}
          {/* Layout lebih lebar (7xl) */}
          {/* HERO CAROUSEL (Slider) */}
          {/* Hanya muncul jika tidak sedang search DAN di tab All Songs */}
          {!searchTerm && activeTab === "All Songs" && (
            <HeroCarousel songs={songs} onPlay={player.playSong} />
          )}
          {/* TAB SECTION */}
          <TabSection activeTab={activeTab} setActiveTab={setActiveTab} />
          {/* Empty State untuk Favorites */}
          {activeTab === "Favorites" && filteredSongs.length === 0 && (
            <div className="text-center py-20 text-white/40">
              <i className="ri-heart-broken-line text-4xl mb-4 block"></i>
              <p>No favorite songs yet.</p>
            </div>
          )}
          {/* GRID LAGU */}
          <SongList songs={filteredSongs} onPlay={player.playSong} />
          {/* FOOTER */}
          <Footer />
        </div>
      </div>

      {/* --- PLAYERS --- */}

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
        // Logic Like Diganti dengan Wrapper Toast
        isLiked={
          player.currentSong
            ? player.likedSongs.includes(player.currentSong.id)
            : false
        }
        onToggleLike={handleToggleLikeWithToast}
        // Fitur Shuffle & Repeat
        isShuffle={player.isShuffle}
        repeatMode={player.repeatMode}
        onToggleShuffle={player.toggleShuffle}
        onToggleRepeat={player.toggleRepeat}
      />
    </main>
  );
}
