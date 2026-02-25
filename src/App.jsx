import { useState, useRef, useEffect, useCallback } from "react";

const PLAYLIST = [
  { title: "CandyLand", artist: "DJ Aldo", src: "/music/CandyLand.mp3", cover: "/covers/CandyLand.jpg" },
  { title: "Sky High",  artist: "DJ Aldo", src: "/music/SkyHigh.mp3",   cover: "/covers/SkyHigh.jpg"   },
];

const FIRE_PLAYLIST = [
  { title: "Heart on Ice", artist: "Rod Wave",     src: "/music/Heart on Ice.mp3", cover: "/covers/HeartOnIce.jpg" },
  { title: "KK Anthem",    artist: "Ryan Baldwin", src: "/music/KKAnthem.mp3",      cover: "/covers/KKAnthem.jpg"   },
  { title: "Shot Callin",  artist: "NBA YoungBoy", src: "/music/ShotCallin.mp3",   cover: "/covers/ShotCallin.jpg" },
];

const SECRET_CODE = "6969"; // Temporary code

// ── KEYPAD COMPONENT ──────────────────────────────────────────────────────────
function Keypad({ onClose, onUnlock }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const handleNum = (n) => {
    if (code.length >= 4) return;
    const newCode = code + n;
    setCode(newCode);
    
    if (newCode.length === 4) {
      if (newCode === SECRET_CODE) {
        onUnlock();
        setTimeout(onClose, 500);
      } else {
        setError(true);
        setTimeout(() => {
          setCode("");
          setError(false);
        }, 800);
      }
    }
  };

  const handleClear = () => {
    setCode("");
    setError(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, animation: "fadeIn 0.2s" }}>
      <div style={{ background: "rgba(15,23,42,0.98)", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 24, padding: 32, width: 320, boxShadow: "0 8px 48px rgba(99,102,241,0.3)" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <div style={{ color: "#f1f5f9", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>🔥 Fire Playlist</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>Enter the secret code</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#64748b", fontSize: 24, cursor: "pointer", lineHeight: 1, transition: "color 0.2s" }}>✕</button>
        </div>

        {/* Code Display */}
        <div style={{ background: error ? "rgba(239,68,68,0.15)" : "rgba(99,102,241,0.1)", border: error ? "2px solid #ef4444" : "2px solid rgba(99,102,241,0.3)", borderRadius: 16, padding: "20px 0", marginBottom: 24, textAlign: "center", transition: "all 0.3s" }}>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            {[0, 1, 2, 3].map(i => (
              <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: code.length > i ? (error ? "#ef4444" : "#818cf8") : "rgba(99,102,241,0.2)", transition: "all 0.3s", boxShadow: code.length > i ? (error ? "0 0 12px #ef4444" : "0 0 12px #818cf8") : "none" }} />
            ))}
          </div>
        </div>

        {/* Keypad Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button key={n} onClick={() => handleNum(String(n))} style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 12, padding: "16px 0", color: "#f1f5f9", fontSize: 20, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>
              {n}
            </button>
          ))}
          <button onClick={handleClear} style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: "16px 0", color: "#ef4444", fontSize: 14, fontWeight: 700, cursor: "pointer", gridColumn: "1", transition: "all 0.2s" }}>
            CLR
          </button>
          <button onClick={() => handleNum("0")} style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 12, padding: "16px 0", color: "#f1f5f9", fontSize: 20, fontWeight: 700, cursor: "pointer", gridColumn: "2", transition: "all 0.2s" }}>
            0
          </button>
        </div>

        {error && (
          <div style={{ color: "#ef4444", fontSize: 12, textAlign: "center", fontWeight: 600 }}>
            ❌ Wrong code! Try again.
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        button:hover { transform: scale(1.05); }
        button:active { transform: scale(0.95); }
      `}</style>
    </div>
  );
}

// ── COVER ART ─────────────────────────────────────────────────────────────────
function CoverArt({ track, playing }) {
  const [imgFailed, setImgFailed] = useState(false);
  // Reset failed state when track changes
  useEffect(() => setImgFailed(false), [track]);

  const showImg = track.cover && !imgFailed;

  return (
    <div style={{ width:"100%", aspectRatio:"1/1", borderRadius:16, overflow:"hidden", marginBottom:14, position:"relative", background:"linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.08))", border:"1px solid rgba(99,102,241,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
      {showImg ? (
        <img
          src={track.cover}
          alt={track.title}
          onError={() => setImgFailed(true)}
          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block", animation: playing ? "subtlePulse 4s ease-in-out infinite" : "none" }}
        />
      ) : (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", width:"100%", height:"100%" }}>
          <div style={{ width:72, height:72, borderRadius:"50%", border:"2px solid rgba(99,102,241,0.4)", display:"flex", alignItems:"center", justifyContent:"center", animation: playing ? "spin 4s linear infinite" : "none" }}>
            <div style={{ width:44, height:44, borderRadius:"50%", border:"2px solid rgba(99,102,241,0.25)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:"#6366f1" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MUSIC PLAYER ─────────────────────────────────────────────────────────────
function MusicPlayer() {
  const audioRef  = useRef(null);

  // Create audio element once on mount — no src yet so no network request
  useEffect(() => {
    const a = document.createElement("audio");
    a.preload = "none";
    audioRef.current = a;
    return () => { a.pause(); a.src = ""; };
  }, []);

  const [fireUnlocked, setFireUnlocked] = useState(() => {
    try { return localStorage.getItem("drawround_fire") === "true"; } catch { return false; }
  });
  const [showKeypad, setShowKeypad] = useState(false);
  const [clickSequence, setClickSequence] = useState([]);
  const sequenceTimerRef = useRef(null);

  const activePlaylist = fireUnlocked ? [...PLAYLIST, ...FIRE_PLAYLIST] : PLAYLIST;
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing,  setPlaying]  = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume,   setVolume]   = useState(0.6);
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("main");
  const activeTabRef = useRef("main");
  const trackIdxRef  = useRef(0);

  const setTab = (tab) => { activeTabRef.current = tab; setActiveTab(tab); };
  const setTrack = (idx) => { trackIdxRef.current = idx; setTrackIdx(idx); };

  const current = activePlaylist[trackIdx];
  const pct = duration ? (progress / duration) * 100 : 0;
  const fmt = s => isNaN(s) ? "0:00" : `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;

  // Attach persistent event listeners once audio element exists
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setProgress(a.currentTime);
    const onMeta = () => setDuration(a.duration);
    const onEnd  = () => {
      const tab  = activeTabRef.current;
      const list = tab === "fire" ? FIRE_PLAYLIST : PLAYLIST;
      const base = tab === "fire" ? PLAYLIST.length : 0;
      const cur  = trackIdxRef.current;
      const last = base + list.length - 1;
      if (cur >= last) {
        setPlaying(false);
      } else {
        const next = cur + 1;
        setTrack(next);
        const fullList = [...PLAYLIST, ...FIRE_PLAYLIST];
        a.src = fullList[next].src;
        a.load();
        a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    };
    a.addEventListener("timeupdate",     onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended",          onEnd);
    return () => {
      a.removeEventListener("timeupdate",     onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended",          onEnd);
    };
  }, [fireUnlocked]); // re-attach only if fire unlocked (activePlaylist changes)

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Handle secret corner click sequence
  const handleCornerClick = (corner) => {
    const newSeq = [...clickSequence, corner];
    setClickSequence(newSeq);
    if (sequenceTimerRef.current) clearTimeout(sequenceTimerRef.current);
    if (newSeq.length === 3) {
      if (newSeq[0] === "tl" && newSeq[1] === "br" && newSeq[2] === "bl") setShowKeypad(true);
      setClickSequence([]);
    } else {
      sequenceTimerRef.current = setTimeout(() => setClickSequence([]), 3000);
    }
  };

  const handleUnlock = () => {
    setFireUnlocked(true);
    try { localStorage.setItem("drawround_fire", "true"); } catch {}
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      if (!a.src || a.src === window.location.href) {
        a.src = activePlaylist[trackIdx].src;
        a.load();
      }
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const goTo = (idx) => {
    const a = audioRef.current;
    if (!a) return;
    const wasPlaying = playing;
    a.pause();
    setPlaying(false);
    setTrack(idx);
    setProgress(0);
    setDuration(0);
    a.src = activePlaylist[idx].src;
    a.load();
    if (wasPlaying) {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const next = () => goTo((trackIdx + 1) % activePlaylist.length);
  const prev = () => {
    const a = audioRef.current;
    if (a && progress > 3) { a.currentTime = 0; }
    else goTo((trackIdx - 1 + activePlaylist.length) % activePlaylist.length);
  };

  const seek = e => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const s = { btn: { background:"none", border:"none", color:"#64748b", cursor:"pointer", fontSize:18, padding:"4px 8px" } };

  return (
    <>
      {/* Invisible corner click zones */}
      <div onClick={() => handleCornerClick("tl")} style={{ position:"fixed", top:0, left:0, width:80, height:80, zIndex:99, cursor:"default" }} />
      <div onClick={() => handleCornerClick("br")} style={{ position:"fixed", bottom:0, right:0, width:80, height:80, zIndex:99, cursor:"default" }} />
      <div onClick={() => handleCornerClick("bl")} style={{ position:"fixed", bottom:0, left:0, width:80, height:80, zIndex:99, cursor:"default" }} />

      {showKeypad && <Keypad onClose={() => setShowKeypad(false)} onUnlock={handleUnlock} />}

      <div style={{ position:"fixed", bottom:20, right:20, zIndex:100, userSelect:"none", fontFamily:"'Inter',system-ui,sans-serif" }}>

        {/* collapsed pill */}
        {!expanded && (
          <div onClick={() => setExpanded(true)} style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(15,23,42,0.95)", border:"1px solid rgba(99,102,241,0.4)", borderRadius:999, padding:"10px 16px 10px 12px", cursor:"pointer", backdropFilter:"blur(16px)", boxShadow:"0 4px 24px rgba(99,102,241,0.2)", minWidth:220 }}>
            <div style={{ display:"flex", alignItems:"flex-end", gap:2, height:20, width:20, flexShrink:0 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ flex:1, borderRadius:2, background: playing ? "#818cf8" : "#374151", height: playing ? undefined : 4, animation: playing ? `bar${i} 0.8s ease-in-out ${i*0.15}s infinite alternate` : "none" }} />
              ))}
            </div>
            <div style={{ flex:1, overflow:"hidden" }}>
              <div style={{ color:"#f1f5f9", fontSize:13, fontWeight:700, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{current.title}</div>
              <div style={{ color:"#64748b", fontSize:11 }}>{current.artist}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:4 }} onClick={e => e.stopPropagation()}>
              <button onClick={prev} style={s.btn}>⏮</button>
              <button onClick={toggle} style={{ width:34, height:34, borderRadius:"50%", background:"rgba(99,102,241,0.3)", border:"1px solid rgba(99,102,241,0.5)", color:"#a5b4fc", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>
                {playing ? "⏸" : "▶"}
              </button>
              <button onClick={next} style={s.btn}>⏭</button>
            </div>
          </div>
        )}

        {/* expanded card */}
        {expanded && (
          <div style={{ width:280, background:"rgba(15,23,42,0.97)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:22, padding:18, backdropFilter:"blur(20px)", boxShadow:"0 8px 48px rgba(99,102,241,0.25)" }}>

            {/* header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ display:"flex", alignItems:"flex-end", gap:2, height:16 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width:3, borderRadius:2, background: playing ? "#818cf8" : "#374151", height: playing ? undefined : 4, animation: playing ? `bar${i} 0.8s ease-in-out ${i*0.15}s infinite alternate` : "none" }} />
                  ))}
                </div>
                <span style={{ color:"#818cf8", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>Now Playing</span>
              </div>
              <button onClick={() => setExpanded(false)} style={{ background:"none", border:"none", color:"#475569", cursor:"pointer", fontSize:18, lineHeight:1 }}>✕</button>
            </div>

            {/* cover art */}
            <CoverArt track={current} playing={playing} />

            {/* title */}
            <div style={{ textAlign:"center", marginBottom:14 }}>
              <div style={{ color:"#f1f5f9", fontSize:15, fontWeight:700, marginBottom:3 }}>{current.title}</div>
              <div style={{ color:"#64748b", fontSize:12 }}>{current.artist}</div>
            </div>

            {/* progress */}
            <div onClick={seek} style={{ height:6, background:"rgba(99,102,241,0.2)", borderRadius:6, cursor:"pointer", position:"relative", marginBottom:4 }}>
              <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#6366f1,#a78bfa)", borderRadius:6, transition:"width 0.25s" }} />
              <div style={{ position:"absolute", top:"50%", left:`${pct}%`, transform:"translate(-50%,-50%)", width:13, height:13, borderRadius:"50%", background:"#818cf8", border:"2px solid #0f172a", boxShadow:"0 0 8px #6366f1" }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", color:"#475569", fontSize:11, marginBottom:16 }}>
              <span>{fmt(progress)}</span><span>{fmt(duration)}</span>
            </div>

            {/* controls */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, marginBottom:16 }}>
              <button onClick={prev} style={s.btn}>⏮</button>
              <button onClick={toggle} style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", border:"none", color:"#fff", cursor:"pointer", fontSize:20, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 20px rgba(99,102,241,0.5)" }}>
                {playing ? "⏸" : "▶"}
              </button>
              <button onClick={next} style={s.btn}>⏭</button>
            </div>

            {/* volume */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
              <span style={{ color:"#475569", fontSize:14 }}>{volume===0?"🔇":volume<0.5?"🔉":"🔊"}</span>
              <input type="range" min="0" max="1" step="0.01" value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                style={{ flex:1, accentColor:"#6366f1", cursor:"pointer" }} />
            </div>

            {/* playlist tabs */}
            <div style={{ borderTop:"1px solid rgba(99,102,241,0.15)", paddingTop:12 }}>
              {fireUnlocked && (
                <div style={{ display:"flex", gap:6, marginBottom:10 }}>
                  <button onClick={() => setTab("main")} style={{ flex:1, padding:"5px 0", borderRadius:8, border: activeTab==="main" ? "1px solid rgba(99,102,241,0.5)" : "1px solid rgba(99,102,241,0.15)", background: activeTab==="main" ? "rgba(99,102,241,0.2)" : "transparent", color: activeTab==="main" ? "#a5b4fc" : "#475569", fontSize:11, fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}>
                    🎵 DJ Aldo
                  </button>
                  <button onClick={() => setTab("fire")} style={{ flex:1, padding:"5px 0", borderRadius:8, border: activeTab==="fire" ? "1px solid rgba(245,158,11,0.5)" : "1px solid rgba(245,158,11,0.15)", background: activeTab==="fire" ? "rgba(245,158,11,0.15)" : "transparent", color: activeTab==="fire" ? "#fbbf24" : "#475569", fontSize:11, fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}>
                    🔥 Fire
                  </button>
                </div>
              )}
              <div style={{ maxHeight:138, overflowY:"auto", overflowX:"hidden", paddingRight:2 }}>
                {(fireUnlocked && activeTab==="fire" ? FIRE_PLAYLIST : PLAYLIST).map((t, localIdx) => {
                  const globalIdx = fireUnlocked && activeTab==="fire" ? PLAYLIST.length + localIdx : localIdx;
                  const isActive = trackIdx === globalIdx;
                  const isFire = fireUnlocked && activeTab==="fire";
                  return (
                    <div key={globalIdx} onClick={() => goTo(globalIdx)} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 8px", borderRadius:10, cursor:"pointer", background: isActive ? (isFire ? "rgba(245,158,11,0.12)" : "rgba(99,102,241,0.14)") : "transparent", border: isActive ? (isFire ? "1px solid rgba(245,158,11,0.3)" : "1px solid rgba(99,102,241,0.25)") : "1px solid transparent", marginBottom:3, transition:"background 0.15s" }}>
                      <div style={{ width:26, height:26, borderRadius:"50%", flexShrink:0, background: isActive ? (isFire ? "linear-gradient(135deg,#f59e0b,#ef4444)" : "linear-gradient(135deg,#6366f1,#8b5cf6)") : (isFire ? "rgba(245,158,11,0.1)" : "rgba(99,102,241,0.1)"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color: isActive ? "#fff" : "#64748b", fontWeight:700 }}>
                        {isActive && playing ? "♪" : localIdx+1}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ color: isActive ? "#f1f5f9" : "#94a3b8", fontSize:12, fontWeight: isActive ? 700 : 400, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.title}</div>
                        <div style={{ color:"#475569", fontSize:11 }}>{t.artist}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes bar0 { from{height:4px}  to{height:16px} }
          @keyframes bar1 { from{height:12px} to{height:5px}  }
          @keyframes bar2 { from{height:7px}  to{height:14px} }
          @keyframes spin  { to{transform:rotate(360deg)} }
          @keyframes subtlePulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
          html, body { cursor: default !important; }
          *, *:focus, *:active { outline: none !important; -webkit-tap-highlight-color: transparent !important; }
          button, div, input, canvas { -webkit-tap-highlight-color: transparent !important; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 4px; }
        `}</style>
      </div>
    </>
  );
}


// ── DRAW PAD ──────────────────────────────────────────────────────────────────
const SHAPES = ["free","line","rect","ellipse","triangle","arrow"];
const SHAPE_ICONS = { free:"✏️", line:"╱", rect:"▭", ellipse:"⬭", triangle:"△", arrow:"→" };
const TOOLS = ["pen","brush","eraser","fill","shapes","eyedropper"];
const TOOL_ICONS = {
  pen: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  brush: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.06 11.9l8.07-8.06a2.85 2.85 0 114.03 4.03l-8.06 8.08"/><path d="M7.07 14.94C5.79 16.2 5.5 19 5.5 19s2.8-.29 4.06-1.57"/><path d="M4 20l1.5-1.5"/></svg>,
  eraser: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16l10-10 7 7-2.5 2.5"/><path d="M6.0 11.0l4 4"/></svg>,
  fill: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 11L8 2l-5.5 9.5a5.5 5.5 0 0011 0z"/><path d="M19 11c0 3.04-2.46 5.5-5.5 5.5S8 14.04 8 11"/><path d="M19 11h2a2 2 0 010 4h-1a2 2 0 00-2 2v1a2 2 0 01-2 2 2 2 0 01-2-2c0-1.5 1-3 3-3"/></svg>,
  shapes: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="8" height="8"/><circle cx="17" cy="7" r="4"/><polygon points="3,21 7,13 11,21"/><line x1="14" y1="14" x2="20" y2="20"/></svg>,
  eyedropper: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22l1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="M15 6l3.4-3.4a2 2 0 012.8 2.8L18 9l3 3-6 6-3-3-3.5 3.5H6v-3.5L15 6z"/></svg>,
};

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return [r,g,b];
}
function rgbMatch(d, i, [r,g,b], tol=32) {
  return Math.abs(d[i]-r)<tol && Math.abs(d[i+1]-g)<tol && Math.abs(d[i+2]-b)<tol;
}
function floodFill(ctx, x, y, fillColor, canvasW, canvasH) {
  const imgData = ctx.getImageData(0, 0, canvasW, canvasH);
  const d = imgData.data;
  const si = (Math.floor(y)*canvasW + Math.floor(x))*4;
  const target = [d[si], d[si+1], d[si+2], d[si+3]];
  const fill = [...hexToRgb(fillColor), 255];
  if (target[0]===fill[0]&&target[1]===fill[1]&&target[2]===fill[2]) return;
  const stack = [Math.floor(x) + Math.floor(y)*canvasW];
  const visited = new Uint8Array(canvasW*canvasH);
  while (stack.length) {
    const idx = stack.pop();
    if (visited[idx]) continue;
    visited[idx] = 1;
    const i = idx*4;
    if (!rgbMatch(d, i, target)) continue;
    d[i]=fill[0]; d[i+1]=fill[1]; d[i+2]=fill[2]; d[i+3]=fill[3];
    const px = idx%canvasW, py = Math.floor(idx/canvasW);
    if (px>0) stack.push(idx-1);
    if (px<canvasW-1) stack.push(idx+1);
    if (py>0) stack.push(idx-canvasW);
    if (py<canvasH-1) stack.push(idx+canvasW);
  }
  ctx.putImageData(imgData, 0, 0);
}

function DrawPad({ onBack }) {
  const canvasRef  = useRef(null);
  const previewRef = useRef(null); // overlay for shape preview
  const historyRef = useRef([]);
  const histIdxRef = useRef(-1);

  const [tool,      setTool]      = useState("pen");
  const [shape,     setShape]     = useState("rect");
  const [color,     setColor]     = useState("#818cf8");
  const [size,      setSize]      = useState(4);
  const [opacity,   setOpacity]   = useState(1);
  const [showShapes,setShowShapes]= useState(false);
  const [showSize,  setShowSize]  = useState(false);
  const [drawing,   setDrawing]   = useState(false);
  const [startPt,   setStartPt]   = useState(null);
  const [canUndo,   setCanUndo]   = useState(false);
  const [canRedo,   setCanRedo]   = useState(false);

  const PRESETS = ["#818cf8","#f472b6","#34d399","#fbbf24","#f87171","#60a5fa","#a78bfa","#ffffff","#000000","#0f172a"];

  const dpr = window.devicePixelRatio||1;

  const initCanvas = (c) => {
    if (!c) return;
    c.width  = c.offsetWidth  * dpr;
    c.height = c.offsetHeight * dpr;
    const ctx = c.getContext("2d");
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0,0,c.offsetWidth,c.offsetHeight);
    saveHistory();
  };

  useEffect(() => {
    const c = canvasRef.current;
    const p = previewRef.current;
    if (!c || !p) return;
    initCanvas(c);
    p.width  = c.offsetWidth  * dpr;
    p.height = c.offsetHeight * dpr;
    p.getContext("2d").setTransform(dpr,0,0,dpr,0,0);
    const onResize = () => {
      const img = c.toDataURL();
      c.width = c.offsetWidth*dpr; c.height = c.offsetHeight*dpr;
      p.width = c.offsetWidth*dpr; p.height = c.offsetHeight*dpr;
      const ctx = c.getContext("2d");
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const i = new Image(); i.onload = ()=>ctx.drawImage(i,0,0); i.src=img;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const saveHistory = () => {
    const c = canvasRef.current; if (!c) return;
    const snap = c.toDataURL();
    const h = historyRef.current.slice(0, histIdxRef.current+1);
    h.push(snap);
    if (h.length > 40) h.shift();
    historyRef.current = h;
    histIdxRef.current = h.length-1;
    setCanUndo(histIdxRef.current > 0);
    setCanRedo(false);
  };

  const undo = () => {
    if (histIdxRef.current <= 0) return;
    histIdxRef.current--;
    restoreHistory();
    setCanUndo(histIdxRef.current > 0);
    setCanRedo(true);
  };
  const redo = () => {
    if (histIdxRef.current >= historyRef.current.length-1) return;
    histIdxRef.current++;
    restoreHistory();
    setCanUndo(true);
    setCanRedo(histIdxRef.current < historyRef.current.length-1);
  };
  const restoreHistory = () => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const img = new Image();
    img.onload = () => { ctx.clearRect(0,0,c.width,c.height); ctx.drawImage(img,0,0,c.offsetWidth,c.offsetHeight); };
    img.src = historyRef.current[histIdxRef.current];
  };

  const clearCanvas = () => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d");
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.fillStyle="#0f172a"; ctx.fillRect(0,0,c.offsetWidth,c.offsetHeight);
    saveHistory();
  };

  const saveImage = () => {
    const c = canvasRef.current; if (!c) return;
    const a = document.createElement("a");
    a.download = "drawround-art.png";
    a.href = c.toDataURL("image/png");
    a.click();
  };

  const getPos = (e, c) => {
    const r = c.getBoundingClientRect();
    const s = e.touches ? e.touches[0] : e;
    return { x: s.clientX - r.left, y: s.clientY - r.top };
  };

  const setupCtx = (ctx, isEraser) => {
    ctx.globalAlpha  = opacity;
    ctx.lineCap      = "round";
    ctx.lineJoin     = "round";
    if (isEraser) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth   = size * 4;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth   = tool==="brush" ? size*3 : size;
    }
  };

  const drawShape = (ctx, s, e, type, stroke, fill, lw) => {
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = stroke;
    ctx.fillStyle   = fill || "transparent";
    ctx.lineWidth   = lw;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
    ctx.beginPath();
    const w = e.x-s.x, h = e.y-s.y;
    if (type==="rect") {
      ctx.rect(s.x, s.y, w, h);
    } else if (type==="ellipse") {
      ctx.ellipse(s.x+w/2, s.y+h/2, Math.abs(w/2), Math.abs(h/2), 0, 0, Math.PI*2);
    } else if (type==="line") {
      ctx.moveTo(s.x,s.y); ctx.lineTo(e.x,e.y);
    } else if (type==="triangle") {
      ctx.moveTo(s.x+w/2,s.y); ctx.lineTo(e.x,e.y); ctx.lineTo(s.x,e.y); ctx.closePath();
    } else if (type==="arrow") {
      const angle = Math.atan2(h,w);
      const len   = Math.hypot(w,h);
      const hs    = Math.min(len*0.4, 24);
      ctx.moveTo(s.x,s.y); ctx.lineTo(e.x,e.y);
      ctx.lineTo(e.x - hs*Math.cos(angle-0.4), e.y - hs*Math.sin(angle-0.4));
      ctx.moveTo(e.x,e.y);
      ctx.lineTo(e.x - hs*Math.cos(angle+0.4), e.y - hs*Math.sin(angle+0.4));
    }
    ctx.stroke();
    if (fill && type!=="line" && type!=="arrow") ctx.fill();
    ctx.restore();
  };

  const onStart = (e) => {
    e.preventDefault();
    const c = canvasRef.current; if (!c) return;
    const pos = getPos(e, c);

    if (tool === "fill") {
      const ctx = c.getContext("2d");
      floodFill(ctx, pos.x, pos.y, color, c.width/dpr|0, c.height/dpr|0);
      saveHistory();
      return;
    }
    if (tool === "eyedropper") {
      const ctx = c.getContext("2d");
      const d = ctx.getImageData(pos.x*dpr, pos.y*dpr, 1, 1).data;
      setColor(`#${d[0].toString(16).padStart(2,"0")}${d[1].toString(16).padStart(2,"0")}${d[2].toString(16).padStart(2,"0")}`);
      setTool("pen");
      return;
    }
    setDrawing(true);
    setStartPt(pos);
    if (tool==="pen"||tool==="brush"||tool==="eraser") {
      const ctx = c.getContext("2d");
      ctx.setTransform(dpr,0,0,dpr,0,0);
      setupCtx(ctx, tool==="eraser");
      ctx.beginPath(); ctx.moveTo(pos.x,pos.y);
    }
  };

  const onMove = (e) => {
    e.preventDefault();
    if (!drawing) return;
    const c = canvasRef.current; if (!c) return;
    const pos = getPos(e, c);

    if (tool==="pen"||tool==="brush"||tool==="eraser") {
      const ctx = c.getContext("2d");
      ctx.setTransform(dpr,0,0,dpr,0,0);
      setupCtx(ctx, tool==="eraser");
      ctx.lineTo(pos.x, pos.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pos.x,pos.y);
    } else if (tool==="shapes" && startPt) {
      const p = previewRef.current; if (!p) return;
      const pCtx = p.getContext("2d");
      pCtx.setTransform(dpr,0,0,dpr,0,0);
      pCtx.clearRect(0,0,p.offsetWidth,p.offsetHeight);
      drawShape(pCtx, startPt, pos, shape, color, null, size);
    }
  };

  const onEnd = (e) => {
    e.preventDefault();
    if (!drawing) return;
    setDrawing(false);
    const c = canvasRef.current; if (!c) return;
    if (tool==="shapes" && startPt) {
      const pos = getPos(e, c);
      const p   = previewRef.current;
      if (p) { const pCtx=p.getContext("2d"); pCtx.setTransform(dpr,0,0,dpr,0,0); pCtx.clearRect(0,0,p.offsetWidth,p.offsetHeight); }
      const ctx = c.getContext("2d");
      ctx.setTransform(dpr,0,0,dpr,0,0);
      drawShape(ctx, startPt, pos, shape, color, null, size);
    }
    setStartPt(null);
    if (tool!=="eyedropper"&&tool!=="fill") saveHistory();
  };

  const cursorMap = { pen:"crosshair", brush:"crosshair", eraser:"cell", fill:"crosshair", shapes:"crosshair", eyedropper:"crosshair" };

  const btnStyle = (active) => ({
    width:40, height:40, borderRadius:10,
    background: active ? "rgba(99,102,241,0.3)" : "rgba(15,23,42,0.8)",
    border: active ? "1px solid rgba(99,102,241,0.6)" : "1px solid rgba(99,102,241,0.15)",
    color: active ? "#a5b4fc" : "#64748b",
    cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
    transition:"all 0.15s", fontSize:16,
    boxShadow: active ? "0 0 12px rgba(99,102,241,0.3)" : "none",
  });

  return (
    <div style={{ width:"100vw", height:"100vh", background:"#0f172a", display:"flex", flexDirection:"column", fontFamily:"'Inter',system-ui,sans-serif", overflow:"hidden" }}>

      {/* Header */}
      <div style={{ padding:"10px 16px", borderBottom:"1px solid rgba(99,102,241,0.2)", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(15,23,42,0.95)", backdropFilter:"blur(8px)", flexShrink:0, zIndex:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div onClick={onBack} style={{ cursor:"pointer", width:32, height:32, borderRadius:"50%", border:"2px solid #6366f1", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid #818cf8" }}/>
          </div>
          <div>
            <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:16 }}>DrawRound <span style={{ color:"#6366f1", fontSize:12, fontWeight:600 }}>/ Studio</span></div>
            <div style={{ color:"#64748b", fontSize:11 }}>Free draw mode</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={undo} disabled={!canUndo} style={{ ...btnStyle(false), opacity: canUndo?1:0.3, fontSize:18 }} title="Undo">↩</button>
          <button onClick={redo} disabled={!canRedo} style={{ ...btnStyle(false), opacity: canRedo?1:0.3, fontSize:18 }} title="Redo">↪</button>
          <button onClick={clearCanvas} style={{ ...btnStyle(false), color:"#f87171", borderColor:"rgba(248,113,113,0.3)" }} title="Clear">🗑</button>
          <button onClick={saveImage} style={{ ...btnStyle(false), color:"#34d399", borderColor:"rgba(52,211,153,0.3)", fontSize:13, fontWeight:700, width:"auto", padding:"0 14px" }}>Save ↓</button>
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* Left toolbar */}
        <div style={{ width:56, background:"rgba(15,23,42,0.9)", borderRight:"1px solid rgba(99,102,241,0.15)", display:"flex", flexDirection:"column", alignItems:"center", padding:"12px 0", gap:6, flexShrink:0, zIndex:10, overflowY:"auto" }}>

          {/* Tools */}
          {TOOLS.map(t => (
            <div key={t} style={{ position:"relative" }}>
              <button
                title={t}
                onClick={() => { setTool(t); if(t==="shapes") setShowShapes(s=>!s); else setShowShapes(false); setShowSize(false); }}
                style={btnStyle(tool===t)}
              >
                {TOOL_ICONS[t]}
              </button>
              {/* Shape submenu */}
              {t==="shapes" && showShapes && (
                <div style={{ position:"absolute", left:48, top:0, background:"rgba(15,23,42,0.98)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:12, padding:8, display:"flex", flexDirection:"column", gap:4, zIndex:50, minWidth:120, boxShadow:"0 8px 32px rgba(0,0,0,0.5)" }}>
                  {SHAPES.map(sh => (
                    <button key={sh} onClick={(e)=>{ e.stopPropagation(); setShape(sh); setShowShapes(false); }}
                      style={{ background: shape===sh?"rgba(99,102,241,0.2)":"transparent", border: shape===sh?"1px solid rgba(99,102,241,0.4)":"1px solid transparent", borderRadius:8, padding:"6px 12px", color: shape===sh?"#a5b4fc":"#94a3b8", fontSize:12, cursor:"pointer", textAlign:"left", fontWeight: shape===sh?700:400, display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:16 }}>{SHAPE_ICONS[sh]}</span> {sh.charAt(0).toUpperCase()+sh.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div style={{ width:32, height:1, background:"rgba(99,102,241,0.2)", margin:"4px 0" }} />

          {/* Size */}
          <div style={{ position:"relative" }}>
            <button title="Brush size" onClick={()=>{ setShowSize(s=>!s); setShowShapes(false); }} style={{ ...btnStyle(showSize), flexDirection:"column", gap:2 }}>
              <div style={{ width:size>8?12:size>4?8:5, height:size>8?12:size>4?8:5, borderRadius:"50%", background:"currentColor" }} />
            </button>
            {showSize && (
              <div style={{ position:"absolute", left:48, top:0, background:"rgba(15,23,42,0.98)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:12, padding:12, zIndex:50, minWidth:140, boxShadow:"0 8px 32px rgba(0,0,0,0.5)" }}>
                <div style={{ color:"#64748b", fontSize:11, marginBottom:8, fontWeight:600 }}>SIZE — {size}px</div>
                <input type="range" min="1" max="40" value={size} onChange={e=>setSize(Number(e.target.value))} style={{ width:"100%", accentColor:"#6366f1" }} />
                <div style={{ display:"flex", gap:6, marginTop:8 }}>
                  {[2,5,10,20].map(s=>(
                    <button key={s} onClick={()=>setSize(s)} style={{ flex:1, padding:"4px 0", borderRadius:6, background: size===s?"rgba(99,102,241,0.3)":"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)", color:"#a5b4fc", fontSize:11, cursor:"pointer" }}>{s}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Opacity */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <div style={{ color:"#475569", fontSize:9, fontWeight:700, letterSpacing:"0.05em" }}>OPAC</div>
            <input type="range" min="0.05" max="1" step="0.05" value={opacity} onChange={e=>setOpacity(Number(e.target.value))}
              style={{ width:36, accentColor:"#6366f1", writingMode:"vertical-lr", direction:"rtl", height:60, cursor:"pointer" }} />
            <div style={{ color:"#475569", fontSize:9 }}>{Math.round(opacity*100)}%</div>
          </div>

          <div style={{ width:32, height:1, background:"rgba(99,102,241,0.2)", margin:"4px 0" }} />

          {/* Current color swatch */}
          <div style={{ width:32, height:32, borderRadius:8, background:color, border:"2px solid rgba(255,255,255,0.2)", cursor:"pointer", position:"relative", flexShrink:0 }}>
            <input type="color" value={color} onChange={e=>setColor(e.target.value)}
              style={{ position:"absolute", inset:0, opacity:0, cursor:"pointer", width:"100%", height:"100%" }} />
          </div>
        </div>

        {/* Canvas area */}
        <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
          <canvas ref={canvasRef}
            style={{ width:"100%", height:"100%", display:"block", cursor: cursorMap[tool] }}
            onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
            onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
          />
          {/* Shape preview overlay */}
          <canvas ref={previewRef}
            style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}
          />
        </div>

        {/* Right color panel */}
        <div style={{ width:56, background:"rgba(15,23,42,0.9)", borderLeft:"1px solid rgba(99,102,241,0.15)", display:"flex", flexDirection:"column", alignItems:"center", padding:"12px 0", gap:6, flexShrink:0 }}>
          <div style={{ color:"#475569", fontSize:9, fontWeight:700, letterSpacing:"0.05em", marginBottom:4 }}>COLORS</div>
          {PRESETS.map(c => (
            <button key={c} onClick={() => setColor(c)} style={{
              width:32, height:32, borderRadius:"50%", background:c, cursor:"pointer",
              border: color===c ? "3px solid #818cf8" : "2px solid rgba(255,255,255,0.1)",
              boxShadow: color===c ? "0 0 12px rgba(129,140,248,0.6)" : "none",
              transition:"all 0.15s", flexShrink:0,
            }} />
          ))}
          <div style={{ width:32, height:1, background:"rgba(99,102,241,0.2)", margin:"4px 0" }} />
          {/* Custom color picker */}
          <div style={{ width:32, height:32, borderRadius:"50%", background:"conic-gradient(red,yellow,lime,cyan,blue,magenta,red)", cursor:"pointer", position:"relative", border:"2px solid rgba(255,255,255,0.15)", flexShrink:0 }}>
            <input type="color" value={color} onChange={e=>setColor(e.target.value)}
              style={{ position:"absolute", inset:0, opacity:0, cursor:"pointer", width:"100%", height:"100%", borderRadius:"50%" }} />
          </div>
        </div>
      </div>

      {/* Bottom color bar */}
      <div style={{ height:44, background:"rgba(15,23,42,0.95)", borderTop:"1px solid rgba(99,102,241,0.15)", display:"flex", alignItems:"center", paddingLeft:68, gap:8, overflowX:"auto", flexShrink:0 }}>
        <span style={{ color:"#475569", fontSize:11, fontWeight:700, flexShrink:0 }}>PALETTE</span>
        {["#818cf8","#a78bfa","#c084fc","#f472b6","#fb923c","#fbbf24","#34d399","#22d3ee","#60a5fa","#f87171",
          "#ffffff","#cbd5e1","#94a3b8","#475569","#1e293b","#000000",
          "#ff6b6b","#ffd93d","#6bcb77","#4d96ff","#c77dff","#ff9a3c"].map(c=>(
          <button key={c} onClick={()=>setColor(c)} style={{
            width:24, height:24, borderRadius:6, background:c, cursor:"pointer", flexShrink:0,
            border: color===c ? "2px solid #818cf8" : "1px solid rgba(255,255,255,0.1)",
            boxShadow: color===c ? "0 0 8px rgba(129,140,248,0.5)" : "none",
            transition:"all 0.1s",
          }} />
        ))}
      </div>

      <MusicPlayer />
    </div>
  );
}

// ── SCORES / HELPERS ──────────────────────────────────────────────────────────
const SCORE_MESSAGES = {
  perfect: [
    "PERFECT. You are literally built different. 🏆",
    "Bro drew a circle better than a compass. Insane. ✨",
    "Are you even human? That's a perfect circle. 🤖",
    "Geometry teachers hate you. Flawless. 👑",
    "That circle just made Euclid cry tears of joy. 🔵",
  ],
  great: [
    "Almost perfect! Just a tiny wobble. Elite. 🎯",
    "That's really clean. One more try for perfection? 🔥",
    "Really solid circle. You've done this before huh. 👏",
    "Top tier. Like 98th percentile circle drawer. 💪",
    "That's genuinely impressive. Don't let it go to your head. 😤",
  ],
  good: [
    "Pretty decent. Your mom would hang that on the fridge. 🖼️",
    "Not bad! A little wobbly but respectable. 👍",
    "That's a circle. Technically. We'll allow it. ✅",
    "Solid effort. A compass would be nervous. 📐",
    "You're getting there. Keep going. 🔄",
  ],
  okay: [
    "That's... something. Keep practicing I guess. 😐",
    "Bro it's giving oval more than circle tbh. 🥚",
    "Your circle has commitment issues. It can't decide what shape to be. 💀",
    "A for effort. D for execution. 📉",
    "That circle went through it. Therapy might help. 🛋️",
  ],
  bad: [
    "Was that a circle or a cry for help? 😭",
    "My guy drew a potato and called it a circle. 🥔",
    "Bro your hand was shaking like a phone on vibrate. 📳",
    "That circle has been through some things. It shows. 💔",
    "Oval. Egg. Blob. But not a circle. ❌",
    "A kindergartner just saw this and felt better about themselves. 🧒",
  ],
  terrible: [
    "Bro that's just abstract art. Put it in a museum. 🎨",
    "What WAS that? Genuinely asking. 👀",
    "Your circle needs a lawyer because that's criminal. ⚖️",
    "My guy drew a Dorito and submitted it as a circle. 🔺",
    "That shape doesn't even have a name. Mathematicians are concerned. 📊",
    "I've seen better circles drawn with a broken pencil by a toddler. 👶",
    "Are you okay? Do you need someone to talk to? 😟",
    "That's not a circle. That's not anything. That's chaos. 🌀",
  ],
};
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const getMessage = score => {
  if (score >= 95) return pick(SCORE_MESSAGES.perfect);
  if (score >= 85) return pick(SCORE_MESSAGES.great);
  if (score >= 70) return pick(SCORE_MESSAGES.good);
  if (score >= 50) return pick(SCORE_MESSAGES.okay);
  if (score >= 30) return pick(SCORE_MESSAGES.bad);
  return pick(SCORE_MESSAGES.terrible);
};
const getScoreColor = score => score>=85?"#22c55e":score>=65?"#f59e0b":score>=40?"#f97316":"#ef4444";

function evaluateCircle(pts) {
  if (pts.length < 20) return null;

  // Find centroid
  const cx = pts.reduce((a,p)=>a+p.x,0)/pts.length;
  const cy = pts.reduce((a,p)=>a+p.y,0)/pts.length;

  // Radii from centroid
  const radii = pts.map(p=>Math.hypot(p.x-cx,p.y-cy));
  const avgR  = radii.reduce((a,r)=>a+r,0)/radii.length;

  // Penalize if circle is tiny (too easy to fake)
  if (avgR < 30) return null;

  // Radius variance — tighter tolerance
  const stdDev = Math.sqrt(radii.reduce((a,r)=>a+(r-avgR)**2,0)/radii.length);
  const varScore = Math.max(0, 1 - (stdDev / (avgR * 0.35)));

  // Closure — start and end points should be close
  const closeDist = Math.hypot(pts[pts.length-1].x-pts[0].x, pts[pts.length-1].y-pts[0].y);
  const isClosed = closeDist < avgR * 0.2; // stricter than before
  const closeScore = isClosed ? 1 : Math.max(0, 1 - closeDist / (avgR * 0.8));

  // Angular coverage — should cover close to 360 degrees
  const angles = pts.map(p => Math.atan2(p.y-cy, p.x-cx));
  let coverage = 0;
  const buckets = new Array(36).fill(false);
  angles.forEach(a => { buckets[Math.floor(((a + Math.PI) / (2*Math.PI)) * 36) % 36] = true; });
  coverage = buckets.filter(Boolean).length / 36;

  // Weighted final score — harder to get 90+
  const raw = varScore * 0.55 + closeScore * 0.25 + coverage * 0.20;
  const score = Math.round(Math.min(100, Math.max(0, raw * 100)));

  return { score, center:{x:cx,y:cy}, radius:avgR };
}

const Credits = () => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, userSelect:"none" }}>
    <span style={{ fontSize:12, color:"#6b7280" }}>Built by</span>
    <span style={{ fontSize:12, fontWeight:900, letterSpacing:"0.1em", background:"linear-gradient(135deg,#cc44ff,#aa00ff,#dd88ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", filter:"drop-shadow(0 0 6px #cc44ff)" }}>nog</span>
    <span style={{ color:"#4b5563", fontSize:12 }}>&amp;</span>
    <span style={{ fontSize:12, fontWeight:900, background:"linear-gradient(135deg,#ff8c00,#ff6b35,#ffb347)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", filter:"drop-shadow(0 0 5px #ff6b35)" }}>Claude Sonnet 4.6</span>
  </div>
);

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const canvasRef = useRef(null);
  const [screen,  setScreen]  = useState("splash");
  const [drawing, setDrawing] = useState(false);
  const [pts,     setPts]     = useState([]);
  const [result,  setResult]  = useState(null);
  const [showGrid,setShowGrid]= useState(true);
  const [best, setBest] = useState(()=>{ try{return parseInt(localStorage.getItem("drawround_best")||"0",10);}catch{return 0;} });
  const [attempts,setAttempts]= useState(()=>{ try{return parseInt(localStorage.getItem("drawround_attempts")||"0",10);}catch{return 0;} });
  const dpr = window.devicePixelRatio||1;

  const resize = useCallback(()=>{
    const c=canvasRef.current; if(!c)return;
    c.width=c.offsetWidth*dpr; c.height=c.offsetHeight*dpr;
  },[dpr]);

  useEffect(()=>{ resize(); window.addEventListener("resize",resize); return()=>window.removeEventListener("resize",resize); },[resize]);

  useEffect(()=>{
    if(screen!=="game")return;
    const c=canvasRef.current; if(!c)return;
    c.width=c.offsetWidth*dpr; c.height=c.offsetHeight*dpr;
    const ctx=c.getContext("2d");
    const w=c.width/dpr, h=c.height/dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle="#0f172a"; ctx.fillRect(0,0,w,h);
    if(showGrid){
      ctx.strokeStyle="rgba(99,102,241,0.08)"; ctx.lineWidth=1;
      for(let x=0;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
      for(let y=0;y<h;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    }
    if(pts.length>1){
      ctx.strokeStyle=result?getScoreColor(result.score):"#818cf8";
      ctx.lineWidth=3; ctx.lineJoin="round"; ctx.lineCap="round";
      ctx.shadowColor=result?getScoreColor(result.score):"#818cf8"; ctx.shadowBlur=result?12:6;
      ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y);
      for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x,pts[i].y);
      ctx.stroke(); ctx.shadowBlur=0;
    }
    if(result){
      const{center,radius}=result;
      ctx.strokeStyle="rgba(148,163,184,0.2)"; ctx.lineWidth=2; ctx.setLineDash([8,6]);
      ctx.beginPath(); ctx.arc(center.x,center.y,radius,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
    }
  },[pts,result,showGrid,dpr,screen]);

  const getPos = e=>{ const r=canvasRef.current.getBoundingClientRect(); const s=e.touches?e.touches[0]:e; return{x:s.clientX-r.left,y:s.clientY-r.top}; };

  const onStart = e=>{ e.preventDefault(); clear(); setDrawing(true); setPts([getPos(e)]); };
  const onMove  = e=>{ e.preventDefault(); if(!drawing)return; setPts(p=>[...p,getPos(e)]); };
  const onEnd   = e=>{
    e.preventDefault(); if(!drawing)return; setDrawing(false);
    const ev=evaluateCircle(pts); if(!ev)return;
    setResult(ev);
    const na=attempts+1; setAttempts(na);
    try{localStorage.setItem("drawround_attempts",na);}catch{}
    if(ev.score>best){ setBest(ev.score); try{localStorage.setItem("drawround_best",ev.score);}catch{} }
  };
  const clear = ()=>{ setPts([]); setResult(null); };
  const scoreColor = result?getScoreColor(result.score):"#818cf8";

  // ── DRAW ─────────────────────────────────────────────────────────────────
  if(screen==="draw") return <DrawPad onBack={()=>setScreen("splash")} />;

  // ── SPLASH ────────────────────────────────────────────────────────────────
  if(screen==="splash") return(
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", background:"linear-gradient(135deg,#0d0d2b,#1a0a3e,#0a1628)", userSelect:"none", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", opacity:0.08, pointerEvents:"none" }}>
        <svg width="500" height="500" viewBox="0 0 500 500">
          <circle cx="250" cy="250" r="220" fill="none" stroke="#818cf8" strokeWidth="2" strokeDasharray="20 10"/>
          <circle cx="250" cy="250" r="155" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="12 8"/>
          <circle cx="250" cy="250" r="90"  fill="none" stroke="#c4b5fd" strokeWidth="1"/>
          <circle cx="250" cy="250" r="6"   fill="#818cf8"/>
        </svg>
      </div>
      <div style={{ position:"relative", zIndex:10, textAlign:"center", width:"100%", maxWidth:420, padding:"0 24px" }}>
        <p style={{ color:"#6b7280", letterSpacing:"0.15em", fontSize:13, textTransform:"uppercase", marginBottom:8 }}>⭕ The Circle Challenge ⭕</p>
        <h1 style={{ fontSize:64, fontWeight:900, margin:0, lineHeight:1.1, background:"linear-gradient(135deg,#818cf8,#a78bfa,#c084fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Draw</h1>
        <h2 style={{ fontSize:44, fontWeight:900, marginTop:0, marginBottom:48, background:"linear-gradient(135deg,#c084fc,#f472b6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Round</h2>
        <div style={{ cursor:"pointer", marginBottom:24 }} onClick={()=>setScreen("game")}>
          <p style={{ fontSize:28, fontWeight:700, color:"#facc15", marginBottom:8, animation:"pulse 2s infinite" }}>CLICK TO PLAY</p>
          <p style={{ fontSize:24 }}>⭕</p>
        </div>
        <div onClick={()=>setScreen("draw")} style={{ cursor:"pointer", marginBottom:32, display:"inline-flex", alignItems:"center", gap:8, background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:12, padding:"10px 24px", transition:"all 0.2s" }}>
          <span style={{ fontSize:18 }}>🎨</span>
          <span style={{ color:"#a5b4fc", fontWeight:700, fontSize:15 }}>Open Studio</span>
        </div>
        {(best>0||attempts>0)&&(
          <div style={{ background:"rgba(0,0,0,0.4)", border:"1px solid rgba(99,102,241,0.3)", borderRadius:16, padding:"12px 24px", display:"inline-block" }}>
            <p style={{ color:"#94a3b8", fontSize:12, marginBottom:4 }}>Your Record</p>
            <p style={{ color:"#f1f5f9", fontSize:16, fontWeight:700 }}>Best: <span style={{color:"#818cf8"}}>{best}</span> &nbsp;·&nbsp; Attempts: <span style={{color:"#818cf8"}}>{attempts}</span></p>
          </div>
        )}
      </div>
      <div style={{ position:"absolute", bottom:24 }}><Credits/></div>
      <MusicPlayer/>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
        *, *:focus, *:active { outline: none !important; -webkit-tap-highlight-color: transparent !important; }
      `}</style>
    </div>
  );

  // ── GAME ─────────────────────────────────────────────────────────────────
  return(
    <div style={{ width:"100vw", height:"100vh", background:"#0f172a", display:"flex", flexDirection:"column", fontFamily:"'Inter',system-ui,sans-serif", overflow:"hidden" }}>
      <div style={{ padding:"12px 20px", borderBottom:"1px solid rgba(99,102,241,0.2)", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(15,23,42,0.95)", backdropFilter:"blur(8px)", flexShrink:0, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div onClick={()=>{clear();setScreen("splash");}} style={{ cursor:"pointer", width:32, height:32, borderRadius:"50%", border:"2px solid #6366f1", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ width:18, height:18, borderRadius:"50%", border:"2px solid #818cf8" }}/>
          </div>
          <div>
            <div style={{ color:"#f1f5f9", fontWeight:700, fontSize:16, letterSpacing:"-0.02em" }}>DrawRound</div>
            <div style={{ color:"#64748b", fontSize:11 }}>Can you draw a perfect circle?</div>
          </div>
          <button onClick={()=>{clear();setScreen("draw");}} style={{ marginLeft:12, background:"rgba(99,102,241,0.12)", border:"1px solid rgba(99,102,241,0.25)", borderRadius:8, padding:"4px 12px", color:"#818cf8", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
            🎨 Studio
          </button>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ display:"flex", gap:6 }}>
            {[["Best",best],["Tries",attempts]].map(([label,val])=>(
              <div key={label} style={{ background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:8, padding:"4px 10px", textAlign:"center" }}>
                <div style={{ color:"#818cf8", fontSize:10, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>{label}</div>
                <div style={{ color:"#f1f5f9", fontSize:14, fontWeight:700 }}>{val}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>setShowGrid(g=>!g)} style={{ background:showGrid?"rgba(99,102,241,0.2)":"rgba(51,65,85,0.5)", border:`1px solid ${showGrid?"rgba(99,102,241,0.4)":"rgba(71,85,105,0.4)"}`, color:showGrid?"#818cf8":"#64748b", borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer", fontWeight:600 }}>{showGrid?"Grid On":"Grid Off"}</button>
          <button onClick={clear} style={{ background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.3)", color:"#a5b4fc", borderRadius:8, padding:"6px 14px", fontSize:12, cursor:"pointer", fontWeight:600 }}>Clear</button>
        </div>
      </div>

      <div style={{ flex:1, position:"relative", overflow:"hidden", userSelect:"none", WebkitUserSelect:"none" }}>
        <canvas ref={canvasRef} style={{ width:"100%", height:"100%", cursor:"crosshair", display:"block" }}
          onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
          onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}/>

        {pts.length===0&&!result&&(
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
            <div style={{ width:120, height:120, borderRadius:"50%", border:"2px dashed rgba(99,102,241,0.3)", marginBottom:24, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:80, height:80, borderRadius:"50%", border:"2px dashed rgba(99,102,241,0.15)" }}/>
            </div>
            <div style={{ color:"#e2e8f0", fontSize:22, fontWeight:700, letterSpacing:"-0.03em", marginBottom:8 }}>Draw a Perfect Circle</div>
            <div style={{ color:"#475569", fontSize:14 }}>Click and drag to begin</div>
          </div>
        )}

        {result&&(
          <div style={{ position:"absolute", bottom:24, left:"50%", transform:"translateX(-50%)", pointerEvents:"none" }}>
            <div style={{ background:"rgba(15,23,42,0.93)", border:`1px solid ${scoreColor}55`, borderRadius:18, padding:"18px 36px", textAlign:"center", whiteSpace:"nowrap", boxShadow:`0 0 32px ${scoreColor}22` }}>
              <div style={{ display:"flex", alignItems:"center", gap:14, justifyContent:"center" }}>
                <div style={{ width:64, height:64, borderRadius:"50%", border:`3px solid ${scoreColor}`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 16px ${scoreColor}44` }}>
                  <span style={{ color:scoreColor, fontSize:22, fontWeight:800 }}>{result.score}</span>
                </div>
                <div style={{ textAlign:"left" }}>
                  <div style={{ color:"#f1f5f9", fontSize:14, fontWeight:600, marginBottom:3 }}>{getMessage(result.score)}</div>
                  <div style={{ color:"#64748b", fontSize:12 }}>Best: <span style={{color:"#94a3b8"}}>{best}</span> &nbsp;·&nbsp; Attempt #{attempts}</div>
                  <div style={{ color:"#475569", fontSize:11, marginTop:4 }}>Draw anywhere to go again</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding:"8px 20px", borderTop:"1px solid rgba(99,102,241,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Credits/>
      </div>
      <MusicPlayer/>
    </div>
  );
}
