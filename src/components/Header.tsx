import React from "react";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export default function Header({ searchTerm, setSearchTerm }: HeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 4) return "Good Night";
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex-none p-6 pt-8 z-20 sticky top-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* LOGO KIRI */}
        <div className="hidden md:block w-1/4">
          <h2 className="text-white/60 text-xs font-bold tracking-widest uppercase mb-1">
            {getGreeting()}
          </h2>
          <h1 className="text-2xl font-bold tracking-tighter text-white">
            One <span className="text-[#22c527]">Music</span>
          </h1>
        </div>

        {/* SEARCH BAR (FIXED ICON) */}
        <div className="flex-1 max-w-lg relative group">
          {/* ICON SEARCH: Ditambah z-10 biar tampil di atas */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <i className="ri-search-line text-white/70 text-lg group-focus-within:text-[#22c527] transition-colors"></i>
          </div>

          <input
            type="text"
            placeholder="Search your music..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:bg-white/15 focus:border-white/30 transition-all shadow-lg"
          />
        </div>

        {/* PROFILE KANAN */}
        <div className="w-1/4 flex justify-end items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition backdrop-blur-md border border-white/5">
            <i className="ri-notification-3-line text-white"></i>
          </button>
          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#22c527] to-blue-500 p-2px cursor-pointer hover:scale-105 transition">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
              <i className="ri-user-3-fill text-white"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
