/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Song } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface MiniPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void; // Pastikan ini ada
  onExpand: () => void;
}

export default function MiniPlayer({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onExpand,
}: MiniPlayerProps) {
  if (!currentSong) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="fixed bottom-4 left-4 right-4 z-50 max-w-5xl mx-auto"
      >
        <div
          onClick={onExpand}
          className="bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center justify-between shadow-2xl cursor-pointer hover:bg-[#252525]/90 transition group"
        >
          {/* Bagian Kiri: Info Lagu */}
          <div className="flex items-center gap-3 overflow-hidden flex-1">
            {/* Cover Putar */}
            <div
              className={`w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0 ${
                isPlaying ? "animate-spin-slow" : ""
              }`}
            >
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col overflow-hidden">
              <h4 className="text-white font-bold text-sm truncate">
                {currentSong.title}
              </h4>
              <p className="text-white/50 text-xs truncate">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* Bagian Kanan: Controls */}
          <div className="flex items-center gap-1 md:gap-3">
            {/* 1. TOMBOL PREV (BARU DITAMBAHKAN) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:scale-110 transition active:scale-90"
            >
              <i className="ri-skip-back-fill text-xl md:text-2xl"></i>
            </button>

            {/* 2. TOMBOL PLAY/PAUSE */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayPause();
              }}
              className="w-11 h-11 bg-gray-50 text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg"
            >
              <i
                className={`${
                  isPlaying ? "ri-pause-fill" : "ri-play-fill"
                } text-2xl ml-0.25px`}
              ></i>
            </button>

            {/* 3. TOMBOL NEXT */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:scale-110 transition active:scale-90"
            >
              <i className="ri-skip-forward-fill text-xl md:text-2xl"></i>
            </button>
          </div>

          {/* Progress Bar Tipis di Bawah (Opsional, buat estetika) */}
          <div className="absolute bottom-0 left-3 right-3 h-2px bg-white/10 rounded-full overflow-hidden pointer-events-none">
            <div className="h-full bg-[#22c527] w-full animate-pulse opacity-50"></div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
