/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect, useRef } from "react";
import { Song } from "@/types";
import { motion, AnimatePresence, PanInfo } from "framer-motion";

interface FullPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  progress: number;
  duration: number;
  onSeek: (time: number) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isLiked: boolean;
  onToggleLike: () => void;
  isShuffle: boolean;
  repeatMode: "off" | "all" | "one";
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}

const formatTime = (seconds: number) => {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" + s : s}`;
};

const parseLRC = (text: string) => {
  const lines = text.split("\n");
  const result = [];
  const regex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/;
  for (const line of lines) {
    const match = regex.exec(line);
    if (match) {
      const min = parseInt(match[1]);
      const sec = parseInt(match[2]);
      const ms = match[3] ? parseInt(match[3]) : 0;
      const time = min * 60 + sec + ms / 100;
      const content = line.replace(regex, "").trim();
      if (content) result.push({ time, content });
    }
  }
  return result;
};

export default function FullPlayer({
  isOpen,
  onClose,
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  progress,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  isLiked,
  onToggleLike,
  isShuffle,
  repeatMode,
  onToggleShuffle,
  onToggleRepeat,
}: FullPlayerProps) {
  const [lyrics, setLyrics] = useState<{ time: number; content: string }[]>([]);
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1);
  const lyricRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    if (!currentSong?.lrc) {
      setLyrics([]);
      return;
    }
    fetch(currentSong.lrc)
      .then((res) => res.text())
      .then((text) => setLyrics(parseLRC(text)))
      .catch(() => setLyrics([]));
  }, [currentSong]);

  // LOGIKA SCROLL LIRIK YANG LEBIH MULUS
  useEffect(() => {
    if (!isOpen || lyrics.length === 0) return;
    let newIndex = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (progress >= lyrics[i].time) newIndex = i;
      else break;
    }
    if (newIndex !== activeLyricIndex) {
      setActiveLyricIndex(newIndex);
      if (newIndex !== -1 && lyricRefs.current[newIndex]) {
        lyricRefs.current[newIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [progress, lyrics, isOpen, activeLyricIndex]);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const width = e.currentTarget.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    onSeek((clickX / width) * duration);
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const width = e.currentTarget.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const newVol = Math.max(0, Math.min(1, clickX / width));
    onVolumeChange(newVol);
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (!isDesktop && (info.offset.y > 100 || info.velocity.y > 500)) {
      onClose();
    }
  };

  if (!currentSong) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          drag={isDesktop ? false : "y"}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={isDesktop ? 0 : { top: 0, bottom: 0.2 }}
          onDragEnd={handleDragEnd}
          className="fixed inset-0 z-100 bg-[#09090b] text-white flex flex-col h-dvh"
        >
          {/* BACKGROUND */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 bg-cover bg-center blur-[80px] opacity-50 scale-150 animate-pulse-slow"
              style={{ backgroundImage: `url('${currentSong.cover}')` }}
            ></div>
            <div className="absolute inset-0 bg-linear-to-b from-gray-900/50 to-[#09090b] -z-10"></div>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-2xl"></div>
          </div>

          {/* HEADER */}
          <div className="relative z-20 flex-none flex items-center justify-between px-6 py-4 lg:py-6 cursor-default lg:cursor-auto">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition hover:bg-white/20"
            >
              <i className="ri-arrow-down-s-line text-2xl"></i>
            </button>
            <div className="flex flex-col items-center mt-2 mb-2">
              <div className="w-10 h-1 bg-white/20 rounded-full mb-2 lg:hidden"></div>
              <span className="text-[10px] md:text-lg font-bold tracking-[2px] uppercase text-white/50 mb-0.5">
                Now Playing
              </span>
              {/* Tambahan: Judul di Header (Mobile Only) biar tau lagu apa kalau scroll ke lirik */}
            </div>
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition hover:bg-white/20">
              <i className="ri-more-fill text-xl"></i>
            </button>
          </div>

          {/* MAIN CONTENT */}
          <div className="relative z-10 flex-1 w-full overflow-hidden flex flex-col justify-start lg:justify-center">
            {/* Scroll Container untuk Mobile agar Lirik di bawah bisa di-scroll */}
            <div className="w-full h-full overflow-y-auto lg:overflow-visible scrollbar-hide flex flex-col">
              <div className="flex flex-col lg:flex-row items-center lg:justify-center gap-4 lg:gap-20 px-6 pb-20 lg:pb-10 max-w-7xl mx-auto w-full min-h-min lg:h-full mt-4 lg:mt-0">
                {/* KIRI: Cover & Controls */}
                <div className="flex-none w-full max-w-100 lg:w-120 lg:max-w-none flex flex-col">
                  {/* 1. GAMBAR COVER */}
                  <motion.div
                    layoutId={`cover-${currentSong.id}`}
                    className="w-[85%] max-w-85 md:max-w-100 lg:w-full lg:max-w-none aspect-square mx-auto rounded-2xl md:rounded-4xl overflow-hidden shadow-2xl border border-white/10 mb-6 lg:mb-8 relative shrink-0"
                  >
                    <img
                      src={currentSong.cover}
                      alt="Art"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                  {/* INFO */}
                  <div className="mb-4 lg:mb-6 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-1">
                      <h2 className="text-2xl md:text-4xl font-extrabold leading-tight truncate drop-shadow-lg">
                        {currentSong.title}
                      </h2>
                      <button
                        onClick={onToggleLike}
                        className="active:scale-125 transition-transform duration-200"
                      >
                        <i
                          className={`text-2xl md:text-4xl ${
                            isLiked
                              ? "ri-heart-fill text-[#22c527]"
                              : "ri-heart-line text-white/50 hover:text-white"
                          }`}
                        ></i>
                      </button>
                    </div>
                    <p className="text-base md:text-xl text-white/70 font-medium truncate">
                      {currentSong.artist}
                    </p>
                  </div>

                  {/* PROGRESS BAR */}
                  <div
                    className="w-full mb-4 lg:mb-6 cursor-pointer group py-2"
                    onClick={handleProgressBarClick}
                  >
                    <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white rounded-full relative shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                        style={{ width: `${(progress / duration) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs md:text-sm font-medium text-white/50 mt-2">
                      <span>{formatTime(progress)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* CONTROLS */}
                  <div className="flex items-center justify-between px-2 mb-6 lg:mb-6">
                    <button
                      onClick={onToggleShuffle}
                      className={`transition active:scale-90 ${
                        isShuffle
                          ? "text-[#22c527]"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      <i className="ri-shuffle-line text-xl md:text-3xl"></i>
                      {isShuffle && (
                        <div className="mx-auto mt-1 w-1 h-1 bg-[#22c527] rounded-full"></div>
                      )}
                    </button>
                    <button
                      onClick={onPrev}
                      className="text-white hover:text-white/70 transition active:scale-90"
                    >
                      <i className="ri-skip-back-fill text-3xl md:text-5xl"></i>
                    </button>

                    <button
                      onClick={onPlayPause}
                      className="w-16 h-16 md:w-20 md:h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-xl shadow-white/10"
                    >
                      <i
                        className={`${
                          isPlaying ? "ri-pause-fill" : "ri-play-fill"
                        } text-3xl md:text-5xl ml-1`}
                      ></i>
                    </button>

                    <button
                      onClick={onNext}
                      className="text-white hover:text-white/70 transition active:scale-90"
                    >
                      <i className="ri-skip-forward-fill text-3xl md:text-5xl"></i>
                    </button>
                    <button
                      onClick={onToggleRepeat}
                      className={`transition active:scale-90 ${
                        repeatMode !== "off"
                          ? "text-[#22c527]"
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      <i
                        className={`${
                          repeatMode === "one"
                            ? "ri-repeat-one-line"
                            : "ri-repeat-2-line"
                        } text-xl md:text-3xl`}
                      ></i>
                      {repeatMode !== "off" && (
                        <div className="mx-auto mt-1 w-1 h-1 bg-[#22c527] rounded-full"></div>
                      )}
                    </button>
                  </div>

                  {/* VOLUME (Desktop Only) */}
                  <div className="hidden lg:flex items-center gap-3 px-25 mt-3 group">
                    <i
                      onClick={() => onVolumeChange(volume === 0 ? 1 : 0)}
                      className={`cursor-pointer text-white/50 hover:text-white transition ri-${
                        volume === 0
                          ? "volume-mute-fill"
                          : volume < 0.5
                          ? "volume-down-fill"
                          : "volume-up-fill"
                      } text-xl`}
                    ></i>
                    <div
                      className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer overflow-hidden relative"
                      onClick={handleVolumeClick}
                    >
                      <div
                        className="absolute top-0 left-0 h-full bg-white/50 group-hover:bg-[#22c527] transition-colors rounded-full"
                        style={{ width: `${volume * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* KANAN: Lirik (Desktop & Mobile Scroll Down) */}
                <div className="flex-none w-full lg:w-112.5 h-45 lg:h-150 relative bg-white/2 border border-white/3 rounded-4xl lg:bg-transparent lg:border-none lg:rounded-none overflow-hidden mt-4 lg:mt-0">
                  <div
                    ref={lyricsContainerRef}
                    // Tambahkan class 'mask-gradient-vertical' jika sudah ada di global css
                    className="w-full h-full overflow-y-auto scrollbar-hide px-6 py-4 mask-gradient-vertical"
                  >
                    <div className="h-25 lg:h-62.5"></div>
                    {lyrics.length > 0 ? (
                      lyrics.map((line, i) => (
                        <motion.p
                          key={i}
                          ref={(el) => {
                            lyricRefs.current[i] = el;
                          }}
                          animate={{
                            opacity: i === activeLyricIndex ? 1 : 0.4,
                            scale: i === activeLyricIndex ? 1.05 : 1,
                            y: 0,
                          }}
                          className={`py-2 lg:py-4 transition-all duration-300 cursor-pointer text-center lg:text-left font-bold tracking-wide leading-relaxed
                                                    ${
                                                      i === activeLyricIndex
                                                        ? "text-lg md:text-2xl text-white drop-shadow-md"
                                                        : "text-sm md:text-xl text-white hover:text-white/60"
                                                    }
                                                `}
                          onClick={() => onSeek(line.time)}
                        >
                          {line.content}
                        </motion.p>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full opacity-40 text-center">
                        <i className="ri-music-2-line text-3xl mb-2"></i>
                        <p className="text-sm font-bold">Instrumental</p>
                      </div>
                    )}
                    <div className="h-25 lg:h-75"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
