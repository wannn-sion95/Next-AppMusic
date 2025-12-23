import React from "react";
import { Song } from "@/types";
import AlbumCard from "@/components/AlbumCard";

interface SongListProps {
  songs: Song[];
  onPlay: (song: Song) => void;
}

export default function SongList({ songs, onPlay }: SongListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {songs.map((song) => (
        <AlbumCard 
          key={song.id} 
          data={song} 
          onClick={() => onPlay(song)} 
        />
      ))}
    </div>
  );
}