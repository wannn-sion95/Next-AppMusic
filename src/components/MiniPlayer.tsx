/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Song } from "@/data/songs";
import { motion, AnimatePresence } from "framer-motion";

// INI BAGIAN YANG TADI HILANG (Definisi Tipe Data Props)
interface MiniPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev?: () => void; // Opsional
  onExpand: () => void;
}

export default function MiniPlayer({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onExpand,
}: MiniPlayerProps) {
  return (
    <AnimatePresence>
      {currentSong && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-400px z-50">
          <motion.div
            onClick={onExpand}
            // --- ANIMASI FRAMER MOTION DISINI ---
            initial={{ y: 100, opacity: 0, scale: 0.8 }} // Mulai dari bawah & transparan
            animate={{ y: 0, opacity: 1, scale: 1 }} // Muncul ke posisi normal
            exit={{ y: 100, opacity: 0, scale: 0.8 }} // Kalau hilang, turun ke bawah
            whileHover={{ scale: 1.02 }} // Membesar dikit pas di-hover
            whileTap={{ scale: 0.98 }} // Mengecil pas dipencet
            transition={{ type: "spring", stiffness: 400, damping: 25 }} // Efek pegas (membal)
            // ------------------------------------
            className="glass-floating rounded-full p-2 pr-5 flex items-center justify-between cursor-pointer"
          >
            {/* Kiri: Cover Putar */}
            <div className="flex items-center gap-3">
              <div
                className={`relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 ${
                  isPlaying ? "animate-spin-slow" : ""
                }`}
              >
                {/* Abaikan garis kuning di <img>, itu aman */}
                <img
                  src={currentSong.cover}
                  className={`w-full h-full object-cover vinyl-effect ${
                    isPlaying ? "playing" : ""
                  }`}
                  alt="art"
                />
                {/* Lubang tengah vinyl */}
                <div className="absolute inset-0 m-auto w-3 h-3 bg-[#1a1a1a] rounded-full border border-gray-700"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white max-w-120px truncate">
                  {currentSong.title}
                </span>
                <span className="text-xs text-gray-400 max-w-120px truncate">
                  {currentSong.artist}
                </span>
              </div>
            </div>

            {/* Kanan: Controls Simpel */}
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayPause();
                }}
                className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg shadow-white/20"
              >
                <i
                  className={`text-xl ${
                    isPlaying ? "ri-pause-fill" : "ri-play-fill"
                  }`}
                ></i>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className="text-white/60 hover:text-white transition"
              >
                <i className="ri-skip-forward-fill text-2xl"></i>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
