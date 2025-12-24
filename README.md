<div align="center">

  <h1>🎵 One Music</h1>
  
  <p>
    A modern, premium web music player inspired by Spotify.<br>
    Built with <strong>Next.js 14</strong>, <strong>Supabase</strong>, and <strong>Framer Motion</strong>.
  </p>

  <p>
    <a href="https://next-app-music.vercel.app/"><strong>View Live Demo</strong></a> · 
    <a href="https://github.com/wannn-sion95/Web-Music/issues">Report Bug</a> · 
    <a href="https://github.com/wannn-sion95/Web-Music/issues">Request Feature</a>
  </p>

  <br />

  <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />

</div>

<br />

## 📸 Screenshots

<div align="center">
<img width="578" height="770" alt="Image" src="https://github.com/user-attachments/assets/b40c1e6a-db0c-4970-a64e-fdca3af71bf5" />

<div align="center">
  <img width="1164" height="902" alt="Image" src="https://github.com/user-attachments/assets/77602984-1120-4518-9c81-1065b60bd560" />
</div>

<br />

## ✨ Key Features

* **🎧 Cloud Streaming:** Music data managed dynamically via **Supabase (PostgreSQL)**.
* **📱 Fully Responsive:** Optimized layout for both Desktop (Sidebar view) and Mobile (Full-screen player).
* **🎤 Auto-Scrolling Lyrics:** Real-time synchronized lyrics (`.lrc`) with smooth scrolling active states.
* **💅 Glassmorphism UI:** Modern, clean, and dark-themed interface using Tailwind CSS.
* **⚡ Smooth Animations:** Powered by **Framer Motion** for seamless transitions between cover art and lyrics.
* **🎛️ Full Controls:** Play, Pause, Next, Prev, Shuffle, Repeat, and Volume Control.

<br />

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

* Node.js (v16 or higher)
* npm / yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/wannn-sion95/Web-Music.git](https://github.com/wannn-sion95/Web-Music.git)
    cd Web-Music
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

<br />

## 📂 Project Structure

```bash
├── public/           # Static assets (images, music, lyrics)
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── components/   # Reusable UI components (FullPlayer, Sidebar, etc.)
│   ├── lib/          # Supabase client configuration
│   └── types/        # TypeScript interfaces
└── ...
```
