import { useEffect, useRef, useState } from "react";

const TRACKS = [
  { n: "COOLINOUT", url: "https://base44.app/api/apps/69d68f8dc6c9cbf2b36295b5/files/mp/public/69d68f8dc6c9cbf2b36295b5/40b7370d5_6201fc863_Coolinout1.mp3" },
  { n: "BIG BLACK", url: "https://base44.app/api/apps/69d68f8dc6c9cbf2b36295b5/files/mp/public/69d68f8dc6c9cbf2b36295b5/4fdc233b7_d71bda51d_BIGBLACK1.mp3" },
  { n: "KITCHEN FLOORS", url: "https://base44.app/api/apps/69d68f8dc6c9cbf2b36295b5/files/mp/public/69d68f8dc6c9cbf2b36295b5/fe74b547d_c8e2c4b90_KitchenFloorsandBathroomMirrors.mp3" },
];

const LOCS = [
  { id: "konbini", icon: "🏪", label: "KONBINI", jp: "コンビニ", color: "#00f5ff" },
  { id: "arcade",  icon: "🕹",  label: "ARCADE",  jp: "ゲームセンター", color: "#a855f7" },
  { id: "ramen",   icon: "🍜",  label: "RAMEN",   jp: "ラーメン", color: "#ffd700" },
  { id: "rooftop", icon: "🌆",  label: "ROOFTOP", jp: "屋上", color: "#ff2d78" },
  { id: "music",   icon: "🎵",  label: "MUSIC",   jp: "音楽", color: "#00ff88" },
];

const MODAL_DATA = {
  konbini: {
    icon:"🏪", title:"THE KONBINI", jp:"コンビニ · UNDERGROUND SHOP",
    desc:"SOURFACEMUSIC merch, music downloads, DJ class passes, and exclusive drops. New inventory weekly.",
    color:"#00f5ff", bg:"linear-gradient(135deg,#001428,#003d4d)",
    products:[
      {id:"tshirt",emoji:"👕",name:"SOURFACEMUSIC TEE",price:29.99},
      {id:"coolinout",emoji:"🎵",name:"COOLINOUT MP3",price:1.99},
      {id:"bigblack",emoji:"🎶",name:"BIG BLACK MP3",price:1.99},
      {id:"djclass",emoji:"🎧",name:"DJ CLASS PASS",price:49.99},
      {id:"bundle",emoji:"📦",name:"MUSIC BUNDLE",price:5.99},
      {id:"book",emoji:"📖",name:"VAMPIRE CURSE BOOK",price:12.99},
    ],
  },
  arcade: {
    icon:"🕹", title:"THE ARCADE", jp:"ゲームセンター · UNDERGROUND ARENA",
    desc:"Glowing cabinets, rhythm battles, Street Fighter tournaments, crane machines full of anime collectibles.",
    color:"#a855f7", bg:"linear-gradient(135deg,#0f001f,#2d0066)",
  },
  ramen: {
    icon:"🍜", title:"THE RAMEN SPOT", jp:"ラーメン · COMMUNITY HUB",
    desc:"Steam, stories, real conversations. Community heart of Anime Underground. Hostess holding it down.",
    color:"#ffd700", bg:"linear-gradient(135deg,#120800,#332200)",
    hostess: true,
  },
  rooftop: {
    icon:"🌆", title:"THE ROOFTOP", jp:"屋上 · ABOVE THE CITY",
    desc:"Storm clouds, city glow, lo-fi sets, unreleased drops. Real sessions every Friday night.",
    color:"#ff2d78", bg:"linear-gradient(135deg,#0d0008,#330020)",
  },
  music: {
    icon:"🎵", title:"MUSIC ROOM", jp:"音楽 · SOURFACEMUSIC STUDIO",
    desc:"Stream SOURFACEMUSIC tracks, download beats, support the movement directly.",
    color:"#00ff88", bg:"linear-gradient(135deg,#001a0a,#003320)",
    products:[
      {id:"coolinout",emoji:"🎵",name:"COOLINOUT",price:1.99},
      {id:"bigblack",emoji:"🎶",name:"BIG BLACK",price:1.99},
      {id:"kitchen",emoji:"🎸",name:"KITCHEN FLOORS",price:1.99},
    ],
  },
};

const BUILDINGS = Array.from({length:28}, (_,i) => ({
  i,
  w: 36 + (i * 37) % 90,
  h: 80 + (i * 61 + 30) % 220,
  color: ["#00f5ff","#ff2d78","#a855f7","#ffd700","#00ff88"][i % 5],
  delay: (i * 0.18).toFixed(2),
  speed: (1.8 + (i * 0.3) % 2.4).toFixed(1),
  sign: ["酒","音楽","OPEN","DJ","BAR","24H","GAME","LIVE","RAMEN","HIP HOP","食事","ラーメン","BEATS","⚡"][i % 14],
  wins: Array.from({length: Math.max(4, Math.floor(((36+(i*37)%90)/18)) * Math.max(2,Math.floor(((80+(i*61+30)%220)/22))))}, (_,j) => ({
    lo: (0.04 + (j*0.07)%0.18).toFixed(2),
    hi: (0.35 + (j*0.11)%0.55).toFixed(2),
    speed: (0.4 + (j*0.23)%2.2).toFixed(1),
    delay: (j * 0.15).toFixed(1),
  })),
  wCols: Math.max(2, Math.floor(((36+(i*37)%90)/18))),
}));

const STARS = Array.from({length:90}, (_,i) => ({
  x: (i*137.5)%100,
  y: (i*89.3)%62,
  size: (0.8 + Math.abs(Math.sin(i*2.3))*1.3).toFixed(1),
  lo: (0.08 + Math.abs(Math.sin(i*0.7))*0.25).toFixed(2),
  hi: (0.5 + Math.abs(Math.sin(i*1.3))*0.5).toFixed(2),
  speed: (1.4 + Math.abs(Math.sin(i*1.1))*2.2).toFixed(1),
  delay: (i*0.12).toFixed(1),
}));

const LANTERNS = [
  {x:8, y:16, color:"#ff2d78", size:16, speed:"3.2s"},
  {x:22,y:22, color:"#ffd700", size:13, speed:"2.8s"},
  {x:38,y:13, color:"#ff6600", size:18, speed:"4.0s"},
  {x:55,y:26, color:"#ff2d78", size:12, speed:"3.5s"},
  {x:70,y:19, color:"#ffd700", size:17, speed:"2.6s"},
  {x:83,y:14, color:"#ff4444", size:14, speed:"3.8s"},
  {x:92,y:24, color:"#a855f7", size:11, speed:"4.2s"},
];

const RAIN = Array.from({length:200}, (_,i) => ({
  x: (i*41.7)%100,
  delay: -(i*0.08).toFixed(2),
  dur: (0.45 + (i*0.031)%0.4).toFixed(2),
  op: (0.04 + (i*0.012)%0.18).toFixed(2),
  len: 12 + (i*7)%20,
  thick: i%5===0 ? 1 : 0.5,
}));

export default function AnimeStreet() {
  const [entered, setEntered] = useState(false);
  const [modal, setModal] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [coSuccess, setCoSuccess] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showList, setShowList] = useState(false);
  const [cardVal, setCardVal] = useState("");
  const [expVal, setExpVal] = useState("");
  const [bubbleMax, setBubbleMax] = useState(null);
  const [bubbleSon, setBubbleSon] = useState(null);
  const audRef = useRef(null);
  const maxBubbles = ["Yo, welcome to the street! 🔥","Hit the Konbini for drops 🏪","SOURFACEMUSIC built this 💿","Real ones only 🎧","Tap any spot to enter! 👆"];
  const sonBubbles = ["Dad said I'm VIP! 👑","Can we hit the arcade? 🕹","The ramen is SO good 🍜","I want a prize from the crane 🎰","SOURFACEMUSIC is the BEST 🎵"];
  const [maxI, setMaxI] = useState(0);
  const [sonI, setSonI] = useState(0);

  useEffect(() => {
    const aud = new Audio();
    aud.volume = 0.55;
    audRef.current = aud;
    aud.addEventListener("timeupdate", () => {
      if (aud.duration) setProgress(aud.currentTime / aud.duration * 100);
    });
    aud.addEventListener("ended", () => nextTrack());
    return () => { aud.pause(); };
  }, []);

  useEffect(() => {
    if (!entered) return;
    const timers = [
      setTimeout(() => showBubble("son"), 2500),
      setTimeout(() => showBubble("max"), 6000),
    ];
    const interval = setInterval(() => { showBubble(Math.random()>.5?"max":"son"); }, 12000);
    return () => { timers.forEach(clearTimeout); clearInterval(interval); };
  }, [entered]);

  function showBubble(who) {
    if (who === "max") {
      setBubbleMax(maxBubbles[maxI % maxBubbles.length]);
      setMaxI(p => p+1);
      setTimeout(() => setBubbleMax(null), 4500);
    } else {
      setBubbleSon(sonBubbles[sonI % sonBubbles.length]);
      setSonI(p => p+1);
      setTimeout(() => setBubbleSon(null), 4500);
    }
  }

  function enter() {
    setEntered(true);
    setShowPlayer(true);
    const aud = audRef.current;
    aud.src = TRACKS[0].url;
    aud.play().then(() => setPlaying(true)).catch(()=>{});
  }

  function togglePlay() {
    const aud = audRef.current;
    if (playing) { aud.pause(); setPlaying(false); }
    else { aud.play(); setPlaying(true); }
  }

  function loadTrack(i) {
    setTrackIdx(i);
    const aud = audRef.current;
    aud.src = TRACKS[i].url;
    if (playing) aud.play();
  }

  function nextTrack() { loadTrack((trackIdx + 1) % TRACKS.length); }
  function prevTrack() { loadTrack((trackIdx - 1 + TRACKS.length) % TRACKS.length); }

  function fmtCard(v) {
    const d = v.replace(/\D/g,"").substring(0,16);
    return d.replace(/(.{4})/g,"$1 ").trim();
  }
  function fmtExp(v) {
    const d = v.replace(/\D/g,"");
    return d.length >= 2 ? d.substring(0,2)+"/"+d.substring(2,4) : d;
  }

  const md = modal ? MODAL_DATA[modal] : null;

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Bangers&family=Noto+Sans+JP:wght@900&family=Poppins:wght@400;700;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { overflow: hidden; }

    /* SKY */
    .sky {
      position: absolute; inset: 0;
      background: linear-gradient(180deg,#020010 0%,#0e0038 38%,#160a50 68%,#051228 100%);
    }

    /* STARS */
    .star {
      position: absolute; border-radius: 50%; background: #fff;
      animation: twinkle var(--spd) ease-in-out var(--del) infinite alternate;
    }
    @keyframes twinkle {
      0%  { opacity: var(--lo); transform: scale(.7); }
      100%{ opacity: var(--hi); transform: scale(1.1); }
    }

    /* MOON */
    .moon-glow {
      position: absolute; width: 160px; height: 160px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,230,100,.2) 0%, rgba(255,200,50,.07) 50%, transparent 70%);
      animation: moonFloat 6s ease-in-out infinite alternate;
    }
    .moon {
      position: absolute; width: 90px; height: 90px; border-radius: 50%;
      background: radial-gradient(circle at 38% 38%, #fffde7, #ffd54f 55%, #e65100);
      box-shadow: 0 0 40px rgba(255,215,0,.3), 0 0 80px rgba(255,215,0,.1);
      animation: moonFloat 6s ease-in-out infinite alternate;
    }
    @keyframes moonFloat { 0%{transform:translateY(0)} 100%{transform:translateY(-10px)} }

    /* LANTERNS */
    .lantern {
      position: absolute;
      width: var(--ls); height: calc(var(--ls) * 1.6);
      border-radius: 40%;
      background: var(--lc);
      box-shadow: 0 0 20px var(--lc), 0 0 50px var(--lc);
      animation: lanternSway var(--lsp) ease-in-out infinite alternate, lanternFloat var(--lsp) ease-in-out infinite;
    }
    @keyframes lanternSway { 0%{transform:translateX(-8px) rotate(-4deg)} 100%{transform:translateX(8px) rotate(4deg)} }
    @keyframes lanternFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }

    /* BUILDINGS */
    .bld {
      position: absolute; bottom: 38%; background: rgba(8,0,22,.97);
      display: flex; flex-direction: column; overflow: hidden;
      animation: bldGlow var(--spd) ease-in-out var(--del) infinite alternate;
    }
    @keyframes bldGlow { 0%{filter:brightness(.95)} 100%{filter:brightness(1.08)} }
    .bld-top {
      height: 2px; width: 100%; flex-shrink: 0;
      background: var(--tc);
      box-shadow: 0 0 12px var(--tc), 0 0 28px var(--tc);
      animation: topGlow var(--spd) ease-in-out var(--del) infinite alternate;
    }
    @keyframes topGlow { 0%{opacity:.4} 100%{opacity:1} }
    .bld-sign {
      text-align: center; font-size: var(--ssz); font-family: sans-serif; font-weight: bold;
      color: var(--tc); text-shadow: 0 0 12px var(--tc); padding: 2px 0;
      animation: signFlash calc(var(--spd) * 1.2) ease-in-out var(--del) infinite alternate;
    }
    @keyframes signFlash { 0%{opacity:.25} 100%{opacity:.9} }
    .bld-wins {
      flex: 1; display: grid; gap: 3px; padding: 2px 3px;
      grid-template-columns: repeat(var(--wc), 1fr);
    }
    .win {
      border-radius: 1px; height: 10px; background: var(--wc2);
      animation: winBlink var(--ws) ease-in-out var(--wd) infinite alternate;
    }
    @keyframes winBlink { 0%{opacity:var(--lo)} 100%{opacity:var(--hi)} }

    /* STREET */
    .street {
      position: absolute; left: 0; right: 0; bottom: 0; height: 38%;
      background: linear-gradient(180deg,#131528 0%,#0d1022 45%,#070810 100%);
    }
    .street-line {
      position: absolute; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg,transparent,rgba(0,245,255,.6),transparent);
      box-shadow: 0 0 20px rgba(0,245,255,.4);
      animation: lineGlow 3s ease-in-out infinite alternate;
    }
    @keyframes lineGlow { 0%{opacity:.5} 100%{opacity:1} }
    .neon-pool {
      position: absolute; top: 0; border-radius: 50%;
      animation: poolPulse var(--pp) ease-in-out infinite alternate;
    }
    @keyframes poolPulse { 0%{opacity:.4} 100%{opacity:.8} }
    .stripe {
      position: absolute; height: 4px; border-radius: 2px;
      background: rgba(255,215,0,.08);
      animation: stripeMarch 4s linear infinite;
    }
    @keyframes stripeMarch { from{transform:translateX(0)} to{transform:translateX(-80px)} }

    /* RAIN */
    .rain-drop {
      position: absolute; top: -30px;
      width: var(--rw); height: var(--rl)px;
      background: linear-gradient(180deg,transparent,rgba(120,220,255,var(--ro)));
      animation: rainFall var(--rd)s linear var(--rdl)s infinite;
    }
    @keyframes rainFall { from{transform:translateY(-30px)} to{transform:translateY(110vh)} }

    /* PARTICLES */
    .particle {
      position: absolute; border-radius: 50%;
      width: var(--ps)px; height: var(--ps)px; background: var(--pc);
      box-shadow: 0 0 8px var(--pc);
      animation: partRise var(--pd)s ease-in var(--pdl)s infinite;
    }
    @keyframes partRise {
      0%  { opacity:0; transform: translateY(0) translateX(0); }
      20% { opacity: .8; }
      100%{ opacity:0; transform: translateY(-120px) translateX(var(--psx)); }
    }

    /* SPLASH CONTENT */
    .eyebrow {
      font-family:'Noto Sans JP',sans-serif; font-size:clamp(.55rem,1.5vw,.8rem);
      letter-spacing:10px; color:rgba(255,255,255,.35); margin-bottom:16px;
      animation: fadeUp .8s ease both .2s;
    }
    .logo-title {
      font-family:'Bangers',cursive; line-height:1;
      font-size:clamp(2.5rem,10vw,7rem); letter-spacing:6px;
      animation: fadeUp .8s ease both .3s;
    }
    .logo-word { display:inline-block; margin:0 6px; }
    .logo-char {
      display:inline-block;
      transition: transform .2s cubic-bezier(.34,1.56,.64,1), color .2s, text-shadow .2s;
      cursor:default;
    }
    .logo-char:hover {
      transform: scale(1.35) translateY(-10px) rotate(-6deg) !important;
      filter: brightness(1.5);
    }
    .sub-line {
      font-family:'Orbitron',sans-serif; font-size:clamp(.45rem,1.2vw,.65rem);
      letter-spacing:6px; color:rgba(255,255,255,.2); margin:14px 0 32px;
      animation: fadeUp .8s ease both .5s;
    }
    .enter-btn {
      display:inline-flex; align-items:center; gap:10px;
      padding:16px 52px; border-radius:50px; border:2px solid #00f5ff;
      background:rgba(0,245,255,.08); color:#00f5ff;
      font-family:'Orbitron',sans-serif; font-size:.75rem; letter-spacing:5px;
      cursor:pointer; position:relative; overflow:hidden;
      animation: fadeUp .8s ease both .65s, btnPulse 2.5s ease-in-out infinite 1.5s;
      transition: background .25s, box-shadow .25s, transform .2s;
    }
    .enter-btn:hover { background:rgba(0,245,255,.18); box-shadow:0 0 60px rgba(0,245,255,.5); transform:scale(1.04); }
    .enter-btn::after {
      content:''; position:absolute; inset:0;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);
      transform:translateX(-100%); animation:sheen 3s ease-in-out infinite 2s;
    }
    @keyframes sheen { 0%{transform:translateX(-100%)} 50%,100%{transform:translateX(100%)} }
    @keyframes btnPulse {
      0%,100%{ box-shadow:0 0 0 rgba(0,245,255,0), 0 0 20px rgba(0,245,255,.2) }
      50%{ box-shadow:0 0 0 14px rgba(0,245,255,.04), 0 0 40px rgba(0,245,255,.4) }
    }
    @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

    /* TOPNAV */
    .topnav {
      position:absolute; top:0; left:0; right:0; z-index:80;
      display:flex; align-items:center; justify-content:space-between; padding:10px 16px;
      background:linear-gradient(180deg,rgba(3,0,16,.9),transparent);
      backdrop-filter:blur(4px);
    }
    .nav-logo {
      font-family:'Bangers',cursive; font-size:1.3rem; letter-spacing:4px;
      background:linear-gradient(90deg,#00f5ff,#ff2d78,#ffd700,#00f5ff);
      background-size:300%; -webkit-background-clip:text; -webkit-text-fill-color:transparent;
      animation:gradShift 3s linear infinite;
    }
    @keyframes gradShift { 0%{background-position:0%} 100%{background-position:300%} }
    .nav-btns { display:flex; gap:5px; }
    .nav-btn {
      padding:6px 12px; border-radius:18px; cursor:pointer;
      background:rgba(0,0,0,.5); border:1px solid rgba(255,255,255,.1);
      color:rgba(255,255,255,.45); font-family:'Orbitron',sans-serif; font-size:.5rem; letter-spacing:2px;
      transition:all .2s;
    }
    .nav-btn:hover { color:#fff; border-color:rgba(0,245,255,.4); background:rgba(0,245,255,.12); box-shadow:0 0 16px rgba(0,245,255,.2); }

    /* TICKER */
    .ticker {
      position:absolute; top:48px; left:0; right:0; z-index:80;
      overflow:hidden; padding:4px 0;
      background:rgba(0,0,0,.75); backdrop-filter:blur(20px);
      border-bottom:1px solid rgba(0,245,255,.1);
    }
    .ticker-inner { display:flex; white-space:nowrap; animation:tickRun 20s linear infinite; }
    @keyframes tickRun { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    .tick-item { font-family:'Orbitron',sans-serif; font-size:.5rem; letter-spacing:3px; padding:0 36px; flex-shrink:0; }

    /* LOCATION SIGNS */
    .locs { position:absolute; left:0; right:0; bottom:190px; display:flex; justify-content:center; gap:clamp(5px,1.5vw,14px); padding:0 8px; z-index:70; }
    .loc-wrap { cursor:pointer; animation:locFloat 3s ease-in-out var(--ld) infinite; transition:transform .25s cubic-bezier(.34,1.56,.64,1); }
    .loc-wrap:hover { transform:scale(1.12) translateY(-10px); }
    @keyframes locFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    .loc-board {
      position:relative; border-radius:10px; padding:clamp(6px,1.2vw,10px) clamp(8px,1.8vw,14px);
      background:rgba(0,0,0,.82); backdrop-filter:blur(18px);
      border:2px solid var(--lc); text-align:center;
      box-shadow:0 0 18px var(--lc); animation:boardGlow 3s ease-in-out infinite alternate;
    }
    @keyframes boardGlow { 0%{box-shadow:0 0 10px var(--lc)} 100%{box-shadow:0 0 32px var(--lc),0 0 60px var(--lc)} }
    .loc-dot { position:absolute; top:6px; right:6px; width:6px; height:6px; border-radius:50%; background:var(--lc); box-shadow:0 0 8px var(--lc); animation:dotBlink 1.5s ease-in-out var(--ld) infinite; }
    @keyframes dotBlink { 0%,100%{opacity:1} 50%{opacity:.1} }
    .loc-icon { font-size:clamp(1.2rem,3vw,1.8rem); display:block; animation:iconWiggle 4s ease-in-out var(--ld) infinite; }
    @keyframes iconWiggle { 0%,100%{transform:scale(1) rotate(0)} 25%{transform:scale(1.1) rotate(-4deg)} 75%{transform:scale(1.08) rotate(4deg)} }
    .loc-label { font-family:'Bangers',cursive; font-size:clamp(.55rem,1.4vw,.9rem); letter-spacing:2px; color:var(--lc); text-shadow:0 0 10px var(--lc); display:block; margin-top:2px; white-space:nowrap; }
    .loc-jp { font-family:'Noto Sans JP',sans-serif; font-size:.42rem; color:rgba(255,255,255,.15); letter-spacing:2px; display:block; }

    /* CHARACTERS */
    .char-max { position:absolute; bottom:190px; left:3%; z-index:75; cursor:pointer; animation:charBob 3.2s ease-in-out infinite; }
    .char-son { position:absolute; bottom:190px; right:2.5%; z-index:75; cursor:pointer; animation:charBob 2.5s ease-in-out .5s infinite; }
    @keyframes charBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    .char-img { width:clamp(52px,9vw,90px); height:auto; filter:drop-shadow(0 10px 28px rgba(0,245,255,.5)); transition:filter .3s,transform .25s; display:block; }
    .char-max:hover .char-img,.char-son:hover .char-img { transform:scale(1.1); filter:drop-shadow(0 16px 40px rgba(0,245,255,.8)); }
    .son-img { filter:drop-shadow(0 10px 28px rgba(255,215,0,.5)) !important; }
    .char-son:hover .son-img { filter:drop-shadow(0 16px 40px rgba(255,215,0,.8)) !important; }
    .speech {
      position:absolute; bottom:calc(100% + 8px); left:50%; transform:translateX(-50%);
      background:#fff; color:#111; font-family:'Poppins',sans-serif; font-weight:800; font-size:.65rem;
      padding:8px 12px; border-radius:14px 14px 14px 4px; white-space:nowrap;
      box-shadow:0 8px 28px rgba(0,0,0,.6); z-index:90; max-width:180px; white-space:normal; text-align:center; line-height:1.5;
      animation:bubblePop .35s cubic-bezier(.34,1.56,.64,1) both;
    }
    .speech::after { content:''; position:absolute; bottom:-8px; left:14px; border:4px solid transparent; border-top-color:#fff; }
    @keyframes bubblePop { from{opacity:0;transform:translateX(-50%) scale(.3) translateY(10px)} to{opacity:1;transform:translateX(-50%) scale(1) translateY(0)} }

    /* MUSIC PLAYER */
    .player {
      position:absolute; right:10px; bottom:195px; z-index:80;
      width:clamp(175px,40vw,240px);
      background:rgba(3,0,15,.95); border:2px solid rgba(0,245,255,.4); border-radius:14px;
      box-shadow:0 0 40px rgba(0,245,255,.12),0 20px 60px rgba(0,0,0,.8);
      animation:playerBob 7s ease-in-out infinite;
    }
    @keyframes playerBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
    .ph { padding:9px 11px 7px; background:linear-gradient(135deg,rgba(0,245,255,.1),rgba(255,45,120,.07)); border-bottom:1px solid rgba(0,245,255,.1); display:flex; align-items:center; gap:8px; }
    .pdisc { width:34px; height:34px; border-radius:50%; background:conic-gradient(#00f5ff,#ff2d78,#a855f7,#ffd700,#00f5ff); display:flex; align-items:center; justify-content:center; font-size:.85rem; box-shadow:0 0 12px rgba(0,245,255,.4); flex-shrink:0; }
    .pdisc.spin { animation:discSpin 3s linear infinite; }
    @keyframes discSpin { to{transform:rotate(360deg)} }
    .ptrack { font-family:'Orbitron',sans-serif; font-size:.56rem; font-weight:700; letter-spacing:1px; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .psub { font-size:.46rem; color:rgba(0,245,255,.4); letter-spacing:1px; margin-top:1px; }
    .peq { display:flex; align-items:flex-end; gap:2px; height:14px; flex-shrink:0; }
    .eq-bar { width:3px; border-radius:1px; background:#00f5ff; }
    .eq-bar:nth-child(1){height:5px} .eq-bar:nth-child(2){height:11px} .eq-bar:nth-child(3){height:8px} .eq-bar:nth-child(4){height:13px} .eq-bar:nth-child(5){height:6px}
    .eq-bar.on { animation:eqPulse .5s ease-in-out infinite alternate; }
    .eq-bar:nth-child(2).on{animation-delay:.1s} .eq-bar:nth-child(3).on{animation-delay:.2s} .eq-bar:nth-child(4).on{animation-delay:.05s} .eq-bar:nth-child(5).on{animation-delay:.18s}
    @keyframes eqPulse { 0%{transform:scaleY(.15)} 100%{transform:scaleY(1)} }
    .pctls { display:flex; align-items:center; justify-content:center; gap:4px; padding:7px 9px; }
    .pc { background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); color:#888; border-radius:7px; padding:6px 10px; cursor:pointer; font-size:.65rem; transition:all .2s; }
    .pc:hover { background:rgba(0,245,255,.16); color:#00f5ff; border-color:rgba(0,245,255,.4); transform:scale(1.08); }
    .pc.main { background:rgba(0,245,255,.14); color:#00f5ff; border-color:rgba(0,245,255,.5); padding:7px 14px; }
    .pprog { padding:0 11px 4px; display:flex; align-items:center; gap:6px; }
    .pbar { flex:1; height:4px; background:rgba(255,255,255,.1); border-radius:2px; cursor:pointer; position:relative; }
    .pfill { height:100%; border-radius:2px; background:linear-gradient(90deg,#00f5ff,#ff2d78); position:relative; }
    .pfill::after { content:''; position:absolute; right:-4px; top:-3px; width:8px; height:8px; border-radius:50%; background:#00f5ff; box-shadow:0 0 8px #00f5ff; }
    .pt { font-family:'Orbitron',sans-serif; font-size:.45rem; color:rgba(0,245,255,.4); flex-shrink:0; }
    .pvol { display:flex; align-items:center; gap:6px; padding:2px 11px 8px; }
    .pvl { font-family:'Orbitron',sans-serif; font-size:.44rem; color:rgba(0,245,255,.25); }
    .ptlist { border-top:1px solid rgba(0,245,255,.07); overflow:hidden; max-height:0; transition:max-height .35s; }
    .ptlist.open { max-height:120px; overflow-y:auto; }
    .ti { display:flex; align-items:center; gap:6px; padding:6px 11px; cursor:pointer; border-bottom:1px solid rgba(255,255,255,.03); transition:background .2s; }
    .ti:hover,.ti.on { background:rgba(0,245,255,.08); }
    .tn { font-family:'Orbitron',sans-serif; font-size:.46rem; color:rgba(0,245,255,.3); width:12px; }
    .tl { font-family:'Orbitron',sans-serif; font-size:.54rem; letter-spacing:1px; color:#666; flex:1; }
    .ti.on .tl { color:#00f5ff; }
    .player-tog {
      position:absolute; right:10px; bottom:195px; z-index:79;
      width:42px; height:42px; border-radius:50%;
      background:rgba(3,0,15,.92); border:2px solid rgba(0,245,255,.5);
      display:flex; align-items:center; justify-content:center; font-size:.95rem;
      cursor:pointer; box-shadow:0 0 18px rgba(0,245,255,.22);
      transition:all .25s; animation:playerBob 4s ease-in-out infinite;
    }
    .player-tog:hover { box-shadow:0 0 36px rgba(0,245,255,.6); transform:scale(1.12); }

    /* MODAL */
    .mbg {
      position:absolute; inset:0; z-index:200;
      background:rgba(0,0,5,.88); backdrop-filter:blur(28px);
      display:flex; align-items:center; justify-content:center; padding:12px;
      overflow-y:auto;
      animation:fadeIn .25s ease both;
    }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    .mbox {
      width:100%; max-width:460px; max-height:88vh; overflow-y:auto;
      background:linear-gradient(160deg,#0e0125,#040010);
      border:2px solid var(--mc,rgba(0,245,255,.4)); border-radius:16px;
      box-shadow:0 0 60px var(--ms,rgba(0,245,255,.2));
      animation:mboxPop .4s cubic-bezier(.34,1.56,.64,1) both;
    }
    @keyframes mboxPop { from{opacity:0;transform:scale(.82) translateY(30px)} to{opacity:1;transform:scale(1) translateY(0)} }
    .mbnr { height:140px; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; flex-shrink:0; }
    .mbnr-bg { position:absolute; inset:0; animation:bnrPulse 3s ease-in-out infinite alternate; }
    @keyframes bnrPulse { 0%{filter:brightness(.8)} 100%{filter:brightness(1.5) saturate(1.8)} }
    .micon-lg { font-size:3.5rem; position:relative; z-index:2; animation:iconBob 2s ease-in-out infinite; }
    @keyframes iconBob { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-12px) scale(1.12)} }
    .mbody { padding:18px 20px 20px; }
    .mtag { display:inline-block; padding:4px 12px; border-radius:20px; font-family:'Orbitron',sans-serif; font-size:.48rem; letter-spacing:2px; margin-bottom:8px; }
    .mtitle { font-family:'Bangers',cursive; font-size:1.8rem; letter-spacing:3px; color:#fff; margin-bottom:3px; }
    .mjp { font-family:'Noto Sans JP',sans-serif; font-size:.54rem; color:rgba(255,255,255,.1); letter-spacing:4px; margin-bottom:9px; }
    .mdesc { font-size:.7rem; color:#4a5566; line-height:1.85; margin-bottom:14px; }
    .pgrid { display:grid; grid-template-columns:repeat(2,1fr); gap:7px; margin-bottom:12px; }
    .pcard { background:rgba(0,245,255,.04); border:1px solid rgba(0,245,255,.14); border-radius:9px; padding:11px; cursor:pointer; transition:all .25s cubic-bezier(.34,1.56,.64,1); text-align:center; }
    .pcard:hover { background:rgba(0,245,255,.1); border-color:rgba(0,245,255,.5); transform:scale(1.06); box-shadow:0 0 22px rgba(0,245,255,.2); }
    .pemoji { font-size:1.7rem; display:block; margin-bottom:5px; }
    .pname { font-family:'Orbitron',sans-serif; font-size:.48rem; letter-spacing:1px; color:#aaa; margin-bottom:4px; line-height:1.4; }
    .pprice { font-family:'Bangers',cursive; font-size:1.2rem; letter-spacing:2px; color:#00f5ff; text-shadow:0 0 8px rgba(0,245,255,.4); }
    .hw { display:flex; align-items:center; gap:12px; padding:12px; border-radius:10px; background:rgba(255,215,0,.05); border:1px solid rgba(255,215,0,.2); margin-bottom:12px; }
    .himg { width:58px; height:58px; border-radius:50%; object-fit:cover; border:2px solid rgba(255,215,0,.5); box-shadow:0 0 18px rgba(255,215,0,.3); flex-shrink:0; }
    .hname { font-family:'Bangers',cursive; font-size:.95rem; letter-spacing:2px; color:#ffd700; }
    .hrole { font-size:.49rem; color:rgba(255,215,0,.4); font-family:'Orbitron',sans-serif; letter-spacing:2px; }
    .hmsg { font-size:.66rem; color:#4a5566; margin-top:4px; line-height:1.5; }
    .ag { display:grid; grid-template-columns:1fr 1fr; gap:7px; margin-bottom:12px; }
    .agi { padding:10px 11px; border-radius:8px; background:rgba(168,85,247,.06); border:1px solid rgba(168,85,247,.18); }
    .agt { font-family:'Orbitron',sans-serif; font-size:.5rem; letter-spacing:2px; color:#a855f7; margin-bottom:3px; }
    .agv { font-size:.6rem; color:#4a5566; }
    .macts { display:flex; gap:8px; flex-wrap:wrap; }
    .mbtn { padding:11px 20px; border:none; border-radius:8px; cursor:pointer; font-family:'Orbitron',sans-serif; font-size:.58rem; letter-spacing:2px; font-weight:700; transition:all .25s; }
    .mbtn:hover { transform:scale(1.05); filter:brightness(1.15); }
    .mbtn-x { padding:11px 16px; border-radius:8px; cursor:pointer; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); color:rgba(255,255,255,.28); font-family:'Orbitron',sans-serif; font-size:.58rem; transition:all .2s; }
    .mbtn-x:hover { background:rgba(255,255,255,.1); color:#fff; }

    /* CHECKOUT */
    .cobg { position:absolute; inset:0; z-index:300; background:rgba(0,0,8,.97); backdrop-filter:blur(30px); display:flex; align-items:center; justify-content:center; padding:12px; animation:fadeIn .25s ease both; }
    .cobox { width:100%; max-width:360px; background:linear-gradient(160deg,#0a0120,#030008); border:2px solid rgba(0,245,255,.35); border-radius:16px; padding:22px; box-shadow:0 0 60px rgba(0,245,255,.1); animation:mboxPop .4s cubic-bezier(.34,1.56,.64,1) both; }
    .cotitle { font-family:'Bangers',cursive; font-size:1.8rem; letter-spacing:3px; color:#fff; margin-bottom:4px; }
    .coitem { font-family:'Orbitron',sans-serif; font-size:.56rem; color:rgba(0,245,255,.6); letter-spacing:2px; margin-bottom:8px; }
    .coprice { font-family:'Bangers',cursive; font-size:2.6rem; color:#00f5ff; letter-spacing:4px; margin-bottom:14px; text-shadow:0 0 18px rgba(0,245,255,.5); }
    .coform { display:flex; flex-direction:column; gap:8px; margin-bottom:12px; }
    .coin { background:rgba(255,255,255,.04); border:1px solid rgba(0,245,255,.2); border-radius:8px; padding:11px 13px; color:#fff; font-family:'Poppins',sans-serif; font-size:.74rem; outline:none; transition:all .2s; width:100%; }
    .coin:focus { border-color:rgba(0,245,255,.5); background:rgba(0,245,255,.04); box-shadow:0 0 18px rgba(0,245,255,.1); }
    .coin::placeholder { color:rgba(255,255,255,.14); }
    .corow { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
    .copay { width:100%; padding:13px; border:none; border-radius:10px; cursor:pointer; font-family:'Orbitron',sans-serif; font-size:.67rem; letter-spacing:3px; font-weight:700; background:linear-gradient(135deg,#00f5ff,#0088ff); color:#000; transition:all .3s; animation:payPulse 2s ease-in-out infinite; }
    .copay:hover { transform:scale(1.04); box-shadow:0 0 36px rgba(0,245,255,.5); }
    @keyframes payPulse { 0%,100%{box-shadow:0 0 0 rgba(0,245,255,0)} 50%{box-shadow:0 0 28px rgba(0,245,255,.4)} }
    .cocancel { text-align:center; margin-top:9px; font-family:'Orbitron',sans-serif; font-size:.48rem; letter-spacing:2px; color:rgba(255,255,255,.18); cursor:pointer; transition:color .2s; }
    .cocancel:hover { color:rgba(255,255,255,.5); }
    .cosecure { text-align:center; font-size:.52rem; color:rgba(255,255,255,.09); font-family:'Poppins',sans-serif; margin-top:7px; }
    .cosuccess-icon { font-size:3.2rem; display:block; margin-bottom:14px; animation:iconBob 1.5s ease-in-out infinite; }
    .cosuccess-title { font-family:'Bangers',cursive; font-size:1.8rem; letter-spacing:3px; color:#00f5ff; margin-bottom:8px; text-shadow:0 0 18px rgba(0,245,255,.5); }
    .cosuccess-msg { font-size:.68rem; color:#4a5566; line-height:1.8; margin-bottom:16px; }

    @media(max-width:480px) { .nav-btns{display:none} }
  `;

  const TICKER_ITEMS = [
    {t:"⚡ ANIME UNDERGROUND IS LIVE", c:"#00f5ff"},
    {t:"🌧 HEAVY RAIN · TOKYO TONIGHT", c:"#ff2d78"},
    {t:"🎧 SOURFACEMUSIC · BUILT UNDERGROUND", c:"#fff"},
    {t:"🏪 KONBINI · NEW DROPS WEEKLY", c:"#ffd700"},
    {t:"🕹 ARCADE · TOURNAMENTS EVERY SAT", c:"#a855f7"},
    {t:"🍜 RAMEN SPOT · OPEN ALL NIGHT", c:"#ffd700"},
    {t:"🌆 ROOFTOP SESSIONS EVERY FRIDAY", c:"#ff2d78"},
    {t:"アンダーグラウンド · SOURFACEMUSIC 東京", c:"#00f5ff"},
  ];

  const LOGO_COLORS = ["#00f5ff","#ff2d78","#ffd700","#a855f7","#00ff88"];
  let ci = 0;

  return (
    <div style={{width:"100%",height:"100vh",overflow:"hidden",background:"#030010",position:"relative"}}>
      <style>{styles}</style>

      {/* SKY */}
      <div className="sky" />

      {/* STARS */}
      {STARS.map((s,i) => (
        <div key={i} className="star" style={{
          left:`${s.x}%`, top:`${s.y}%`,
          width:`${s.size}px`, height:`${s.size}px`,
          "--spd":`${s.speed}s`, "--del":`${s.delay}s`,
          "--lo":s.lo, "--hi":s.hi,
          zIndex:2,
        }}/>
      ))}

      {/* MOON */}
      <div className="moon-glow" style={{right:"12%",top:"3%",zIndex:3}}/>
      <div className="moon" style={{right:"13.5%",top:"4.5%",zIndex:4}}/>

      {/* LANTERNS */}
      {LANTERNS.map((l,i) => (
        <div key={i} className="lantern" style={{
          left:`${l.x}%`, top:`${l.y}%`,
          "--lc":l.color, "--ls":`${l.size}px`, "--lsp":l.speed,
          zIndex:5,
        }}/>
      ))}

      {/* BUILDINGS */}
      {BUILDINGS.map((b,i) => {
        const left = BUILDINGS.slice(0,i).reduce((s,bb) => s + bb.w + 2, 0) % (typeof window !== "undefined" ? window.innerWidth * 1.2 : 1400);
        return (
          <div key={i} className="bld" style={{
            left:`${(i * 4.8) % 100}%`,
            width:`${b.w}px`,
            height:`${b.h}px`,
            "--tc":b.color,
            "--spd":`${b.speed}s`,
            "--del":`${b.delay}s`,
            zIndex:10,
          }}>
            <div className="bld-top"/>
            <div className="bld-sign" style={{"--ssz":`${Math.max(7, b.w * 0.18)}px`}}>{b.sign}</div>
            <div className="bld-wins" style={{"--wc":b.wCols}}>
              {b.wins.map((w,j) => (
                <div key={j} className="win" style={{
                  "--wc2":b.color.replace("#","rgba(").replace(/(.{2})(.{2})(.{2})/,"$1,$2,$3") || b.color,
                  "--lo":w.lo, "--hi":w.hi,
                  "--ws":`${w.speed}s`, "--wd":`${w.delay}s`,
                  background: b.color,
                  opacity: parseFloat(w.lo),
                }}/>
              ))}
            </div>
          </div>
        );
      })}

      {/* STREET */}
      <div className="street" style={{zIndex:12}}>
        <div className="street-line"/>
        {[{x:"10%",c:"rgba(0,245,255,.06)",w:"180px",h:"80px",pp:"3s"},{x:"35%",c:"rgba(255,45,120,.05)",w:"160px",h:"70px",pp:"2.5s"},{x:"60%",c:"rgba(168,85,247,.05)",w:"170px",h:"75px",pp:"3.8s"},{x:"82%",c:"rgba(255,215,0,.05)",w:"150px",h:"65px",pp:"2.8s"}].map((p,i) => (
          <div key={i} className="neon-pool" style={{left:p.x,background:p.c,width:p.w,height:p.h,borderRadius:"50%","--pp":p.pp,transform:"scaleY(.28)"}}/>
        ))}
        {[0,1,2,3,4,5,6].map(i => (
          <div key={i} className="stripe" style={{bottom:"40%",left:`${i*80}px`,width:"48px",animationDelay:`${i*-.5}s`}}/>
        ))}
      </div>

      {/* RAIN */}
      {RAIN.map((r,i) => (
        <div key={i} style={{
          position:"absolute",top:0,left:`${r.x}%`,
          width:`${r.thick}px`,height:`${r.len}px`,
          background:`linear-gradient(180deg,transparent,rgba(120,220,255,${r.op}))`,
          animation:`rainFall ${r.dur}s linear ${r.delay}s infinite`,
          zIndex:30,pointerEvents:"none",
        }}/>
      ))}

      {/* PARTICLES */}
      {["#00f5ff","#ff2d78","#a855f7","#ffd700","#00ff88","#ffffff"].map((c,ci) =>
        Array.from({length:12},(_,i) => {
          const idx = ci*12+i;
          return (
            <div key={idx} style={{
              position:"absolute",borderRadius:"50%",
              width:`${1+idx%3}px`,height:`${1+idx%3}px`,background:c,
              boxShadow:`0 0 8px ${c}`,
              left:`${5+(idx*7.3)%90}%`,bottom:"38%",
              animation:`partRise ${1.5+(idx*.11)%2}s ease-in ${(idx*.07)%2}s infinite`,
              "--psx":`${(idx%2===0?1:-1)*(10+(idx%20))}px`,
              zIndex:35,pointerEvents:"none",
            }}/>
          );
        })
      )}

      {/* TOPNAV */}
      {entered && (
        <div className="topnav" style={{zIndex:80}}>
          <div className="nav-logo">⚡ ANIME UNDERGROUND</div>
          <div className="nav-btns">
            {LOCS.map(l => (
              <button key={l.id} className="nav-btn" onClick={() => setModal(l.id)}>{l.icon} {l.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* TICKER */}
      {entered && (
        <div className="ticker" style={{zIndex:80}}>
          <div className="ticker-inner">
            {[...TICKER_ITEMS,...TICKER_ITEMS].map((t,i) => (
              <span key={i} className="tick-item" style={{color:t.c+"66"}}>{t.t}</span>
            ))}
          </div>
        </div>
      )}

      {/* LOCATION SIGNS */}
      {entered && (
        <div className="locs">
          {LOCS.map((l,i) => (
            <div key={l.id} className="loc-wrap" style={{"--ld":`${i*.18}s`,"--lc":l.color}} onClick={() => setModal(l.id)}>
              <div className="loc-board" style={{"--lc":l.color}}>
                <div className="loc-dot" style={{"--lc":l.color,"--ld":`${i*.2}s`}}/>
                <span className="loc-icon">{l.icon}</span>
                <span className="loc-label" style={{"--lc":l.color}}>{l.label}</span>
                <span className="loc-jp">{l.jp}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CHARACTERS */}
      {entered && (
        <>
          <div className="char-max" onClick={() => showBubble("max")}>
            {bubbleMax && <div className="speech">{bubbleMax}</div>}
            <img className="char-img" src="https://media.base44.com/images/public/69d68f8dc6c9cbf2b36295b5/57d4b8fee_generated_image.png" alt="Max"/>
          </div>
          <div className="char-son" onClick={() => showBubble("son")}>
            {bubbleSon && <div className="speech">{bubbleSon}</div>}
            <img className="char-img son-img" src="https://media.base44.com/images/public/69d68f8dc6c9cbf2b36295b5/4ffadf4e4_generated_image.png" alt="Son"/>
          </div>
        </>
      )}

      {/* MUSIC PLAYER */}
      {entered && showPlayer && (
        <div className="player">
          <div className="ph">
            <div className={`pdisc${playing?" spin":""}`}>🎧</div>
            <div style={{flex:1,minWidth:0}}>
              <div className="ptrack">{TRACKS[trackIdx].n}</div>
              <div className="psub">SOURFACEMUSIC</div>
            </div>
            <div className="peq">
              {[1,2,3,4,5].map(j => <div key={j} className={`eq-bar${playing?" on":""}`}/>)}
            </div>
          </div>
          <div className="pctls">
            <button className="pc" onClick={prevTrack}>⏮</button>
            <button className="pc main" onClick={togglePlay}>{playing?"⏸ PAUSE":"▶ PLAY"}</button>
            <button className="pc" onClick={nextTrack}>⏭</button>
            <button className="pc" onClick={() => setShowList(p => !p)}>📋</button>
          </div>
          <div className="pprog">
            <span className="pt">0:00</span>
            <div className="pbar">
              <div className="pfill" style={{width:`${progress}%`}}/>
            </div>
            <span className="pt">—:——</span>
          </div>
          <div className="pvol">
            <span className="pvl">VOL</span>
            <input type="range" min="0" max="1" step="0.05" defaultValue="0.55"
              onChange={e => { if(audRef.current) audRef.current.volume = parseFloat(e.target.value); }}
              style={{flex:1,accentColor:"#00f5ff",cursor:"pointer"}}/>
          </div>
          <div className={`ptlist${showList?" open":""}`}>
            {TRACKS.map((tr,i) => (
              <div key={i} className={`ti${i===trackIdx?" on":""}`} onClick={() => loadTrack(i)}>
                <span className="tn">{i+1}</span>
                <span className="tl">{tr.n}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SPLASH */}
      {!entered && (
        <div style={{
          position:"absolute",inset:0,zIndex:50,
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          padding:"20px",textAlign:"center",
        }}>
          <div className="eyebrow">アンダーグラウンド · 東京 · SOURFACEMUSIC</div>
          <div className="logo-title">
            {"ANIME ".split("").map((ch,i) => (
              <span key={i} className="logo-char" style={{
                color:LOGO_COLORS[i%5],
                textShadow:`0 0 20px ${LOGO_COLORS[i%5]},0 0 40px ${LOGO_COLORS[i%5]}88`,
                animationDelay:`${i*.05+.1}s`,
              }}>{ch===` `?"\u00A0":ch}</span>
            ))}
            <span className="logo-word" style={{margin:"0 8px"}}/>
            {"UNDERGROUND".split("").map((ch,i) => (
              <span key={i} className="logo-char" style={{
                color:LOGO_COLORS[(i+5)%5],
                textShadow:`0 0 20px ${LOGO_COLORS[(i+5)%5]},0 0 40px ${LOGO_COLORS[(i+5)%5]}88`,
                animationDelay:`${(i+6)*.05+.1}s`,
              }}>{ch}</span>
            ))}
          </div>
          <div className="sub-line">THE STREET IS ALIVE · ENTER IF YOU REAL</div>
          <button className="enter-btn" onClick={enter}>▶ ENTER THE STREET</button>
        </div>
      )}

      {/* MODAL */}
      {modal && md && (
        <div className="mbg" onClick={e => { if(e.target.className==="mbg")setModal(null); }}>
          <div className="mbox" style={{"--mc":md.color+"66","--ms":md.color+"22"}}>
            <div className="mbnr">
              <div className="mbnr-bg" style={{background:md.bg}}/>
              <div className="micon-lg">{md.icon}</div>
            </div>
            <div className="mbody">
              <div className="mtag" style={{background:md.color+"18",color:md.color,border:`1px solid ${md.color}33`}}>{md.icon} {modal.toUpperCase()}</div>
              <div className="mtitle" style={{textShadow:`0 0 20px ${md.color}44`}}>{md.title}</div>
              <div className="mjp">{md.jp}</div>
              <div className="mdesc">{md.desc}</div>

              {md.hostess && (
                <div className="hw">
                  <img className="himg" src="https://media.base44.com/images/public/69d68f8dc6c9cbf2b36295b5/0d55cd2ec_generated_image.png" alt="Hostess"/>
                  <div>
                    <div className="hname">YOUR HOSTESS</div>
                    <div className="hrole">RAMEN SPOT · COMMUNITY HUB</div>
                    <div className="hmsg">Welcome in. Broth is hot, vibe is right. 🏮</div>
                  </div>
                </div>
              )}
              {modal === "arcade" && (
                <div className="ag">
                  <div className="agi"><div className="agt">🏆 TOURNAMENT</div><div className="agv">Street Fighter · Sat 10PM</div></div>
                  <div className="agi"><div className="agt">🎵 RHYTHM</div><div className="agv">Beat battles every Friday</div></div>
                  <div className="agi"><div className="agt">🎰 CRANE</div><div className="agv">Anime collectibles inside</div></div>
                  <div className="agi"><div className="agt">📺 STREAM</div><div className="agv">Twitch live · Wednesdays</div></div>
                </div>
              )}
              {md.products && (
                <div className="pgrid">
                  {md.products.map(p => (
                    <div key={p.id} className="pcard" onClick={() => { setCheckout(p); setModal(null); setCoSuccess(false); }}>
                      <span className="pemoji">{p.emoji}</span>
                      <div className="pname">{p.name}</div>
                      <div className="pprice">${p.price.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="macts">
                <button className="mbtn" style={{background:`linear-gradient(135deg,${md.color},${md.color}88)`,color:"#000"}} onClick={() => setModal(null)}>ENTER →</button>
                <button className="mbtn-x" onClick={() => setModal(null)}>✕ CLOSE</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT */}
      {checkout && (
        <div className="cobg" onClick={e => { if(e.target.className==="cobg"){setCheckout(null);setCoSuccess(false);} }}>
          <div className="cobox">
            {coSuccess ? (
              <div style={{textAlign:"center",padding:"16px 0"}}>
                <span className="cosuccess-icon">✅</span>
                <div className="cosuccess-title">ORDER CONFIRMED!</div>
                <div className="cosuccess-msg">
                  Thank you for supporting SOURFACEMUSIC! 🔥<br/>
                  {checkout.emoji} {checkout.name}<br/><br/>
                  Check your email for your download link.
                </div>
                <button className="copay" onClick={() => { setCheckout(null); setCoSuccess(false); }}>🔥 BACK TO THE STREET</button>
              </div>
            ) : (
              <>
                <div className="cotitle">CHECKOUT</div>
                <div className="coitem">{checkout.emoji} {checkout.name}</div>
                <div className="coprice">${checkout.price.toFixed(2)}</div>
                <div className="coform">
                  <input className="coin" type="email" placeholder="Email address"/>
                  <input className="coin" type="text" placeholder="Full name"/>
                  <input className="coin" type="text" placeholder="Card number" maxLength={19}
                    value={cardVal} onChange={e => setCardVal(fmtCard(e.target.value))}/>
                  <div className="corow">
                    <input className="coin" type="text" placeholder="MM/YY" maxLength={5}
                      value={expVal} onChange={e => setExpVal(fmtExp(e.target.value))}/>
                    <input className="coin" type="text" placeholder="CVV" maxLength={4}/>
                  </div>
                </div>
                <button className="copay" onClick={() => setCoSuccess(true)}>
                  💳 PAY ${checkout.price.toFixed(2)}
                </button>
                <div className="cocancel" onClick={() => { setCheckout(null); setCoSuccess(false); }}>✕ CANCEL</div>
                <div className="cosecure">🔒 Secured by Stripe · SSL Encrypted</div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
