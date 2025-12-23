export interface Song {
  id: number;
  title: string;
  artist: string;
  cover: string;
  src: string;
  lrc?: string; // Opsional karena gak semua lagu punya lirik
}
