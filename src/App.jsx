import { useState, useRef, useEffect, useCallback } from "react";

const PLAYLIST = [
  { title: "CandyLand", artist: "DJ Aldo", src: "/music/CandyLand.mp3", cover: "/covers/CandyLand.jpg" },
  { title: "Sky High",  artist: "DJ Aldo", src: "/music/SkyHigh.mp3",   cover: "/covers/SkyHigh.jpg"   },
];

const FIRE_PLAYLIST = [
  { title: "Heart on Ice", artist: "Rod Wave",     src: "/music/Heart on Ice.mp3", cover: "/covers/HeartOnIce.jpg" },
  { title: "KK Anthem",    artist: "Ryan Baldwin", src: "/music/KK Anthem.mp3",    cover: "/covers/KKAnthem.jpg"   },
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

// ── SCORES / HELPERS ──────────────────────────────────────────────────────────
const SCORES = [
  [95, "Perfect circle! You're built different. ✨"],
  [85, "Almost perfect! Elite stuff. 🎯"],
  [75, "Pretty circular! Not bad at all. 👏"],
  [60, "Decent effort. Keep practicing. 💪"],
  [40, "Uh... try drawing slower? 🖊️"],
  [20, "Give it another shot. Practice makes perfect. 🔄"],
  [0,  "Bro that's just abstract art. 🎨"],
];
const getMessage    = score => { for (const [t,m] of SCORES) if (score>=t) return m; return SCORES[SCORES.length-1][1]; };
const getScoreColor = score => score>=85?"#22c55e":score>=65?"#f59e0b":score>=40?"#f97316":"#ef4444";

function evaluateCircle(pts) {
  if (pts.length < 10) return null;
  const cx = pts.reduce((a,p)=>a+p.x,0)/pts.length;
  const cy = pts.reduce((a,p)=>a+p.y,0)/pts.length;
  const radii = pts.map(p=>Math.hypot(p.x-cx,p.y-cy));
  const avgR  = radii.reduce((a,r)=>a+r,0)/radii.length;
  const variance = Math.sqrt(radii.reduce((a,r)=>a+(r-avgR)**2,0)/radii.length);
  const isClosed = Math.hypot(pts[pts.length-1].x-pts[0].x, pts[pts.length-1].y-pts[0].y) < avgR*0.25;
  const varScore = Math.max(0, 1-variance/(avgR*0.5));
  const score = Math.round(Math.min(100,Math.max(0,varScore*0.65+(isClosed?1:0.4)*0.35))*100);
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
        <div style={{ cursor:"pointer", marginBottom:32 }} onClick={()=>setScreen("game")}>
          <p style={{ fontSize:28, fontWeight:700, color:"#facc15", marginBottom:8, animation:"pulse 2s infinite" }}>CLICK TO PLAY</p>
          <p style={{ fontSize:24 }}>⭕</p>
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
