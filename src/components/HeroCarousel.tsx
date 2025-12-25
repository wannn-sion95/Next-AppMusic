/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { Song } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface HeroCarouselProps {
  songs: Song[];
  onPlay: (song: Song) => void;
}

export default function HeroCarousel({ songs, onPlay }: HeroCarouselProps) {
  // Ambil 5 lagu pertama saja untuk carousel
  const featuredSongs = songs.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto Slide setiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredSongs.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredSongs.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredSongs.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + featuredSongs.length) % featuredSongs.length
    );
  };

  const currentSong = featuredSongs[currentIndex];

  return (
    <div className="relative w-full h-75 md:h-95 mb-8 group">
      {/* AREA GAMBAR & ANIMASI */}
      <div className="relative w-full h-full rounded-[40px] overflow-hidden shadow-2xl border border-white/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSong.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <img
              src={currentSong.cover}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent"></div>
          </motion.div>
        </AnimatePresence>

        {/* CONTENT TEXT (DI ATAS GAMBAR) */}
        <div className="absolute inset-0 flex flex-col justify-center pl-8 md:pl-16 z-10">
          <motion.div
            key={`text-${currentSong.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-[#22c527] text-black text-xs font-bold tracking-widest mb-4 uppercase">
              Popular Now
            </span>
            <h2 className="text-2xl md:text-6xl font-black text-white mb-2 tracking-tight max-w-2xl leading-none drop-shadow-lg">
              {currentSong.title}
            </h2>
            <p className="text-white/80 text-l md:text-2xl font-medium mb-8">
              {currentSong.artist}
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => onPlay(currentSong)}
                className="px-4 py-2 bg-[#22c527] hover:bg-[#1fbd24] text-black font-bold rounded-full transition transform hover:scale-105 flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,39,0.4)]"
              >
                <i className="ri-play-fill text-xs"></i> Listen Now
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* NAVIGATION BUTTONS (Arrows) - Muncul pas hover */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 z-20"
      >
        <i className="ri-arrow-left-s-line text-2xl"></i>
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 z-20"
      >
        <i className="ri-arrow-right-s-line text-2xl"></i>
      </button>

      {/* DOT INDICATORS (Titik-titik bawah) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {featuredSongs.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-8 bg-[#22c527]"
                : "w-2 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
