import React from "react";

export default function Footer() {
  return (
    <footer className="mt-20 mb-10 text-center border-t border-white/5 pt-10">
      <h3 className="text-[#22c527] font-extrabold text-lg tracking-tight mb-2">
        ONE MUSIC
      </h3>
      <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">
        Music is a universal language that brings people together. Enjoy your
        favorite songs with One Music.
      </p>
      <div className="flex justify-center gap-6 text-white/60 mb-4">
        <a
          href="https://github.com/wannn-sion95"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition transform hover:scale-110"
          aria-label="Github"
        >
          <i className="ri-github-fill text-2xl"></i>
        </a>

        <a
          href="https://x.com/wannn_sion9"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition transform hover:scale-110"
          aria-label="Twitter"
        >
          <i className="ri-twitter-x-fill text-2xl"></i>
        </a>

        <a
          href="https://www.instagram.com/wannn_sion?igsh=djF2MWpiM3ZlOGhk"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition transform hover:scale-110"
          aria-label="Instagram"
        >
          <i className="ri-instagram-fill text-2xl"></i>
        </a>

        <a
          href="https://www.facebook.com/profile.php?id=100035657014919"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition transform hover:scale-110"
          aria-label="Instagram"
        >
          <i className="ri-facebook-fill text-2xl"></i>
        </a>

        <a
          href="https://www.linkedin.com/in/mhd-ridwan"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition transform hover:scale-110"
          aria-label="LinkedIn"
        >
          <i className="ri-linkedin-fill text-2xl"></i>
        </a>
      </div>
      <p className="text-white/20 text-xs py-3">Gmail: wannnsion95@gmail.com</p>
      <p className="text-white/20 text-xs">
        &copy; 2025 Created by{" "}
        <span className="text-white/60 hover:text-[#22c527] transition font-bold cursor-pointer">
          Wannn Sion
        </span>
      </p>
    </footer>
  );
}
