import { useState, useRef, useEffect, useCallback } from "react";

const SCORES = [
  [95, "Perfect circle! You're built different. ✨"],
  [85, "Almost perfect! Elite stuff. 🎯"],
  [75, "Pretty circular! Not bad at all. 👏"],
  [60, "Decent effort. Keep practicing. 💪"],
  [40, "Uh... try drawing slower? 🖊️"],
  [20, "Give it another shot. Practice makes perfect. 🔄"],
  [0,  "Bro that's just abstract art. 🎨"],
];

const PLAYLIST = [
  { title: "Sky High",    artist: "nog's picks", src: "/music/skyhigh.mp3"    },
  { title: "Candyland",   artist: "nog's picks", src: "/music/candyland.mp3"  },
  { title: "Shot Callin", artist: "nog's picks", src: "/music/shotcallin.mp3" },
];

function getMessage(score) {
  for (const [t, m] of SCORES) if (score >= t) return m;
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

// ── MUSIC PLAYER ─────────────────────────────────────────────────────────────
function MusicPlayer() {
  const audioRef = useRef(null);
  const animRef  = useRef(null);
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume]     = useState(0.6);
  const [expanded, setExpanded] = useState(false);
  const [bars, setBars]         = useState(Array(28).fill(2));

  const current = PLAYLIST[trackIdx];
  const pct = duration ? (progress / duration) * 100 : 0;
  const fmt = s => isNaN(s) ? "0:00" : `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  // animate visualiser bars
  useEffect(() => {
    if (playing) {
      const tick = () => {
        setBars(b => b.map(() => playing ? 3 + Math.random() * 28 : 2));
        animRef.current = requestAnimationFrame(tick);
      };
      animRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(animRef.current);
      setBars(Array(28).fill(2));
    }
    return () => cancelAnimationFrame(animRef.current);
  }, [playing]);

  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    a.volume = volume;
    const onTime = () => setProgress(a.currentTime);
    const onMeta = () => setDuration(a.duration);
    const onEnd  = () => goNext();
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => { a.removeEventListener("timeupdate", onTime); a.removeEventListener("loadedmetadata", onMeta); a.removeEventListener("ended", onEnd); };
  }, [trackIdx]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  const loadTrack = (idx, autoplay = false) => {
    setTrackIdx(idx); setProgress(0); setPlaying(false);
    setTimeout(() => {
      audioRef.current?.load();
      if (autoplay) { audioRef.current?.play(); setPlaying(true); }
    }, 50);
  };

  const toggle  = () => { if (playing) { audioRef.current?.pause(); setPlaying(false); } else { audioRef.current?.play(); setPlaying(true); } };
  const goNext  = () => loadTrack((trackIdx + 1) % PLAYLIST.length, playing);
  const goPrev  = () => {
    if (progress > 3) { audioRef.current.currentTime = 0; }
    else loadTrack((trackIdx - 1 + PLAYLIST.length) % PLAYLIST.length, playing);
  };
  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (audioRef.current && duration) audioRef.current.currentTime = p * duration;
  };

  const btnStyle = (active) => ({
    background: "none", border: "none", color: active ? "#a5b4fc" : "#64748b",
    cursor: "pointer", fontSize: 18, padding: "4px 8px", transition: "color 0.15s", lineHeight: 1
  });

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 100, userSelect: "none", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <audio ref={audioRef} src={current.src} />

      {/* ── COLLAPSED PILL ── */}
      {!expanded && (
        <div onClick={() => setExpanded(true)} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(15,23,42,0.95)", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 999, padding: "10px 18px 10px 14px", cursor: "pointer", backdropFilter: "blur(16px)", boxShadow: "0 4px 24px rgba(99,102,241,0.2)", minWidth: 220 }}>
          {/* mini visualiser */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 22, width: 32, flexShrink: 0 }}>
            {bars.slice(0, 8).map((h, i) => (
              <div key={i} style={{ flex: 1, borderRadius: 2, background: playing ? `hsl(${240 + i * 8},70%,65%)` : "#374151", height: playing ? h * 0.6 : 4, transition: "height 0.08s ease" }} />
            ))}
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ color: "#f1f5f9", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{current.title}</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>{current.artist}</div>
          </div>
          {/* mini controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }} onClick={e => e.stopPropagation()}>
            <button onClick={goPrev} style={btnStyle(false)}>⏮</button>
            <button onClick={toggle} style={{ ...btnStyle(true), background: "rgba(99,102,241,0.25)", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, border: "1px solid rgba(99,102,241,0.4)" }}>
              {playing ? "⏸" : "▶"}
            </button>
            <button onClick={goNext} style={btnStyle(false)}>⏭</button>
          </div>
        </div>
      )}

      {/* ── EXPANDED CARD ── */}
      {expanded && (
        <div style={{ width: 300, background: "rgba(15,23,42,0.97)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 24, padding: 20, backdropFilter: "blur(20px)", boxShadow: "0 8px 48px rgba(99,102,241,0.25)" }}>

          {/* header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 18 }}>
                {bars.slice(0, 4).map((h, i) => (
                  <div key={i} style={{ width: 3, borderRadius: 2, background: playing ? "#818cf8" : "#374151", height: playing ? Math.max(3, h * 0.45) : 4, transition: "height 0.08s ease" }} />
                ))}
              </div>
              <span style={{ color: "#818cf8", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Now Playing</span>
            </div>
            <button onClick={() => setExpanded(false)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>✕</button>
          </div>

          {/* VISUALISER BAR DISPLAY */}
          <div style={{ width: "100%", height: 64, background: "rgba(99,102,241,0.06)", borderRadius: 12, border: "1px solid rgba(99,102,241,0.15)", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 2, padding: "8px 10px", marginBottom: 16, overflow: "hidden" }}>
            {bars.map((h, i) => (
              <div key={i} style={{ flex: 1, borderRadius: "3px 3px 0 0", background: playing ? `hsl(${230 + i * 4},70%,${55 + (h / 31) * 20}%)` : "#1e293b", height: Math.max(3, h), maxHeight: 48, transition: "height 0.08s ease", boxShadow: playing ? `0 0 6px hsl(${230 + i * 4},70%,60%)` : "none" }} />
            ))}
          </div>

          {/* track info */}
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 700, marginBottom: 3 }}>{current.title}</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>{current.artist}</div>
          </div>

          {/* progress bar */}
          <div style={{ marginBottom: 6 }}>
            <div onClick={seek} style={{ height: 6, background: "rgba(99,102,241,0.2)", borderRadius: 6, cursor: "pointer", position: "relative", marginBottom: 4 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#6366f1,#a78bfa)", borderRadius: 6, transition: "width 0.2s" }} />
              <div style={{ position: "absolute", top: "50%", left: `${pct}%`, transform: "translate(-50%,-50%)", width: 13, height: 13, borderRadius: "50%", background: "#818cf8", boxShadow: "0 0 8px #6366f1", border: "2px solid #0f172a" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#475569", fontSize: 11 }}>
              <span>{fmt(progress)}</span><span>{fmt(duration)}</span>
            </div>
          </div>

          {/* controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 16, marginTop: 8 }}>
            <button onClick={goPrev} style={btnStyle(false)} title="Previous / Restart">⏮</button>
            <button onClick={toggle} style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", border: "none", color: "#fff", cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(99,102,241,0.5)", transition: "transform 0.1s" }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.93)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
              {playing ? "⏸" : "▶"}
            </button>
            <button onClick={goNext} style={btnStyle(false)} title="Next">⏭</button>
          </div>

          {/* volume */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ color: "#475569", fontSize: 14, flexShrink: 0 }}>{volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}</span>
            <div style={{ flex: 1, position: "relative", height: 6, background: "rgba(99,102,241,0.2)", borderRadius: 6, cursor: "pointer" }} onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setVolume(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))); }}>
              <div style={{ height: "100%", width: `${volume * 100}%`, background: "linear-gradient(90deg,#6366f1,#a78bfa)", borderRadius: 6 }} />
              <div style={{ position: "absolute", top: "50%", left: `${volume * 100}%`, transform: "translate(-50%,-50%)", width: 13, height: 13, borderRadius: "50%", background: "#818cf8", border: "2px solid #0f172a" }} />
            </div>
          </div>

          {/* playlist */}
          <div style={{ borderTop: "1px solid rgba(99,102,241,0.15)", paddingTop: 12 }}>
            {PLAYLIST.map((t, i) => (
              <div key={i} onClick={() => loadTrack(i, true)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10, cursor: "pointer", background: i === trackIdx ? "rgba(99,102,241,0.14)" : "transparent", marginBottom: 3, transition: "background 0.15s", border: i === trackIdx ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === trackIdx ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, color: i === trackIdx ? "#fff" : "#64748b", fontWeight: 700 }}>
                  {i === trackIdx && playing ? "♪" : i + 1}
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div style={{ color: i === trackIdx ? "#f1f5f9" : "#94a3b8", fontSize: 13, fontWeight: i === trackIdx ? 700 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</div>
                  <div style={{ color: "#475569", fontSize: 11 }}>{t.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
      `}</style>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const canvasRef = useRef(null);
  const [screen, setScreen] = useState("splash");
  const [drawing, setDrawing] = useState(false);
  const [pts, setPts] = useState([]);
  const [result, setResult] = useState(null);
  const [showGrid, setShowGrid] = useState(true);
  const [best, setBest] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const dpr = window.devicePixelRatio || 1;

  const resize = useCallback(() => {
    const c = canvasRef.current; if (!c) return;
    c.width = c.offsetWidth * dpr; c.height = c.offsetHeight * dpr;
  }, [dpr]);

  useEffect(() => { resize(); window.addEventListener("resize", resize); return () => window.removeEventListener("resize", resize); }, [resize]);

  useEffect(() => {
    if (screen !== "game") return;
    const c = canvasRef.current; if (!c) return;
    c.width = c.offsetWidth * dpr; c.height = c.offsetHeight * dpr;
    const ctx = c.getContext("2d");
    const w = c.width / dpr, h = c.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#0f172a"; ctx.fillRect(0, 0, w, h);
    if (showGrid) {
      ctx.strokeStyle = "rgba(99,102,241,0.08)"; ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    }
    if (pts.length > 1) {
      ctx.strokeStyle = result ? getScoreColor(result.score) : "#818cf8";
      ctx.lineWidth = 3; ctx.lineJoin = "round"; ctx.lineCap = "round";
      ctx.shadowColor = result ? getScoreColor(result.score) : "#818cf8"; ctx.shadowBlur = result ? 12 : 6;
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.stroke(); ctx.shadowBlur = 0;
    }
    if (result) {
      const { center, radius } = result;
      ctx.strokeStyle = "rgba(148,163,184,0.2)"; ctx.lineWidth = 2; ctx.setLineDash([8, 6]);
      ctx.beginPath(); ctx.arc(center.x, center.y, radius, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    }
  }, [pts, result, showGrid, dpr, screen]);

  const getPos = e => { const r = canvasRef.current.getBoundingClientRect(); const s = e.touches ? e.touches[0] : e; return { x: s.clientX - r.left, y: s.clientY - r.top }; };
  const onStart = e => {
    e.preventDefault();
    clear();
    setDrawing(true);
    setPts([getPos(e)]);
  };
  const onMove  = e => { e.preventDefault(); if (!drawing) return; setPts(p => [...p, getPos(e)]); };
  const onEnd   = e => {
    e.preventDefault(); if (!drawing) return; setDrawing(false);
    const ev = evaluateCircle(pts); if (!ev) return;
    setResult(ev);
    const na = attempts + 1; setAttempts(na);
    if (ev.score > best) setBest(ev.score);
  };
  const clear = () => { setPts([]); setResult(null); };
  const scoreColor = result ? getScoreColor(result.score) : "#818cf8";

  if (screen === "splash") return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "linear-gradient(135deg,#0d0d2b,#1a0a3e,#0a1628)", userSelect: "none", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.08, pointerEvents: "none" }}>
        <svg width="500" height="500" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="220" fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="20 10"/>
          <circle cx="250" cy="250" r="155" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="12 8"/>
          <circle cx="250" cy="250" r="90"  fill="none" stroke="#c4b5fd" strokeWidth="1"/>
          <circle cx="250" cy="250" r="6"   fill="#818cf8"/>
        </svg>
      </div>
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", width: "100%", maxWidth: 420, padding: "0 24px" }}>
        <p style={{ color: "#6b7280", letterSpacing: "0.15em", fontSize: 13, textTransform: "uppercase", marginBottom: 8 }}>⭕ The Circle Challenge ⭕</p>
        <h1 style={{ fontSize: 64, fontWeight: 900, margin: 0, lineHeight: 1.1, background: "linear-gradient(135deg,#818cf8,#a78bfa,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Draw</h1>
        <h2 style={{ fontSize: 44, fontWeight: 900, marginTop: 0, marginBottom: 48, background: "linear-gradient(135deg,#c084fc,#f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Round</h2>
        <div style={{ cursor: "pointer", marginBottom: 32 }} onClick={() => setScreen("game")}>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#facc15", marginBottom: 8, animation: "pulse 2s infinite" }}>CLICK TO PLAY</p>
          <p style={{ fontSize: 24 }}>⭕</p>
        </div>
        {(best > 0 || attempts > 0) && (
          <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 16, padding: "12px 24px", display: "inline-block" }}>
            <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>Your Record</p>
            <p style={{ color: "#f1f5f9", fontSize: 16, fontWeight: 700 }}>Best: <span style={{ color: "#818cf8" }}>{best}</span> &nbsp;·&nbsp; Attempts: <span style={{ color: "#818cf8" }}>{attempts}</span></p>
          </div>
        )}
      </div>
      <div style={{ position: "absolute", bottom: 24 }}><Credits /></div>
      <MusicPlayer />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }`}</style>
    </div>
  );

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0f172a", display: "flex", flexDirection: "column", fontFamily: "'Inter', system-ui, sans-serif", overflow: "hidden" }}>
      <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(15,23,42,0.95)", backdropFilter: "blur(8px)", flexShrink: 0 }}>
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
          <button onClick={() => setShowGrid(g => !g)} style={{ background: showGrid ? "rgba(99,102,241,0.2)" : "rgba(51,65,85,0.5)", border: `1px solid ${showGrid ? "rgba(99,102,241,0.4)" : "rgba(71,85,105,0.4)"}`, color: showGrid ? "#818cf8" : "#64748b", borderRadius: 8, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>{showGrid ? "Grid On" : "Grid Off"}</button>
          <button onClick={clear} style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc", borderRadius: 8, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Clear</button>
        </div>
      </div>

      <div style={{ flex: 1, position: "relative", overflow: "hidden", userSelect: "none", WebkitUserSelect: "none" }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", cursor: result ? "default" : "crosshair", display: "block" }}
          onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
          onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd} />
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
          <div style={{ position: "absolute", bottom: 100, left: "50%", transform: "translateX(-50%)", zIndex: 10, pointerEvents: "none" }}>
            <div style={{ background: "rgba(15,23,42,0.95)", border: `1px solid ${scoreColor}44`, borderRadius: 20, padding: "24px 44px", textAlign: "center", whiteSpace: "nowrap", boxShadow: `0 0 40px ${scoreColor}22` }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", border: `4px solid ${scoreColor}`, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px ${scoreColor}44` }}>
                <span style={{ color: scoreColor, fontSize: 26, fontWeight: 800 }}>{result.score}</span>
              </div>
              <div style={{ color: "#f1f5f9", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{getMessage(result.score)}</div>
              <div style={{ color: "#64748b", fontSize: 12 }}>Best: <span style={{ color: "#94a3b8" }}>{best}</span> &nbsp;·&nbsp; Attempt #{attempts}</div>
              <div style={{ color: "#475569", fontSize: 11, marginTop: 8 }}>Draw anywhere to go again</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "8px 20px", borderTop: "1px solid rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Credits />
      </div>
      <MusicPlayer />
    </div>
  );
}
