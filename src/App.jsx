import { useState, useRef, useEffect, useCallback } from "react";

// 🎵 Add your songs here — drop files in /public/music/ and list them below
const PLAYLIST = [
  { title: "CandyLand",   artist: "Artist 1", src: "/music/CandyLand.mp3" },
  { title: "Sky High",   artist: "Artist 2", src: "/music/SkyHigh.mp3" },
  { title: "Shot Callin", artist: "Artist 3", src: "/music/ShotCallin.mp3" },
];

function MusicPlayer() {
  const audioRef = useRef(null);
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.6);
  const [expanded, setExpanded] = useState(false);
  const [shuffled] = useState(() => [...PLAYLIST].map((_, i) => i).sort(() => Math.random() - 0.5));
  const [shuffleIdx, setShuffleIdx] = useState(0);
  const current = PLAYLIST[trackIdx];

  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    a.volume = volume;
    const onTime = () => setProgress(a.currentTime);
    const onLoad = () => setDuration(a.duration);
    const onEnd  = () => next();
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onLoad);
    a.addEventListener("ended", onEnd);
    return () => { a.removeEventListener("timeupdate", onTime); a.removeEventListener("loadedmetadata", onLoad); a.removeEventListener("ended", onEnd); };
  }, [trackIdx]);

  useEffect(() => { const a = audioRef.current; if (a) a.volume = volume; }, [volume]);

  const play = () => { audioRef.current?.play(); setPlaying(true); };
  const pause = () => { audioRef.current?.pause(); setPlaying(false); };
  const toggle = () => playing ? pause() : play();

  const goTo = (idx) => {
    setTrackIdx(idx); setProgress(0); setPlaying(false);
    setTimeout(() => { audioRef.current?.load(); if (playing) { audioRef.current?.play(); setPlaying(true); } }, 50);
  };
  const next = () => { const ni = (shuffleIdx + 1) % shuffled.length; setShuffleIdx(ni); goTo(shuffled[ni]); };
  const prev = () => { const ni = (shuffleIdx - 1 + shuffled.length) % shuffled.length; setShuffleIdx(ni); goTo(shuffled[ni]); };

  const seek = (e) => {
    const a = audioRef.current; if (!a || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };
  const fmt = (s) => isNaN(s) ? "0:00" : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 100, userSelect: "none" }}>
      <audio ref={audioRef} src={current.src} />
      {!expanded && (
        <div onClick={() => setExpanded(true)} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(15,23,42,0.92)", border: "1px solid rgba(99,102,241,0.35)", borderRadius: 999, padding: "8px 16px 8px 10px", cursor: "pointer", backdropFilter: "blur(12px)", boxShadow: "0 4px 24px rgba(99,102,241,0.15)" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 18, width: 18 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 4, borderRadius: 2, background: playing ? "#818cf8" : "#475569", animation: playing ? `bar${i} 0.8s ease-in-out infinite alternate` : "none", height: playing ? undefined : 6 }} />)}
          </div>
          <div style={{ maxWidth: 120, overflow: "hidden" }}>
            <div style={{ color: "#f1f5f9", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{current.title}</div>
            <div style={{ color: "#64748b", fontSize: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{current.artist}</div>
          </div>
          <button onClick={e => { e.stopPropagation(); toggle(); }} style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#a5b4fc", fontSize: 11 }}>
            {playing ? "⏸" : "▶"}
          </button>
        </div>
      )}
      {expanded && (
        <div style={{ width: 260, background: "rgba(15,23,42,0.96)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 20, padding: 16, backdropFilter: "blur(16px)", boxShadow: "0 8px 40px rgba(99,102,241,0.2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 16 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 3, borderRadius: 2, background: playing ? "#818cf8" : "#475569", animation: playing ? `bar${i} 0.8s ease-in-out infinite alternate` : "none", height: playing ? undefined : 5 }} />)}
              </div>
              <span style={{ color: "#818cf8", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Now Playing</span>
            </div>
            <button onClick={() => setExpanded(false)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 16, lineHeight: 1, padding: 2 }}>✕</button>
          </div>
          <div style={{ width: "100%", aspectRatio: "1", borderRadius: 14, background: "linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.1))", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, position: "relative", overflow: "hidden" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1" }} />
              </div>
            </div>
            {playing && <div style={{ position: "absolute", inset: 12, borderRadius: "50%", border: "1px solid transparent", borderTopColor: "rgba(99,102,241,0.3)", animation: "spin 3s linear infinite" }} />}
          </div>
          <div style={{ marginBottom: 12, textAlign: "center" }}>
            <div style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{current.title}</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>{current.artist}</div>
          </div>
          <div onClick={seek} style={{ height: 4, background: "rgba(99,102,241,0.2)", borderRadius: 4, cursor: "pointer", marginBottom: 6, position: "relative" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)", borderRadius: 4, transition: "width 0.2s" }} />
            <div style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%,-50%)", width: 10, height: 10, borderRadius: "50%", background: "#818cf8", boxShadow: "0 0 6px #6366f1" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", color: "#475569", fontSize: 10, marginBottom: 14 }}>
            <span>{fmt(progress)}</span><span>{fmt(duration)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14 }}>
            <button onClick={prev} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 16, padding: 4 }}>⏮</button>
            <button onClick={toggle} style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(99,102,241,0.4)" }}>
              {playing ? "⏸" : "▶"}
            </button>
            <button onClick={next} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 16, padding: 4 }}>⏭</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#475569", fontSize: 12 }}>{volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}</span>
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(parseFloat(e.target.value))} style={{ flex: 1, accentColor: "#6366f1", cursor: "pointer", height: 4 }} />
          </div>
          <div style={{ marginTop: 14, borderTop: "1px solid rgba(99,102,241,0.15)", paddingTop: 12 }}>
            {PLAYLIST.map((t, i) => (
              <div key={i} onClick={() => goTo(i)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 8, cursor: "pointer", background: i === trackIdx ? "rgba(99,102,241,0.12)" : "transparent", marginBottom: 2 }}>
                <span style={{ color: i === trackIdx ? "#818cf8" : "#475569", fontSize: 10, width: 14, textAlign: "center", fontWeight: 700 }}>{i === trackIdx && playing ? "♪" : i + 1}</span>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ color: i === trackIdx ? "#f1f5f9" : "#94a3b8", fontSize: 12, fontWeight: i === trackIdx ? 700 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
                  <div style={{ color: "#475569", fontSize: 10 }}>{t.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`
        @keyframes bar0 { from{height:4px} to{height:14px} }
        @keyframes bar1 { from{height:10px} to{height:4px} }
        @keyframes bar2 { from{height:6px} to{height:12px} }
        @keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

const SCORES = [
  [95, "Perfect circle! You're built different. ✨"],
  [85, "Almost perfect! Elite stuff. 🎯"],
  [75, "Pretty circular! Not bad at all. 👏"],
  [60, "Decent effort. Keep practicing. 💪"],
  [40, "Uh... try drawing slower? 🖊️"],
  [20, "Give it another shot. Practice makes perfect. 🔄"],
  [0,  "Bro that's just abstract art. 🎨"],
];

function getMessage(score) {
  for (const [threshold, msg] of SCORES)
    if (score >= threshold) return msg;
  return SCORES[SCORES.length - 1][1];
}

function getScoreColor(score) {
  if (score >= 85) return "#22c55e";
  if (score >= 65) return "#f59e0b";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

function evaluateCircle(pts) {
  if (pts.length < 10) return null;
  const cx = pts.reduce((a, p) => a + p.x, 0) / pts.length;
  const cy = pts.reduce((a, p) => a + p.y, 0) / pts.length;
  const radii = pts.map(p => Math.hypot(p.x - cx, p.y - cy));
  const avgR = radii.reduce((a, r) => a + r, 0) / radii.length;
  const variance = Math.sqrt(radii.reduce((a, r) => a + (r - avgR) ** 2, 0) / radii.length);
  const closureDist = Math.hypot(pts[pts.length - 1].x - pts[0].x, pts[pts.length - 1].y - pts[0].y);
  const isClosed = closureDist < avgR * 0.25;
  const varScore = Math.max(0, 1 - variance / (avgR * 0.5));
  const score = Math.round(Math.min(100, Math.max(0, varScore * 0.65 + (isClosed ? 1 : 0.4) * 0.35)) * 100);
  return { score, center: { x: cx, y: cy }, radius: avgR };
}

const Credits = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, userSelect: "none" }}>
    <span style={{ fontSize: 12, color: "#6b7280" }}>Built by</span>
    <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: "0.1em", background: "linear-gradient(135deg,#cc44ff,#aa00ff,#dd88ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 6px #cc44ff)" }}>nog</span>
    <span style={{ color: "#4b5563", fontSize: 12 }}>&amp;</span>
    <span style={{ fontSize: 12, fontWeight: 900, background: "linear-gradient(135deg,#ff8c00,#ff6b35,#ffb347)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 5px #ff6b35)" }}>Claude Sonnet 4.6</span>
  </div>
);

export default function App() {
  const canvasRef = useRef(null);
  const [screen, setScreen] = useState("splash");
  const [drawing, setDrawing] = useState(false);
  const [pts, setPts] = useState([]);
  const [result, setResult] = useState(null);
  const [showGrid, setShowGrid] = useState(true);

  const [best, setBest] = useState(() => {
    try { return parseInt(localStorage.getItem("drawround_best") || "0", 10); } catch { return 0; }
  });
  const [attempts, setAttempts] = useState(() => {
    try { return parseInt(localStorage.getItem("drawround_attempts") || "0", 10); } catch { return 0; }
  });

  const dpr = window.devicePixelRatio || 1;

  const resize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width = c.offsetWidth * dpr;
    c.height = c.offsetHeight * dpr;
  }, [dpr]);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  useEffect(() => {
    if (screen !== "game") return;
    const c = canvasRef.current;
    if (!c) return;
    c.width = c.offsetWidth * dpr;
    c.height = c.offsetHeight * dpr;
    const ctx = c.getContext("2d");
    const w = c.width / dpr, h = c.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, w, h);

    if (showGrid) {
      ctx.strokeStyle = "rgba(99,102,241,0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    }

    if (pts.length > 1) {
      ctx.strokeStyle = result ? getScoreColor(result.score) : "#818cf8";
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.shadowColor = result ? getScoreColor(result.score) : "#818cf8";
      ctx.shadowBlur = result ? 12 : 6;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    if (result) {
      const { center, radius } = result;
      ctx.strokeStyle = "rgba(148,163,184,0.2)";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [pts, result, showGrid, dpr, screen]);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const onStart = (e) => { e.preventDefault(); if (result) return; setDrawing(true); setPts([getPos(e)]); };
  const onMove  = (e) => { e.preventDefault(); if (!drawing) return; setPts(p => [...p, getPos(e)]); };
  const onEnd   = (e) => {
    e.preventDefault();
    if (!drawing) return;
    setDrawing(false);
    const ev = evaluateCircle(pts);
    if (!ev) return;
    setResult(ev);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    try { localStorage.setItem("drawround_attempts", newAttempts); } catch {}
    if (ev.score > best) {
      setBest(ev.score);
      try { localStorage.setItem("drawround_best", ev.score); } catch {}
    }
  };

  const clear = () => { setPts([]); setResult(null); };

  const scoreColor = result ? getScoreColor(result.score) : "#818cf8";

  // ── SPLASH ────────────────────────────────────────────────────────────────
  if (screen === "splash") return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "linear-gradient(135deg,#0d0d2b,#1a0a3e,#0a1628)", userSelect: "none", position: "relative" }}>

      {/* Background decorative circle art */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.08, pointerEvents: "none" }}>
        <svg width="500" height="500" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="200" fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="20 10"/>
          <circle cx="250" cy="250" r="140" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="12 8"/>
          <circle cx="250" cy="250" r="80" fill="none" stroke="#c4b5fd" strokeWidth="1"/>
          <circle cx="250" cy="250" r="6" fill="#818cf8"/>
        </svg>
      </div>

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", width: "100%", maxWidth: 420, padding: "0 24px" }}>
        <p style={{ color: "#6b7280", letterSpacing: "0.15em", fontSize: 13, textTransform: "uppercase", marginBottom: 8 }}>⭕ The Circle Challenge ⭕</p>

        <h1 style={{ fontSize: 64, fontWeight: 900, margin: 0, lineHeight: 1.1, background: "linear-gradient(135deg,#818cf8,#a78bfa,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Draw
        </h1>
        <h2 style={{ fontSize: 44, fontWeight: 900, marginTop: 0, marginBottom: 48, background: "linear-gradient(135deg,#c084fc,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Round
        </h2>

        <div style={{ animation: "bounce 1s infinite", marginBottom: 32 }} onClick={() => setScreen("game")}>
          <div style={{ cursor: "pointer" }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#facc15", marginBottom: 8 }}>CLICK TO PLAY</p>
            <p style={{ fontSize: 24 }}>⭕</p>
          </div>
        </div>

        {(best > 0 || attempts > 0) && (
          <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 16, padding: "12px 24px", marginBottom: 16, display: "inline-block" }}>
            <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>Your Record</p>
            <p style={{ color: "#f1f5f9", fontSize: 16, fontWeight: 700 }}>Best: <span style={{ color: "#818cf8" }}>{best}</span> &nbsp;·&nbsp; Attempts: <span style={{ color: "#818cf8" }}>{attempts}</span></p>
          </div>
        )}
      </div>

      <div style={{ position: "absolute", bottom: 24, textAlign: "center" }}>
        <Credits />
      </div>

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }`}</style>
    </div>
  );

  // ── GAME ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0f172a", display: "flex", flexDirection: "column", fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(15,23,42,0.95)", backdropFilter: "blur(8px)", flexShrink: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div onClick={() => { clear(); setScreen("splash"); }} style={{ cursor: "pointer", width: 32, height: 32, borderRadius: "50%", border: "2px solid #6366f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #818cf8" }} />
          </div>
          <div>
            <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16, letterSpacing: "-0.02em" }}>DrawRound</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>Can you draw a perfect circle?</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {[["Best", best], ["Tries", attempts]].map(([label, val]) => (
              <div key={label} style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 8, padding: "4px 10px", textAlign: "center" }}>
                <div style={{ color: "#818cf8", fontSize: 10, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{label}</div>
                <div style={{ color: "#f1f5f9", fontSize: 14, fontWeight: 700 }}>{val}</div>
              </div>
            ))}
          </div>
          <button onClick={() => setShowGrid(g => !g)} style={{ background: showGrid ? "rgba(99,102,241,0.2)" : "rgba(51,65,85,0.5)", border: `1px solid ${showGrid ? "rgba(99,102,241,0.4)" : "rgba(71,85,105,0.4)"}`, color: showGrid ? "#818cf8" : "#64748b", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
            {showGrid ? "Grid On" : "Grid Off"}
          </button>
          <button onClick={clear} style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
            Clear
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", cursor: result ? "default" : "crosshair", display: "block" }}
          onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
          onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
        />

        {pts.length === 0 && !result && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <div style={{ width: 120, height: 120, borderRadius: "50%", border: "2px dashed rgba(99,102,241,0.3)", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", border: "2px dashed rgba(99,102,241,0.15)" }} />
            </div>
            <div style={{ color: "#e2e8f0", fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 8 }}>Draw a Perfect Circle</div>
            <div style={{ color: "#475569", fontSize: 14 }}>Click and drag to begin</div>
          </div>
        )}

        {result && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(15,23,42,0.82)", backdropFilter: "blur(4px)" }}>
            <div style={{ background: "rgba(15,23,42,0.95)", border: `1px solid ${scoreColor}44`, borderRadius: 20, padding: "32px 44px", textAlign: "center", maxWidth: 340, boxShadow: `0 0 40px ${scoreColor}22` }}>
              <div style={{ width: 100, height: 100, borderRadius: "50%", border: `4px solid ${scoreColor}`, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px ${scoreColor}44` }}>
                <span style={{ color: scoreColor, fontSize: 30, fontWeight: 800 }}>{result.score}</span>
              </div>
              <div style={{ color: "#f1f5f9", fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{getMessage(result.score)}</div>
              <div style={{ color: "#64748b", fontSize: 13, marginBottom: 24 }}>
                Best: <span style={{ color: "#94a3b8" }}>{best}</span> &nbsp;·&nbsp; Attempt #{attempts}
              </div>
              <button onClick={clear} style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", borderRadius: 10, padding: "10px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: "8px 20px", borderTop: "1px solid rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Credits />
      </div>
      <MusicPlayer />
    </div>
  );
}