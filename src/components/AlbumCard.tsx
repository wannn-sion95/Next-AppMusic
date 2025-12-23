/* eslint-disable @next/next/no-img-element */
// src/components/AlbumCard.tsx
import React from "react";
import { Song } from "@/data/songs";
import { motion } from "framer-motion"; // <-- Import ini

interface AlbumCardProps {
  data: Song;
  onClick: () => void;
}

export default function AlbumCard({ data, onClick }: AlbumCardProps) {
  return (
    <motion.div
      onClick={onClick}
      // ANIMASI DISINI:
      whileHover={{ y: -5, scale: 1.02 }} // Naik dikit & membesar pas hover
      whileTap={{ scale: 0.95 }} // Mengecil pas dipencet (efek tactile)
      initial={{ opacity: 0, y: 20 }} // Muncul dari bawah
      animate={{ opacity: 1, y: 0 }} // Ke posisi normal
      transition={{ type: "spring", stiffness: 300, damping: 20 }} // Efek pegas
      className="group relative flex flex-col gap-3 p-3 rounded-2xl cursor-pointer"
    >
      {/* Background Glass (Muncul pas hover) */}
      <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Cover Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl shadow-lg">
        <img
          src={data.cover}
          alt={data.title}
          className="w-full h-full object-cover"
        />
        {/* Play Icon Overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1.1, rotate: 90 }}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black"
          >
            <i className="ri-play-fill text-xl"></i>
          </motion.div>
        </div>
      </div>

      {/* Info */}
      <div className="relative z-10">
        <h4 className="font-bold text-white truncate text-sm">{data.title}</h4>
        <p className="text-xs text-white/50 truncate">{data.artist}</p>
      </div>
    </motion.div>
  );
}
