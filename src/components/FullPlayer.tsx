/* eslint-disable @next/next/no-img-element */
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

  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // --- FETCH LYRICS ---
  useEffect(() => {
    if (!currentSong?.lrc) {
      setTimeout(() => setLyrics([]), 0);
      return;
    }
    let isMounted = true;
    fetch(currentSong.lrc)
      .then((res) => res.text())
      .then((text) => {
        if (isMounted) setLyrics(parseLRC(text));
      })
      .catch(() => {
        if (isMounted) setTimeout(() => setLyrics([]), 0);
      });
    return () => {
      isMounted = false;
    };
  }, [currentSong]);

  // --- SYNC LYRICS ---
  useEffect(() => {
    if (!isOpen || lyrics.length === 0) return;
    let newIndex = -1;
    for (let i = 0; i < lyrics.length; i++) {
      if (progress >= lyrics[i].time) newIndex = i;
      else break;
    }
    if (newIndex !== activeLyricIndex) {
      setTimeout(() => setActiveLyricIndex(newIndex), 0);
      if (
        !isUserScrolling.current &&
        newIndex !== -1 &&
        lyricRefs.current[newIndex]
      ) {
        lyricRefs.current[newIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [progress, lyrics, isOpen, activeLyricIndex]);

  const handleLyricsInteraction = () => {
    isUserScrolling.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isUserScrolling.current = false;
    }, 3000);
  };

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
    if (info.offset.y > 100 || info.velocity.y > 500) {
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
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ top: 0, bottom: 0.2 }}
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
          <div className="relative z-20 flex-none flex items-center justify-between px-6 py-4 lg:py-6 cursor-grab active:cursor-grabbing">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition hover:bg-white/20"
            >
              <i className="ri-arrow-down-s-line text-2xl"></i>
            </button>
            <div className="flex flex-col items-center">
              <div className="w-10 h-1 bg-white/20 rounded-full mb-2 lg:hidden"></div>
              <span className="text-[10px] md:text-xl font-bold tracking-[2px] uppercase text-white/50 mb-0.5">
                Now Playing
              </span>
            </div>
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition hover:bg-white/20">
              <i className="ri-more-fill text-xl"></i>
            </button>
          </div>

          {/* MAIN CONTENT (FIXED: ALLOW SCROLL ON DESKTOP) */}
          {/* Hapus 'lg:overflow-hidden' dan ganti 'lg:justify-center' jadi 'lg:justify-center' tapi aman */}
          <div className="relative z-10 flex-1 flex flex-col lg:flex-row lg:items-center lg:justify-center px-6 pb-8 gap-6 lg:gap-20 max-w-7xl mx-auto w-full overflow-y-auto scrollbar-hide">
            <div className="flex-none w-full lg:w-480px flex flex-col justify-start lg:justify-center max-w-md mx-auto lg:mx-0 pt-4 lg:pt-0">
              {/* COVER */}
              <motion.div
                layoutId={`cover-${currentSong.id}`}
                className="w-full aspect-square max-h-350px lg:max-h-none mx-auto rounded-2xl md:rounded-32px overflow-hidden shadow-2xl border border-white/10 mb-8 relative shrink-0"
              >
                <img
                  src={currentSong.cover}
                  alt="Art"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* INFO */}
              <div className="mb-6 text-center lg:text-left shrink-0">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
                  <h2 className="text-3xl md:text-4xl font-extrabold leading-tight truncate drop-shadow-lg">
                    {currentSong.title}
                  </h2>
                  <button
                    onClick={onToggleLike}
                    className="active:scale-125 transition-transform duration-200"
                  >
                    <i
                      className={`text-3xl md:text-4xl ${
                        isLiked
                          ? "ri-heart-fill text-[#22c527]"
                          : "ri-heart-line text-white/50 hover:text-white"
                      }`}
                    ></i>
                  </button>
                </div>
                <p className="text-lg md:text-xl text-white/70 font-medium truncate">
                  {currentSong.artist}
                </p>
              </div>

              {/* PROGRESS BAR */}
              <div
                className="w-full mb-6 cursor-pointer group py-2 shrink-0"
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
              <div className="flex items-center justify-between px-2 mb-6 shrink-0">
                <button
                  onClick={onToggleShuffle}
                  className={`transition active:scale-90 ${
                    isShuffle
                      ? "text-[#22c527]"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  <i className="ri-shuffle-line text-2xl md:text-3xl"></i>
                  {isShuffle && (
                    <div className="mx-auto mt-1 w-1 h-1 bg-[#22c527] rounded-full"></div>
                  )}
                </button>

                <button
                  onClick={onPrev}
                  className="text-white hover:text-white/70 transition active:scale-90"
                >
                  <i className="ri-skip-back-fill text-4xl md:text-5xl"></i>
                </button>

                <button
                  onClick={onPlayPause}
                  className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-xl shadow-white/10"
                >
                  <i
                    className={`${
                      isPlaying ? "ri-pause-fill" : "ri-play-fill"
                    } text-4xl md:text-5xl ml-1`}
                  ></i>
                </button>

                <button
                  onClick={onNext}
                  className="text-white hover:text-white/70 transition active:scale-90"
                >
                  <i className="ri-skip-forward-fill text-4xl md:text-5xl"></i>
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
                    } text-2xl md:text-3xl`}
                  ></i>
                  {repeatMode !== "off" && (
                    <div className="mx-auto mt-1 w-1 h-1 bg-[#22c527] rounded-full"></div>
                  )}
                </button>
              </div>

              {/* VOLUME SLIDER */}
              <div className="hidden lg:flex items-center gap-3 px-2 group shrink-0">
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

            {/* LIRIK */}
            <div className="flex-none w-full lg:w-400px h-36 lg:h-550px relative bg-white/5 border border-white/5 rounded-xl lg:bg-transparent lg:border-none lg:rounded-none overflow-hidden mt-2 lg:mt-0 shrink-0">
              <div
                ref={lyricsContainerRef}
                className="w-full h-full overflow-y-auto scrollbar-hide mask-gradient-vertical px-4 py-2"
                onMouseEnter={handleLyricsInteraction}
                onMouseLeave={handleLyricsInteraction}
                onTouchStart={handleLyricsInteraction}
                onTouchMove={handleLyricsInteraction}
              >
                <div className="h-50px lg:h-220px"></div>
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
                      }}
                      className={`py-2 lg:py-4 transition-colors duration-300 cursor-pointer text-center lg:text-left font-bold tracking-wide leading-snug
                                    ${
                                      i === activeLyricIndex
                                        ? "text-xl md:text-2xl text-white drop-shadow-md"
                                        : "text-lg md:text-xl text-white hover:text-white/60"
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
                <div className="h-50px lg:h-300px"></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
