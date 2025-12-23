/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Song } from "@/types";

interface HeroSectionProps {
  song: Song;
  onPlay: () => void;
}

export default function HeroSection({ song, onPlay }: HeroSectionProps) {
  return (
    <div className="mb-8">
      <div
        className="relative w-full h-48 md:h-72 rounded-3xl overflow-hidden group cursor-pointer shadow-2xl ring-1 ring-white/10"
        onClick={onPlay}
      >
        <img
          src={song.cover}
          alt="Hero"
          className="w-full h-full object-cover object-center transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/50 to-transparent flex flex-col justify-center pl-6 md:pl-12">
          <span className="text-[#22c527] text-[10px] md:text-sm font-bold tracking-widest mb-3 uppercase bg-black/60 w-fit px-3 py-1 rounded-full backdrop-blur-md border border-white/5">
            Featured Today
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight truncate max-w-[85%] drop-shadow-2xl">
            {song.title}
          </h2>
          <p className="text-white/90 text-sm md:text-lg font-medium truncate max-w-[80%] mt-2">
            {song.artist}
          </p>
        </div>
        <div className="absolute right-6 bottom-4 md:right-10 md:bottom-10 w-12 h-12 md:w-16 md:h-16 bg-[#22c527] rounded-full flex items-center justify-center text-black opacity-100 md:opacity-0 group-hover:opacity-100 transition-all md:translate-y-4 group-hover:translate-y-0 shadow-[0_0_30px_rgba(34,197,39,0.6)] hover:scale-110">
          <i className="ri-play-fill text-2xl md:text-3xl ml-1"></i>
        </div>
      </div>
    </div>
  );
}
