# ⭕ DrawRound

Can you draw a perfect circle? Built by **nog & Claude Sonnet 4.6**

🔗 **Live Demo:** [draw-round.vercel.app](https://draw-round.vercel.app)

---

## ✨ Features

- Draw a circle freehand and get scored 0–100
- Splash screen with animated title
- Dashed ideal circle overlay after each attempt
- Best score & attempt count saved via localStorage
- Built-in music player — shuffle through your own songs
- Toggleable dot grid
- Fully responsive — works on desktop and mobile touch

## 🚀 Getting Started

```bash
npm install
npm run dev
```

## 🎵 Adding Music

Drop your `.mp3` files into `/public/music/` and update the `PLAYLIST` array at the top of `src/App.jsx`:

```js
const PLAYLIST = [
  { title: "Song Name", artist: "Artist", src: "/music/yourfile.mp3" },
]
```

## 📦 Build for Production

```bash
npm run build
```

## 🛠️ Tech Stack

- React + Vite
- HTML5 Canvas
- localStorage for score persistence

## 👥 Credits


Built by **nog & Claude Sonnet 4.6**
