import { FC, useState, useEffect, useRef, useCallback } from 'react';
import pkg from '../../../package.json';

// ❌ DO NOT EDIT ANYTHING ABOVE THIS LINE

export const HomeView: FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white font-sans">
      {/* HEADER – fake Scrolly feed tabs */}
      <header className="flex items-center justify-center border-b border-white/10 py-3">
        <div className="flex items-center gap-2 rounded-full bg-white/5 px-2 py-1 text-[11px]">
          <button className="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white">
            Feed
          </button>
          <button className="rounded-full px-3 py-1 text-slate-400">
            Casino
          </button>
          <button className="rounded-full px-3 py-1 text-slate-400">
            Kids
          </button>
        </div>
      </header>

      {/* MAIN – central game area (phone frame) */}
      <main className="flex flex-1 items-center justify-center px-4 py-3">
        <div className="relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-[0_0_40px_rgba(56,189,248,0.35)]">
          {/* Fake “feed card” top bar inside the phone */}
          <div className="flex items-center justify-between px-3 py-2 text-[10px] text-slate-400">
            <span className="rounded-full bg-white/5 px-2 py-1 text-[9px] uppercase tracking-wide">
              Cyber Scroll
            </span>
          </div>

          {/* The game lives INSIDE this phone frame */}
          <div className="flex h-[calc(100%-26px)] flex-col items-center justify-start px-3 pb-3 pt-1">
            <GameSandbox />
          </div>
        </div>
      </main>

      {/* FOOTER – tiny version text */}
      <footer className="flex h-5 items-center justify-center border-t border-white/10 px-2 text-[9px] text-slate-500">
        <span>Scrolly · v{pkg.version}</span>
      </footer>
    </div>
  );
};

// ✅ THIS IS THE ONLY PART YOU EDIT FOR THE JAM

// --- GAME CONFIG ---

const PRESET_THEMES = [
  { name: "NEON", bg: "#020617", plat: "#0ea5e9", player: "#d946ef", text: "#f0f9ff", sound: "sine" as OscillatorType },
  { name: "PLASMA", bg: "#2a0a18", plat: "#f59e0b", player: "#f43f5e", text: "#fff1f2", sound: "triangle" as OscillatorType },
  { name: "JUNGLE", bg: "#022c22", plat: "#2dd4bf", player: "#a3e635", text: "#f0fdf4", sound: "sine" as OscillatorType },
  { name: "CYBER", bg: "#0f172a", plat: "#38bdf8", player: "#22d3ee", text: "#ecfeff", sound: "square" as OscillatorType },
  { name: "GOLD", bg: "#271a00", plat: "#fbbf24", player: "#ffffff", text: "#fef3c7", sound: "triangle" as OscillatorType },
  { name: "VOID", bg: "#000000", plat: "#ffffff", player: "#6366f1", text: "#ffffff", sound: "sawtooth" as OscillatorType },
  { name: "QUANTUM", bg: "#1e1b4b", plat: "#818cf8", player: "#c084fc", text: "#faf5ff", sound: "sawtooth" as OscillatorType },
];

const getTheme = (level: number) => {
  if (level % 5 === 0) {
    return {
      name: "GALACTIC WAR",
      bg: "#050101",
      plat: "#ef4444",
      player: "#ffffff",
      text: "#fca5a5",
      sound: "sawtooth" as OscillatorType
    };
  }
  if (level % 3 === 0) {
    return {
      name: "ASTEROID BELT",
      bg: "#0c0a09",
      plat: "#d97706",
      player: "#fbbf24",
      text: "#fcd34d",
      sound: "square" as OscillatorType
    };
  }
  if (level <= PRESET_THEMES.length) {
    return PRESET_THEMES[level - 1];
  }
  const hue = (level * 137.5) % 360;
  const hue2 = (hue + 180) % 360;
  const sounds: OscillatorType[] = ['sine', 'square', 'sawtooth', 'triangle'];
  return {
    name: `SECTOR ${level}`,
    bg: `hsl(${hue}, 60%, 5%)`,
    plat: `hsl(${hue}, 80%, 60%)`,
    player: `hsl(${hue2}, 90%, 70%)`,
    text: `hsl(${hue}, 20%, 95%)`,
    sound: sounds[level % sounds.length]
  };
};

const BOOSTERS = [
  { type: 0, name: "BIT", val: 150, color: "#fde047", chance: 0.60, radius: 6 },
  { type: 1, name: "BYTE", val: 500, color: "#38bdf8", chance: 0.25, radius: 8 },
  { type: 2, name: "SHARD", val: 1500, color: "#f43f5e", chance: 0.10, radius: 10 },
  { type: 3, name: "CORE", val: 5000, color: "#d8b4fe", chance: 0.04, radius: 12 },
  { type: 4, name: "SOL", val: 10000, color: "#14F195", chance: 0.01, radius: 14, glow: true },
  { type: 5, name: "SHIELD", val: 0, color: "#3b82f6", chance: 0.03, radius: 12 },
  { type: 6, name: "MAGNET", val: 0, color: "#a855f7", chance: 0.03, radius: 12 },
];

const LEVEL_THRESHOLD = 5000;
const BASE_BOSS_ENEMIES = 5;

const CHARACTERS = [
  { name: "NEON", icon: "⚡", desc: "Balanced Adventurer", perk: "Starts with 1 Shield", bonus: 'shield' as const, color: "#d946ef", jump: 16, speed: 1.8, fire: 0.42, hp: 2 },
  { name: "SCORCH", icon: "🔥", desc: "Fast & Glass Cannon", perk: "Double fire speed!", bonus: 'none' as const, color: "#f43f5e", jump: 14, speed: 2.4, fire: 0.35, hp: 1 },
  { name: "TITAN", icon: "🛡️", desc: "Slow but Unbreakable", perk: "Starts with 2 Shields", bonus: 'shield2' as const, color: "#3b82f6", jump: 15, speed: 1.4, fire: 0.50, hp: 4 },
  { name: "GHOST", icon: "👻", desc: "Floats like a ghost", perk: "Starts with Magnet!", bonus: 'magnet' as const, color: "#14F195", jump: 20, speed: 1.6, fire: 0.45, hp: 2 },
];

const FUN_FACTS = [
  "💡 Solana uses Proof of History (PoH) to keep time on the blockchain!",
  "⚡ A Solana transaction uses less energy than two Google searches.",
  "🧱 Solana blocks are produced roughly every 400 milliseconds.",
  "💰 'Rent' is the SOL required to store data on-chain.",
  "🚀 Firedancer is a new client built to make Solana even faster.",
  "🏎️ Solana can theoretically process over 50,000 transactions per second.",
  "🖼️ Compressed NFTs let you mint millions of assets for a fraction of the cost.",
  "📜 Scrolly turns your social feed into a crypto-native experience.",
  "🎮 This game was built for the Scrolly No-Code Game Jam!",
  "👀 Scrolly lets you discover hot new dApps just by swiping.",
  "🤝 Scrolly bridges the gap between entertainment and DeFi.",
  "✨ Scrolly is aiming to be the 'TikTok of Web3 Finance'.",
  "🔥 Scrolly creators can earn just by sharing engaging content.",
];

export const GameSandbox: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [hp, setHp] = useState(2);
  const [gameState, setGameState] = useState<'START' | 'CHARACTER_SELECT' | 'PLAYING' | 'GAMEOVER'>('CHARACTER_SELECT');
  const [selectedCharIndex, setSelectedCharIndex] = useState(0);
  const [deathQuote, setDeathQuote] = useState("");
  const [bossProgress, setBossProgress] = useState(0);
  const [lifetimeBits, setLifetimeBits] = useState(0);
  const [upgrades, setUpgrades] = useState({ jump: 0, fireRate: 0, health: 0 });
  const [showShop, setShowShop] = useState(false);

  const state = useRef({
    player: { x: 0, y: 0, vx: 0, vy: 0, w: 24, h: 24, type: 0, trail: [] as { x: number, y: number, age: number }[], color: '' },
    cameraY: 0,
    shake: 0,
    warpEffect: 0,
    flashEffect: 0,
    damageEffect: 0,
    gameTime: 0,
    platforms: [] as { x: number, y: number, w: number, h: number, type: number, visited: boolean, osc: number, oscSpeed: number, crumbleTimer: number, isSlippery: boolean }[],
    collectibles: [] as { x: number, y: number, r: number, active: boolean, osc: number, boosterId: number }[],
    hazards: [] as { x: number, y: number, w: number, h: number, vx: number, vy: number, type: 'DEBRIS' | 'LASER', shape: number, angle: number, color?: string }[],
    enemies: [] as { id: number, x: number, y: number, w: number, h: number, vx: number, vy: number, hp: number, maxHp: number, type: number, slot: number }[],
    bullets: [] as { x: number, y: number, vx: number, vy: number, life: number }[],
    particles: [] as { x: number, y: number, vx: number, vy: number, life: number, color: string, size: number }[],
    stars: [] as { x: number, y: number, size: number, alpha: number, speed: number }[],
    floatingTexts: [] as { x: number, y: number, text: string, life: number, color: string, vy: number, scale: number }[],
    score: 0,
    combo: 0,
    hp: 2,
    maxHp: 2,
    invincibleUntil: 0,
    highestPlatformY: 0,
    inputs: { left: false, right: false, touching: false, touchX: 0 },
    bgHue: 0,
    lastDebrisTime: 0,
    lastShotTime: 0,
    currentLevel: 1,
    bossKills: 0,
    bossSpawnedCount: 0,
    bossFireTimer: 0,
    bossFireIndex: 0,
    shield: 0,
    magnetTimer: 0,
    char: CHARACTERS[0],
  });

  useEffect(() => {
    const savedHS = localStorage.getItem('neon-rise-hs');
    if (savedHS) setHighScore(parseInt(savedHS));

    const savedBits = localStorage.getItem('neon-rise-bits');
    if (savedBits) setLifetimeBits(parseInt(savedBits));

    const savedUpgrades = localStorage.getItem('neon-rise-upgrades');
    if (savedUpgrades) setUpgrades(JSON.parse(savedUpgrades));
  }, []);

  const buyUpgrade = (type: 'jump' | 'fireRate' | 'health') => {
    const currentLevel = upgrades[type];
    const maxLevels = { jump: 5, fireRate: 5, health: 3 };
    if (currentLevel >= maxLevels[type]) return;

    const costs = {
      jump: (currentLevel + 1) * 200,
      fireRate: (currentLevel + 1) * 150,
      health: (currentLevel + 1) * 500
    };
    const cost = costs[type];

    if (lifetimeBits >= cost) {
      const newBits = lifetimeBits - cost;
      setLifetimeBits(newBits);
      localStorage.setItem('neon-rise-bits', newBits.toString());

      const newUpgrades = { ...upgrades, [type]: currentLevel + 1 };
      setUpgrades(newUpgrades);
      localStorage.setItem('neon-rise-upgrades', JSON.stringify(newUpgrades));
      playSound('powerup');
    } else {
      playSound('hazard');
    }
  };

  const initAudio = () => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playTone = (freq: number, type: OscillatorType, duration: number, vol: number = 0.1) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + duration);

    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  const playSound = (s: 'jump' | 'collect' | 'powerup' | 'die' | 'theme' | 'hazard' | 'shoot' | 'explode' | 'hurt', variant = 0) => {
    if (!audioCtxRef.current) return;
    const theme = getTheme(state.current.currentLevel);
    const themeSound = theme.sound;

    switch (s) {
      case 'jump': playTone(300 + Math.random() * 50, themeSound, 0.1, 0.1); break;
      case 'collect':
        const base = 800 + (variant * 300);
        playTone(base, 'square', 0.1, 0.05);
        setTimeout(() => playTone(base * 1.5, 'square', 0.1, 0.05), 50);
        break;
      case 'powerup': playTone(600, 'sawtooth', 0.3, 0.1); break;
      case 'die': playTone(150, 'sawtooth', 0.5, 0.2); break;
      case 'hurt': playTone(200, 'sawtooth', 0.2, 0.2); break;
      case 'hazard': playTone(100, 'sawtooth', 0.2, 0.1); break;
      case 'shoot': playTone(800, 'square', 0.05, 0.05); break;
      case 'explode': playTone(100, 'sawtooth', 0.3, 0.2); break;
      case 'theme': playTone(440 + (variant * 50), 'sine', 0.6, 0.05); break;
    }
  };

  const initGame = () => {
    initAudio();
    if (!canvasRef.current) return;
    const { width, height } = canvasRef.current;

    state.current.score = 0;
    state.current.combo = 0;
    state.current.cameraY = 0;
    state.current.shake = 0;
    state.current.gameTime = 0;
    state.current.bgHue = 0;
    state.current.warpEffect = 0;
    state.current.flashEffect = 0;
    state.current.damageEffect = 0;
    state.current.lastDebrisTime = 0;
    state.current.invincibleUntil = 0;
    state.current.currentLevel = 1;
    state.current.lastShotTime = 0;
    state.current.bossKills = 0;
    state.current.bossSpawnedCount = 0;
    state.current.bossFireTimer = 0;
    state.current.bossFireIndex = 0;
    state.current.shield = 0;
    state.current.magnetTimer = 0;

    const character = CHARACTERS[selectedCharIndex];
    state.current.char = character;

    // Apply starting bonus
    if (character.bonus === 'shield') state.current.shield = 1;
    if (character.bonus === 'shield2') state.current.shield = 2;
    if (character.bonus === 'magnet') state.current.magnetTimer = 15;

    // Apply Upgrades
    const startHp = character.hp + upgrades.health;
    state.current.hp = startHp;
    state.current.maxHp = startHp;
    setHp(startHp);

    setScore(0);
    setLevel(1);
    setBossProgress(0);

    state.current.player = {
      x: width / 2 - 12,
      y: height - 150,
      vx: 0,
      vy: -character.jump,
      w: 24,
      h: 24,
      type: 0,
      trail: [],
      color: character.color
    };

    state.current.platforms = [];
    state.current.collectibles = [];
    state.current.hazards = [];
    state.current.enemies = [];
    state.current.bullets = [];
    state.current.highestPlatformY = height;

    const platformCount = 15;
    for (let i = 0; i < platformCount; i++) {
      spawnPlatform(width, height - (i * 90) - 50, 1);
    }

    state.current.stars = [];
    const starCounts = [60, 40, 20]; // Background, Midground, Foreground
    for (let layer = 0; layer < 3; layer++) {
      for (let i = 0; i < starCounts[layer]; i++) {
        state.current.stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: (layer + 1) * 0.8 + Math.random(),
          alpha: 0.2 + Math.random() * 0.8,
          speed: (layer + 1) * 0.2, // This will be the parallax factor
          layer // Add layer for rendering
        } as any);
      }
    }

    state.current.particles = [];
    state.current.floatingTexts = [];
    setGameState('PLAYING');
    playSound('theme', 1);
  };

  const spawnPlatform = (canvasW: number, forcedY?: number, currentLvl = 1, forceX?: number) => {
    let y = forcedY !== undefined ? forcedY : 0;

    if (forcedY === undefined) {
      const gap = 90 + (Math.random() * 40);
      y = state.current.highestPlatformY - gap;
    }
    state.current.highestPlatformY = y;

    let w = 50 + Math.random() * 30;
    const x = forceX !== undefined ? forceX : Math.random() * (canvasW - w);

    let type = 0;
    const r = Math.random();

    const boostChance = Math.min(0.5, 0.05 + (currentLvl * 0.02));
    const moveChance = currentLvl > 1 ? Math.min(0.6, 0.1 + (currentLvl * 0.03)) : 0;
    const specialChance = currentLvl > 5 ? Math.min(0.4, 0.05 + (currentLvl * 0.02)) : 0;

    if (r < boostChance) type = 1;
    else if (r < boostChance + moveChance) type = 2;
    else if (r < boostChance + moveChance + specialChance) {
      type = Math.random() > 0.5 ? 3 : 4; // Crumbling or Slippery
    }
    else type = 0;

    if (currentLvl >= 10) w *= 0.8;
    if (currentLvl >= 20) w *= 0.9;

    state.current.platforms.push({
      x, y, w, h: 14,
      type,
      visited: false,
      osc: Math.random() * Math.PI * 2,
      oscSpeed: 0.02 + Math.random() * 0.05,
      crumbleTimer: -1,
      isSlippery: type === 4
    });

    if (Math.random() > 0.50) {
      const roll = Math.random();
      let boosterId = 0;

      if (roll < BOOSTERS[4].chance) boosterId = 4;
      else if (roll < BOOSTERS[6].chance + 0.02 && currentLvl > 5) boosterId = 6; // Magnet
      else if (roll < BOOSTERS[5].chance + 0.04 && currentLvl > 2) boosterId = 5; // Shield
      else if (roll < BOOSTERS[3].chance + 0.06 && currentLvl > 3) boosterId = 3;
      else if (roll < BOOSTERS[2].chance + 0.16) boosterId = 2;
      else if (roll < BOOSTERS[1].chance + 0.36) boosterId = 1;
      else boosterId = 0;

      state.current.collectibles.push({
        x: x + w / 2,
        y: y - 35,
        r: BOOSTERS[boosterId].radius,
        active: true,
        osc: Math.random() * Math.PI * 2,
        boosterId
      });
    }
  };

  const spawnHazard = (canvasW: number, camY: number, currentLvl: number) => {
    if (currentLvl < 2) return;

    const isBossLevel = currentLvl % 5 === 0;
    const isAsteroidLevel = currentLvl % 3 === 0 && !isBossLevel;

    if (state.current.gameTime - state.current.lastDebrisTime < 20) return;

    let baseChance = 0.01 + (currentLvl * 0.001);
    if (isBossLevel) baseChance = 0.08;
    if (isAsteroidLevel) baseChance = 0.15;

    const chance = Math.min(0.3, baseChance);

    if (Math.random() > chance) return;

    let type = 'DEBRIS';
    if (currentLvl >= 5 && Math.random() > 0.5 && !isAsteroidLevel && !isBossLevel) {
      type = 'LASER';
    }

    if (type === 'DEBRIS') {
      state.current.lastDebrisTime = state.current.gameTime;
      const size = 35 + Math.random() * 15;
      const colors = ['#f472b6', '#22d3ee', '#a3e635', '#fbbf24', '#f87171'];
      const speedMultiplier = isBossLevel ? 0.3 : 1.0;

      state.current.hazards.push({
        x: Math.random() * (canvasW - size),
        y: camY - 100,
        w: size,
        h: size,
        vx: 0, // FIXED: Straight down
        vy: (3 + (currentLvl * 0.15)) * speedMultiplier,
        type: 'DEBRIS',
        shape: 0,
        angle: Math.random() * Math.PI,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    } else {
      const y = camY + (Math.random() * 600);
      const fromLeft = Math.random() > 0.5;
      state.current.hazards.push({
        x: fromLeft ? -100 : canvasW + 100,
        y: y,
        w: 40,
        h: 10,
        vx: fromLeft ? 8 + currentLvl : -(8 + currentLvl),
        vy: 0,
        type: 'LASER',
        shape: 0,
        angle: 0
      });
    }
  };

  const spawnEnemy = (canvasW: number, camY: number, currentLvl: number) => {
    if (currentLvl % 5 !== 0) return;

    // Calculate target enemies for this boss level: 5, 6, 7...
    const bossTarget = BASE_BOSS_ENEMIES + (Math.floor(currentLvl / 5)) - 1;

    // Stop spawning if we have already spawned the quota
    if (state.current.bossSpawnedCount >= bossTarget) return;

    const slots = 5;
    const slotWidth = canvasW / slots;

    if (state.current.enemies.length >= 5) return;
    if (Math.random() > 0.05) return;

    const slot = Math.floor(Math.random() * slots);
    const isOccupied = state.current.enemies.some(e => e.slot === slot);
    if (isOccupied) return;

    const size = 40;
    state.current.bossSpawnedCount++; // Increment spawned count
    const type = Math.floor(Math.random() * 2);
    state.current.enemies.push({
      id: Math.random(),
      x: slot * slotWidth + (slotWidth - size) / 2,
      y: camY - 100,
      w: size,
      h: size,
      vx: type === 1 ? (Math.random() > 0.5 ? 3 : -3) : 0,
      vy: 0,
      hp: 5,
      maxHp: 5,
      type: type,
      slot: slot
    });
  };

  const spawnParticles = (x: number, y: number, color: string, count = 8, burst = 5) => {
    // Cap total particles for mobile performance
    if (state.current.particles.length > 200) return;
    const finalCount = Math.min(count, 200 - state.current.particles.length);

    for (let i = 0; i < finalCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * burst;
      state.current.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        color,
        size: 2 + Math.random() * 3
      });
    }
  };

  const addFloatingText = (x: number, y: number, text: string, color: string, scale = 1) => {
    state.current.floatingTexts.push({ x, y, text, life: 1.0, color, vy: -3, scale });
  };

  const update = () => {
    if (gameState !== 'PLAYING' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const s = state.current;
    const scoreBasedLevel = Math.floor(s.score / LEVEL_THRESHOLD) + 1;

    // --- REFINED LEVELING LOGIC (NO JUMPS) ---
    const isCurrentlyBoss = s.currentLevel % 5 === 0;

    if (!isCurrentlyBoss) {
      // Normal Mode: Check if score warrants a level up
      if (scoreBasedLevel > s.currentLevel) {
        // Only go up one level at a time, never jump
        const nextLevel = s.currentLevel + 1;
        s.currentLevel = nextLevel;
      }
    } else {
      // Boss Mode: Score doesn't matter for leveling, Kills do.
      const bossTargetKills = BASE_BOSS_ENEMIES + (Math.floor(s.currentLevel / 5)) - 1;
      if (s.bossKills >= bossTargetKills) {
        // Boss Defeated
        s.currentLevel++;
        // Sync score to new level baseline to prevent weird progress bar behavior
        // But do not let it overshoot into the NEXT level range
        const newBaseScore = (s.currentLevel - 1) * LEVEL_THRESHOLD;
        if (s.score < newBaseScore) s.score = newBaseScore;
      }
    }

    const currentLevel = s.currentLevel;
    const theme = getTheme(currentLevel);
    const width = canvas.width;
    const height = canvas.height;
    const isBossLevel = currentLevel % 5 === 0;

    // Trigger visual transitions & Mode switching
    if (currentLevel > level) {
      setLevel(currentLevel);

      addFloatingText(width / 2, s.cameraY + height / 2, `LEVEL ${currentLevel}`, theme.text, 2.5);

      if (currentLevel % 5 === 0) {
        // ENTER BOSS MODE
        s.hp = 3; s.maxHp = 3; setHp(3);
        s.bossKills = 0; s.bossSpawnedCount = 0; setBossProgress(0);
        addFloatingText(width / 2, s.cameraY + height / 2 + 40, "BOSS MODE!", "#ef4444", 2);
        s.platforms = [];
        s.lastShotTime = 0;
        s.bossFireTimer = s.gameTime + 2.0; // Initial delay
        s.bossFireIndex = 0;
      } else {
        // ENTERING NORMAL MODE
        s.hp = 2; s.maxHp = 2; setHp(2);
        if (currentLevel % 3 === 0) {
          addFloatingText(width / 2, s.cameraY + height / 2 + 40, "ASTEROID FIELD!", "#fbbf24", 2);
        }
        // IF COMING FROM BOSS (Previous level was boss)
        if ((currentLevel - 1) % 5 === 0) {
          s.enemies = [];
          s.bullets = [];
          s.hazards = [];

          // 1. Center player relative to camera to avoid edge deaths
          s.player.y = s.cameraY + height * 0.5;
          s.player.vy = -10; // Gentle hop up

          // 2. Reset Platform Height Logic based on new safe Y
          s.highestPlatformY = s.player.y - 100;

          // 3. Spawn a SAFETY NET platform directly underneath
          const safetyW = 150;
          state.current.platforms.push({
            x: s.player.x + (s.player.w / 2) - (safetyW / 2),
            y: s.player.y + 100,
            w: safetyW,
            h: 14,
            type: 0,
            visited: true, // No points for safety
            osc: 0,
            oscSpeed: 0,
            crumbleTimer: -1,
            isSlippery: false
          });

          // 4. Spawn a few ahead to prevent empty screen
          for (let k = 1; k <= 5; k++) {
            spawnPlatform(width, s.player.y - (k * 100), currentLevel);
          }

          addFloatingText(width / 2, s.cameraY + height / 2 + 40, "GRAVITY RESTORED", "#fff", 1.5);
        }
      }

      playSound('theme', currentLevel);
      s.shake = 30;
      s.warpEffect = 2.0;
      s.flashEffect = 1.0;
      spawnParticles(width / 2, s.cameraY + height / 2, "#ffffff", 100, 30);
    }

    s.gameTime += 0.05;
    if (s.shake > 0) s.shake *= 0.9;
    if (s.warpEffect > 0) s.warpEffect -= 0.02;
    if (s.flashEffect > 0) s.flashEffect -= 0.05;
    if (s.damageEffect > 0) s.damageEffect -= 0.05;
    s.bgHue = (s.bgHue + 0.2) % 360;

    spawnHazard(width, s.cameraY, currentLevel);
    spawnEnemy(width, s.cameraY, currentLevel);

    // --- PHYSICS & CONTROLS ---

    // Auto-Fire in Boss Mode (Player)
    const fireDelay = Math.max(0.15, s.char.fire - (upgrades.fireRate * 0.05));
    if (isBossLevel && s.gameTime - s.lastShotTime > fireDelay) {
      s.lastShotTime = s.gameTime;
      s.bullets.push({
        x: s.player.x + s.player.w / 2,
        y: s.player.y,
        vx: 0,
        vy: -18,
        life: 1.0
      });
      playSound('shoot');
    }

    // Movement
    // Movement
    if (s.inputs.touching) {
      const targetX = s.inputs.touchX - s.player.w / 2;
      const diff = targetX - s.player.x;
      s.player.vx += diff * 0.15;
      s.player.vx *= 0.75;
    } else {
      if (s.inputs.left) s.player.vx -= s.char.speed;
      if (s.inputs.right) s.player.vx += s.char.speed;

      // Handle Slippery Friction
      const onSlippery = s.platforms.some(p => p.isSlippery &&
        s.player.x + s.player.w > p.x && s.player.x < p.x + p.w &&
        Math.abs(s.player.y + s.player.h - p.y) < 10);

      s.player.vx *= onSlippery ? 0.98 : 0.88;
    }
    s.player.x += s.player.vx;

    // Boundary Wrap
    if (s.player.x < -s.player.w) s.player.x = width;
    if (s.player.x > width) s.player.x = -s.player.w;

    if (isBossLevel) {
      // FLIGHT MODE (No Gravity)
      s.player.vy = 0;
      // Lock player to bottom area, but gently
      const targetY = s.cameraY + height - 120;
      s.player.y += (targetY - s.player.y) * 0.1;

      // Auto-scroll camera
      s.cameraY -= 3;
      s.score += 0.35;
      if (Math.floor(s.gameTime * 2) % 2 === 0) setScore(Math.floor(s.score));
    } else {
      // PLATFORM MODE (Gravity)
      s.player.vy += 0.55;
      s.player.y += s.player.vy;
    }

    // Camera Follow
    const targetCamY = s.player.y - height * 0.6;
    if (targetCamY < s.cameraY) {
      const diff = s.cameraY - targetCamY;
      s.cameraY = targetCamY;

      if (!isBossLevel) s.score += diff * 0.3;
      // Throttle React state update
      if (Math.floor(s.gameTime * 2) % 2 === 0) setScore(Math.floor(s.score));

      if (s.score > 2000) s.player.type = 1;
      if (s.score > 6000) s.player.type = 2;
      if (s.score > 12000) s.player.type = 3;
    }

    if (!isBossLevel && s.player.y > s.cameraY + height + 100) {
      playSound('die');
      setDeathQuote(FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]);
      setGameState('GAMEOVER');

      // Save stats
      const finalScore = Math.floor(s.score);
      if (finalScore > highScore) {
        setHighScore(finalScore);
        localStorage.setItem('neon-rise-hs', finalScore.toString());
      }

      return;
    }

    // --- ENTITIES ---

    // Platform Management
    if (!isBossLevel) {
      s.platforms.forEach((p, index) => {
        p.osc += p.oscSpeed;
        if (p.type === 2) p.x += Math.cos(p.osc) * 2.5;

        // Handle Crumbling Platforms
        if (p.crumbleTimer > 0) {
          p.crumbleTimer -= 0.05;
          if (p.crumbleTimer <= 0) {
            s.platforms.splice(index, 1);
            spawnParticles(p.x + p.w / 2, p.y + p.h / 2, "#fff", 15, 3);
            playSound('hazard');
            return;
          }
        }

        if (p.y > s.cameraY + height + 50) {
          s.platforms.splice(index, 1);
          spawnPlatform(width, undefined, currentLevel);
        }
      });
      if (s.platforms.length < 5) spawnPlatform(width, s.cameraY - 100, currentLevel);
    } else {
      s.platforms = [];
    }

    s.collectibles = s.collectibles.filter(c => c.y < s.cameraY + height + 50 && c.active);

    // Bullets (Player) Logic
    for (let i = s.bullets.length - 1; i >= 0; i--) {
      const b = s.bullets[i];
      b.y += b.vy;
      b.x += b.vx;
      b.life -= 0.02;

      // Hit Enemies
      for (let j = s.enemies.length - 1; j >= 0; j--) {
        const e = s.enemies[j];
        if (b.x > e.x && b.x < e.x + e.w && b.y > e.y && b.y < e.y + e.h) {
          e.hp--;
          b.life = 0;
          playSound('explode');
          spawnParticles(e.x + e.w / 2, e.y + e.h / 2, "#fff", 5, 5);

          if (e.hp <= 0) {
            s.enemies.splice(j, 1);
            // Reduced score to prevent skipping levels (was 2000)
            s.score += 500;
            s.bossKills++;
            setBossProgress(s.bossKills); // React State Sync

            addFloatingText(e.x, e.y, "+500", "#ef4444", 1.5);
            spawnParticles(e.x + e.w / 2, e.y + e.h / 2, "#ef4444", 25, 10);
            s.shake = 10;
          }
          break;
        }
      }

      if (b.life <= 0 || b.y < s.cameraY - 100) s.bullets.splice(i, 1);
    }

    // --- ENEMY SEQUENTIAL LOGIC ---
    if (isBossLevel && s.enemies.length > 0) {
      // Fire timing logic
      if (s.gameTime > s.bossFireTimer) {
        // Set next fire time (faster as level increases)
        const delay = Math.max(0.5, 1.5 - (currentLevel * 0.05));
        s.bossFireTimer = s.gameTime + delay;

        // Pick enemy based on index
        const enemyIndex = s.bossFireIndex % s.enemies.length;
        const e = s.enemies[enemyIndex];
        s.bossFireIndex++; // Next one triggers next

        if (e) {
          s.hazards.push({
            x: e.x + e.w / 2 - 6, // Centered (minus half width of 12)
            y: e.y + e.h,
            w: 12,
            h: 12,
            vx: 0,
            vy: 3, // Reduced from 5 to 3
            type: 'LASER',
            shape: 1,
            angle: 0
          });
        }
      }
    }

    // Enemies (Formation & Movement)
    for (let i = s.enemies.length - 1; i >= 0; i--) {
      const e = s.enemies[i];
      const targetY = s.cameraY + 60;
      const sway = Math.sin(s.gameTime * 0.05 + e.id) * 10;
      e.y += (targetY + sway - e.y) * 0.05;

      // Horizontal movement for Interceptor Drones (Type 1)
      if (e.type === 1) {
        e.x += e.vx;
        if (e.x < 0 || e.x > width - e.w) e.vx *= -1; // Bounce
      }

      if (e.y > s.cameraY + height + 100) s.enemies.splice(i, 1);
    }

    // Hazards Logic
    for (let i = s.hazards.length - 1; i >= 0; i--) {
      const h = s.hazards[i];
      h.x += h.vx;
      h.y += h.vy;
      h.angle += 0.05;

      // Collision with player
      if (
        s.player.x < h.x + h.w &&
        s.player.x + s.player.w > h.x &&
        s.player.y < h.y + h.h &&
        s.player.y + s.player.h > h.y
      ) {
        if (s.gameTime > s.invincibleUntil) {
          if (s.shield > 0) {
            s.shield--;
            s.invincibleUntil = s.gameTime + 3; // Reduced invincibility time
            s.shake = 15;
            playSound('powerup');
            addFloatingText(s.player.x, s.player.y, "SHIELD BROKE!", "#3b82f6", 1.8);
            spawnParticles(s.player.x, s.player.y, "#3b82f6", 40, 10); // Better feedback
            s.hazards.splice(i, 1);
            continue;
          }
          s.hp--;
          setHp(s.hp);
          s.invincibleUntil = s.gameTime + 4;
          s.damageEffect = 0.5;
          s.shake = 15;
          playSound('hurt');

          if (s.hp <= 0) {
            playSound('die');
            setDeathQuote(h.type === 'LASER' ? "Shot down!" : "Watch out for debris!");
            setGameState('GAMEOVER');

            const finalScore = Math.floor(s.score);
            if (finalScore > highScore) {
              setHighScore(finalScore);
              localStorage.setItem('neon-rise-hs', finalScore.toString());
            }
            return;
          }
        }
      }

      if (h.y > s.cameraY + height + 100 || h.x < -200 || h.x > width + 200) {
        s.hazards.splice(i, 1);
      }
    }

    if (!isBossLevel && s.player.vy > 0) {
      s.platforms.forEach(p => {
        const hoverY = Math.sin(p.osc) * 3;
        const py = p.y + hoverY;

        if (
          s.player.x + s.player.w * 0.8 > p.x &&
          s.player.x + s.player.w * 0.2 < p.x + p.w &&
          s.player.y + s.player.h > py &&
          s.player.y + s.player.h < py + 25
        ) {
          const jumpBoost = 1 + (upgrades.jump * 0.05);
          s.player.vy = (p.type === 1 ? -(s.char.jump * 1.5) : -s.char.jump) * jumpBoost;
          playSound(p.type === 1 ? 'powerup' : 'jump');
          s.player.y = py - s.player.h;
          spawnParticles(s.player.x + s.player.w / 2, s.player.y + s.player.h, p.type === 1 ? '#fff' : theme.plat, p.type === 1 ? 20 : 12, 6);
          s.shake = p.type === 1 ? 8 : 4; // Increased shake for better feel

          // Start Crumbling Timer
          if (p.type === 3 && p.crumbleTimer < 0) {
            p.crumbleTimer = 0.8; // 0.8 seconds to crumble
            addFloatingText(p.x + p.w / 2, p.y, "CRUMBLING!", "#fff", 1);
          }

          if (!p.visited) {
            p.visited = true;
            s.combo++;
            if (s.combo > 1) {
              const bonus = 100 * s.combo;
              s.score += bonus;
              addFloatingText(s.player.x, s.player.y - 40, `${s.combo}x!`, '#fbbf24', 1 + (s.combo * 0.1));
            }
          } else {
            s.combo = 0;
          }
        }
      });
    }

    if (s.magnetTimer > 0) s.magnetTimer -= 0.05;

    s.collectibles.forEach(c => {
      if (!c.active) return;

      const px = s.player.x + s.player.w / 2;
      const py = s.player.y + s.player.h / 2;
      const booster = BOOSTERS[c.boosterId];

      // Magnetism
      if (s.magnetTimer > 0) {
        const dx = px - c.x;
        const dy = py - c.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          c.x += (dx / dist) * 8;
          c.y += (dy / dist) * 8;
        }
      }

      const dx = px - c.x;
      const dy = py - (c.y + Math.sin(s.gameTime + c.osc) * 5);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < s.player.w / 2 + c.r + 5) {
        c.active = false;
        s.score += booster.val;
        s.shake = 4 + c.boosterId;
        playSound('collect', c.boosterId);

        // Add to lifetime bits if it's BIT or BYTE
        if (c.boosterId === 0 || c.boosterId === 1) {
          const bitVal = c.boosterId === 0 ? 1 : 5;
          setLifetimeBits(prev => {
            const next = prev + bitVal;
            localStorage.setItem('neon-rise-bits', next.toString());
            return next;
          });
        }

        let label = `+${booster.val}`;
        if (c.boosterId === 4) label = "SOL POWER!";
        if (c.boosterId === 5) { label = "SHIELD UP!"; s.shield = Math.min(2, s.shield + 1); }
        if (c.boosterId === 6) { label = "MAGNETIZED!"; s.magnetTimer = 10; } // 10 seconds

        addFloatingText(c.x, c.y, label, booster.color, (c.boosterId === 4 || c.boosterId >= 5) ? 2 : 1.2);

        if (c.boosterId === 4) {
          s.player.vy = -35;
          s.shake = 40;
          s.flashEffect = 1.0;
          spawnParticles(c.x, c.y, booster.color, 100, 20);
        } else {
          spawnParticles(c.x, c.y, booster.color, 15 + (c.boosterId * 5), 10);
        }
      }
    });

    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, theme.bg);
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();

    if (s.shake > 0.5) {
      const rx = (Math.random() - 0.5) * s.shake;
      const ry = (Math.random() - 0.5) * s.shake;
      ctx.translate(rx, ry);
    }

    const pulse = Math.sin(s.gameTime * 0.5) * 0.05;

    // --- PARALLAX STARS (OPTIMIZED) ---
    const isBoss = s.currentLevel % 5 === 0;
    const starCycle = (s.gameTime * 20) % height;

    s.stars.forEach(star => {
      const parallaxFactor = [0.1, 0.3, 0.6][(star as any).layer || 0];
      const scrollSpeed = (star as any).speed * 5;
      const relativeY = (star.y - s.cameraY * parallaxFactor + s.gameTime * scrollSpeed) % height;
      const drawY = relativeY < 0 ? relativeY + height : relativeY;

      // Skip drawing if offscreen
      if (drawY < -50 || drawY > height + 50) return;

      ctx.globalAlpha = star.alpha * (0.5 + pulse);

      let color = "white";
      if (isBoss) color = "#ef4444";
      else if (s.currentLevel >= 8) color = `hsl(${(s.gameTime * 20 + star.x) % 360}, 70%, 70%)`;
      else if ((star as any).layer === 2) color = theme.plat;

      ctx.fillStyle = color;

      if (s.warpEffect > 0.1) {
        const len = star.size * 40 * s.warpEffect;
        ctx.fillRect(star.x, drawY, 2, len);
      } else {
        ctx.beginPath();
        ctx.arc(star.x, drawY, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
    ctx.globalAlpha = 1;

    // --- ATMOSPHERIC GRID (OPTIMIZED) ---
    ctx.save();
    ctx.translate(0, -s.cameraY * 0.2);
    ctx.strokeStyle = theme.plat;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.04 + Math.sin(s.gameTime * 0.3) * 0.02;

    const atmosGridSize = 120; // Increased size for fewer lines
    const atmosStart = Math.floor(s.cameraY * 0.2 / atmosGridSize) * atmosGridSize;

    ctx.beginPath();
    for (let x = 0; x <= width; x += atmosGridSize) {
      ctx.moveTo(x, atmosStart);
      ctx.lineTo(x, atmosStart + height + atmosGridSize);
    }
    for (let y = atmosStart; y < atmosStart + height + atmosGridSize; y += atmosGridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = 1;

    ctx.translate(0, -s.cameraY);

    ctx.lineWidth = 1;
    ctx.strokeStyle = theme.plat;
    const gridSize = 50;
    const gridOffsetY = Math.floor(s.cameraY / gridSize) * gridSize;
    const gridPhase = (s.gameTime * 20) % gridSize;

    ctx.globalAlpha = 0.15;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, s.cameraY); ctx.lineTo(x, s.cameraY + height); ctx.stroke();
    }
    for (let y = gridOffsetY; y < s.cameraY + height + gridSize; y += gridSize) {
      const drawY = y + gridPhase;
      ctx.beginPath(); ctx.moveTo(0, drawY); ctx.lineTo(width, drawY); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Optimized: Batch platform rendering to minimize state changes
    const normalPlats: { p: typeof s.platforms[0], py: number }[] = [];
    const boostPlats: { p: typeof s.platforms[0], py: number }[] = [];

    s.platforms.forEach(p => {
      const hoverY = Math.sin(p.osc) * 3;
      const py = p.y + hoverY;
      if (p.type === 1) boostPlats.push({ p, py });
      else normalPlats.push({ p, py });
    });

    // Batch 1: Normal Platforms
    if (normalPlats.length > 0) {
      ctx.shadowBlur = s.currentLevel > 7 ? 25 : 15;
      ctx.shadowColor = theme.plat;
      ctx.fillStyle = theme.plat;
      ctx.beginPath();
      normalPlats.forEach(({ p, py }) => ctx.roundRect(p.x, py, p.w, p.h, 6));
      ctx.fill();
    }

    // Batch 2: Boost Platforms
    if (boostPlats.length > 0) {
      ctx.shadowBlur = s.currentLevel > 7 ? 25 : 15;
      ctx.shadowColor = '#ffffff';
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      boostPlats.forEach(({ p, py }) => ctx.roundRect(p.x, py, p.w, p.h, 6));
      ctx.fill();
    }

    // Batch 3: Highlights (All) - Optimized
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    normalPlats.forEach(({ p, py }) => ctx.rect(p.x, py, p.w, 3));
    boostPlats.forEach(({ p, py }) => ctx.rect(p.x, py, p.w, 3));
    ctx.fill();

    s.enemies.forEach(e => {
      const floatY = e.y;

      ctx.save();
      ctx.translate(e.x + e.w / 2, floatY + e.h / 2);

      ctx.shadowColor = "#ef4444";
      ctx.shadowBlur = 10;
      ctx.fillStyle = "#ef4444";

      ctx.beginPath();
      if (e.type === 0) {
        ctx.fillRect(-15, -12, 5, 24);
        ctx.fillRect(10, -12, 5, 24);
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
      } else {
        ctx.moveTo(0, 12);
        ctx.lineTo(15, -12);
        ctx.lineTo(0, -5);
        ctx.lineTo(-15, -12);
      }
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();

      ctx.fillStyle = "red";
      ctx.fillRect(e.x, floatY - 10, e.w, 3);
      ctx.fillStyle = "#0f0";
      ctx.fillRect(e.x, floatY - 10, e.w * (e.hp / e.maxHp), 3);
    });

    s.hazards.forEach(h => {
      ctx.save();
      ctx.translate(h.x + h.w / 2, h.y + h.h / 2);
      ctx.rotate(h.angle);

      if (h.type === 'LASER') {
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        if (h.shape === 1) ctx.arc(0, 0, h.w / 2, 0, Math.PI * 2);
        else ctx.rect(-h.w / 2, -h.h / 2, h.w, h.h);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, h.w / 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = h.color || '#a8a29e';
        ctx.shadowColor = h.color || "#ffffff";
        ctx.shadowBlur = 15;

        ctx.beginPath();
        const sides = 6;
        const r = h.w / 2;
        ctx.moveTo(r, 0);
        for (let i = 1; i <= sides; i++) {
          const theta = i * 2 * Math.PI / sides;
          const rad = r * (0.7 + 0.3 * Math.sin(i * 5 + h.angle));
          ctx.lineTo(rad * Math.cos(theta), rad * Math.sin(theta));
        }
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.restore();
    });

    // --- BULLETS (OPTIMIZED) ---
    if (s.bullets.length > 0) {
      ctx.fillStyle = "#60a5fa";
      ctx.shadowColor = "#60a5fa";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      s.bullets.forEach(b => {
        ctx.moveTo(b.x + 4, b.y);
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
      });
      ctx.fill();

      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#60a5fa";
      ctx.beginPath();
      s.bullets.forEach(b => {
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x, b.y + 12);
      });
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }

    s.collectibles.forEach(c => {
      if (!c.active) return;
      const floatY = c.y + Math.sin(s.gameTime + c.osc) * 5;
      const booster = BOOSTERS[c.boosterId];

      ctx.save();
      ctx.translate(c.x, floatY);
      ctx.rotate(s.gameTime * 3);

      ctx.fillStyle = booster.color;
      ctx.shadowColor = booster.color;
      ctx.shadowBlur = 20;

      ctx.beginPath();

      if (c.boosterId === 4) {
        ctx.font = "20px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("◎", 0, 2);
      }
      else if (c.boosterId === 0) ctx.arc(0, 0, c.r, 0, Math.PI * 2);
      else if (c.boosterId === 1) ctx.rect(-c.r / 2, -c.r / 2, c.r, c.r);
      else if (c.boosterId === 2) {
        ctx.moveTo(0, -c.r); ctx.lineTo(c.r, c.r); ctx.lineTo(-c.r, c.r);
      } else {
        const spikes = 5;
        const outer = c.r; const inner = c.r / 2;
        for (let i = 0; i < spikes * 2; i++) {
          const r = i % 2 === 0 ? outer : inner; const a = (Math.PI / spikes) * i;
          ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
      }

      ctx.fill();
      ctx.restore();
    });

    if (s.player.vy < 0 || isBossLevel) {
      s.player.trail.push({ x: s.player.x, y: s.player.y, age: 0.6 });
    }
    s.player.trail.forEach((t, i) => {
      t.age -= 0.08;
      if (t.age <= 0) {
        s.player.trail.splice(i, 1);
        return;
      }
      ctx.globalAlpha = t.age * 0.4;
      ctx.fillStyle = s.char.color;
      ctx.beginPath();
      ctx.roundRect(t.x, t.y, s.player.w, s.player.h, 4);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // --- PLAYER DRAWING ---
    const px = s.player.x + s.player.w / 2;
    const py = s.player.y + s.player.h / 2;

    // Magnet Aura
    if (s.magnetTimer > 0) {
      ctx.save();
      ctx.translate(px, py);
      ctx.beginPath();
      ctx.globalAlpha = 0.2 + Math.sin(s.gameTime * 5) * 0.1;
      ctx.strokeStyle = "#a855f7";
      ctx.lineWidth = 4;
      ctx.setLineDash([5, 5]);
      ctx.arc(0, 0, s.player.w * 1.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Shield Circle
    if (s.shield > 0) {
      ctx.save();
      ctx.translate(px, py);
      ctx.beginPath();
      ctx.globalAlpha = 0.4;
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2 + s.shield * 2;
      ctx.arc(0, 0, s.player.w * 1.2, 0, Math.PI * 2);
      ctx.stroke();
      // Inner glow
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = "#3b82f6";
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = s.char.color;
    ctx.shadowColor = s.char.color;
    ctx.shadowBlur = 25;

    if (s.gameTime < s.invincibleUntil && Math.floor(s.gameTime) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    const squash = Math.min(Math.abs(s.player.vy) * 0.04, 0.3);
    const scaleX = 1 - squash + (Math.sin(s.gameTime * 20) * 0.05);
    const scaleY = 1 + squash;

    const pw = s.player.w * scaleX;
    const ph = s.player.h * scaleY;

    ctx.translate(px, py);
    ctx.rotate(s.player.vx * 0.1);

    if (isBossLevel) {
      ctx.beginPath();
      ctx.fillStyle = "#ffffff";
      ctx.moveTo(0, -ph);
      ctx.lineTo(pw / 3, -ph / 4);
      ctx.lineTo(pw, ph / 2);
      ctx.lineTo(pw / 3, ph / 2);
      ctx.lineTo(0, ph / 2 + 5);
      ctx.lineTo(-pw / 3, ph / 2);
      ctx.lineTo(-pw, ph / 2);
      ctx.lineTo(-pw / 3, -ph / 4);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.ellipse(0, -ph / 4, pw / 6, ph / 6, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      if (s.player.type === 0) ctx.roundRect(-pw / 2, -ph / 2, pw, ph, 6);
      else if (s.player.type === 1) ctx.arc(0, 0, pw / 2, 0, Math.PI * 2);
      else if (s.player.type === 2) { ctx.moveTo(0, -ph / 2); ctx.lineTo(pw / 2, ph / 2); ctx.lineTo(-pw / 2, ph / 2); }
      else ctx.arc(0, 0, pw / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.shadowBlur = 0;
      const eyeOff = s.player.vx * 1.5;
      ctx.beginPath();
      const eyeY = -2;
      ctx.ellipse(-5 + eyeOff, eyeY, 4, 5, 0, 0, Math.PI * 2);
      ctx.ellipse(5 + eyeOff, eyeY, 4, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.arc(-5 + eyeOff, eyeY, 1.5, 0, Math.PI * 2);
      ctx.arc(5 + eyeOff, eyeY, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.rotate(-s.player.vx * 0.1);
    ctx.translate(-px, -py);
    ctx.globalAlpha = 1;

    // --- PARTICLES (OPTIMIZED) ---
    if (s.particles.length > 0) {
      ctx.beginPath();
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.035; // Slightly faster decay
        p.vy += 0.22;

        if (p.life <= 0) {
          s.particles.splice(i, 1);
          continue;
        }

        // Draw batch
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
    }

    // --- FLOATING TEXTS (BATCHED) ---
    if (s.floatingTexts.length > 0) {
      ctx.font = "900 16px 'Courier New', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;

      for (let i = s.floatingTexts.length - 1; i >= 0; i--) {
        const t = s.floatingTexts[i];
        t.y += t.vy;
        t.life -= 0.022;
        if (t.life <= 0) {
          s.floatingTexts.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.scale(t.scale, t.scale);
        ctx.globalAlpha = t.life;
        ctx.fillStyle = t.color;

        ctx.strokeText(t.text, 0, 0);
        ctx.fillText(t.text, 0, 0);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    if (s.damageEffect > 0.01) {
      ctx.fillStyle = `rgba(255, 0, 0, ${s.damageEffect})`;
      ctx.fillRect(0, 0, width, height);
    }
    if (s.flashEffect > 0.01) {
      ctx.fillStyle = `rgba(255, 255, 255, ${s.flashEffect})`;
      ctx.fillRect(0, 0, width, height);
    }

    ctx.restore();

    requestRef.current = requestAnimationFrame(update);
  };

  const loop = useCallback(update, [gameState, level]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      requestRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, loop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') state.current.inputs.left = true;
      if (e.key === 'ArrowRight') state.current.inputs.right = true;
      if (e.key === ' ' && gameState === 'GAMEOVER') initGame();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') state.current.inputs.left = false;
      if (e.key === 'ArrowRight') state.current.inputs.right = false;
    };

    const cvs = canvasRef.current;
    if (!cvs) return;

    const handleInputStart = (clientX: number) => {
      const rect = cvs.getBoundingClientRect();
      state.current.inputs.touching = true;
      state.current.inputs.touchX = (clientX - rect.left) * (cvs.width / rect.width);
      initAudio();
    };
    const handleInputMove = (clientX: number) => {
      const rect = cvs.getBoundingClientRect();
      state.current.inputs.touchX = (clientX - rect.left) * (cvs.width / rect.width);
    };
    const handleInputEnd = () => { state.current.inputs.touching = false; };

    const onTouchStart = (e: TouchEvent) => { e.preventDefault(); handleInputStart(e.touches[0].clientX); };
    const onTouchMove = (e: TouchEvent) => { e.preventDefault(); handleInputMove(e.touches[0].clientX); };
    const onMouseDown = (e: MouseEvent) => { handleInputStart(e.clientX); };
    const onMouseMove = (e: MouseEvent) => { if (state.current.inputs.touching) handleInputMove(e.clientX); };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    cvs.addEventListener('touchstart', onTouchStart, { passive: false });
    cvs.addEventListener('touchmove', onTouchMove, { passive: false });
    cvs.addEventListener('touchend', handleInputEnd);
    cvs.addEventListener('mousedown', onMouseDown);
    cvs.addEventListener('mousemove', onMouseMove);
    cvs.addEventListener('mouseup', handleInputEnd);
    cvs.addEventListener('mouseleave', handleInputEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cvs.removeEventListener('touchstart', onTouchStart);
      cvs.removeEventListener('touchmove', onTouchMove);
      cvs.removeEventListener('touchend', handleInputEnd);
      cvs.removeEventListener('mousedown', onMouseDown);
      cvs.removeEventListener('mousemove', onMouseMove);
      cvs.removeEventListener('mouseup', handleInputEnd);
    };
  }, [gameState]);

  useEffect(() => {
    const resize = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
        if (gameState === 'START') initGame();
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [gameState]);

  const theme = getTheme(level);
  const currentLevelStart = (level - 1) * LEVEL_THRESHOLD;
  const progressPercent = Math.min(100, Math.max(0, ((score - currentLevelStart) / LEVEL_THRESHOLD) * 100));
  const isBossLevel = level % 5 === 0;

  // Render logic for Boss Target kills
  const bossTargetKills = BASE_BOSS_ENEMIES + (Math.floor(level / 5)) - 1;

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden font-mono select-none" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
      <canvas ref={canvasRef} className="block w-full h-full touch-none" style={{ imageRendering: 'pixelated' }} />

      {/* HUD */}
      {gameState === 'PLAYING' && (
        <div className="absolute top-2 left-0 right-0 px-4 pointer-events-none z-10">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] uppercase text-white/50 font-bold tracking-widest">Score</div>
              <div className="text-3xl font-black text-white italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {Math.floor(score)}
              </div>
              {/* Hearts Indicator */}
              <div className="flex mt-1 text-lg">
                {[...Array(hp)].map((_, i) => (
                  <span key={i} className="animate-pulse drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">❤️</span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase text-white/50 font-bold tracking-widest">Theme</div>
              <div className={`text-xs font-bold px-2 py-1 rounded bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg ${level % 5 === 0 ? 'animate-pulse text-red-400 border-red-500' : ''}`}>
                {theme.name}
              </div>
            </div>
          </div>

          {/* Level Progress Meter */}
          {!isBossLevel ? (
            <div className="mt-4">
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden border border-white/10">
                <div
                  className={`h-full bg-gradient-to-r ${level % 5 === 0 ? 'from-red-500 to-yellow-500' : 'from-blue-400 via-purple-400 to-pink-400'} shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-300 ease-out`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-white/60 font-bold mt-1 tracking-wider uppercase">
                <span>Level {level}</span>
                <span>{Math.floor((currentLevelStart + LEVEL_THRESHOLD) - score)} to go</span>
              </div>
            </div>
          ) : (
            // BOSS UI moved to bottom of screen via CSS below
            <></>
          )}
        </div>
      )}

      {/* BOSS UI: Moved to bottom to avoid covering enemies */}
      {gameState === 'PLAYING' && isBossLevel && (
        <div className="absolute bottom-12 left-0 right-0 flex justify-center pointer-events-none z-10">
          <div className="bg-red-950/80 border border-red-500/50 px-4 py-2 rounded-full text-sm font-bold text-red-200 tracking-wider shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-pulse">
            BOSS TARGETS: {bossProgress} / {bossTargetKills}
          </div>
        </div>
      )}

      {/* START SCREEN */}
      {gameState === 'START' && !showShop && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 p-6 text-center backdrop-blur-sm">
          <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-tr from-purple-500 to-pink-500 shadow-[0_0_50px_rgba(236,72,153,0.6)] flex items-center justify-center animate-bounce ring-4 ring-white/10">
            <span className="text-5xl drop-shadow-lg">👾</span>
          </div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 italic tracking-tighter mb-2">
            NEON<br />RISE
          </h1>
          <p className="text-xs text-slate-400 mb-8 max-w-[200px] leading-relaxed">
            Collect <b>Cores</b> and <b>SOL</b> to level up!
            <br />Boss Levels Auto-Fire!
          </p>
          <button
            onClick={() => setGameState('CHARACTER_SELECT')}
            className="w-full max-w-[200px] py-4 bg-white text-black font-black text-xl rounded-full shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all"
          >
            PLAY
          </button>

          <button
            onClick={() => setShowShop(true)}
            className="w-full max-w-[200px] py-2 mt-4 bg-slate-800 text-white font-bold text-sm rounded-full border border-white/20 hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            🛒 SHOP ({lifetimeBits} BITS)
          </button>
        </div>
      )}

      {/* CHARACTER SELECTION */}
      {gameState === 'CHARACTER_SELECT' && (
        <div className="absolute inset-0 z-20 flex flex-col" style={{ background: 'linear-gradient(180deg, #030712 0%, #0f172a 60%, #1e1b4b 100%)' }}>
          {/* Header */}
          <div className="flex-shrink-0 text-center pt-4 pb-2">
            <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500 font-bold mb-1">Cyber Scroll</p>
            <h2 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 tracking-tight">SELECT HERO</h2>
          </div>

          {/* Character Cards */}
          <div className="flex-shrink-0 grid grid-cols-4 gap-2 px-3 mt-2">
            {CHARACTERS.map((char, i) => (
              <button
                key={char.name}
                onClick={() => setSelectedCharIndex(i)}
                className="flex flex-col items-center py-3 px-1 rounded-2xl border-2 transition-all"
                style={{
                  borderColor: selectedCharIndex === i ? char.color : 'rgba(255,255,255,0.08)',
                  background: selectedCharIndex === i ? `${char.color}22` : 'rgba(0,0,0,0.4)',
                  boxShadow: selectedCharIndex === i ? `0 0 18px ${char.color}55` : 'none',
                  transform: selectedCharIndex === i ? 'scale(1.06)' : 'scale(1)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl mb-1 flex items-center justify-center text-2xl"
                  style={{ backgroundColor: char.color, boxShadow: `0 0 12px ${char.color}66` }}
                >
                  {char.icon}
                </div>
                <div className="font-black text-white text-[9px] tracking-widest">{char.name}</div>
              </button>
            ))}
          </div>

          {/* Detail Panel for selected character */}
          {(() => {
            const c = CHARACTERS[selectedCharIndex];
            const maxJump = 20; const maxSpeed = 2.4; const maxHp = 4;
            const barStyle = (val: number, max: number) => ({ width: `${(val / max) * 100}%`, backgroundColor: c.color });
            return (
              <div className="flex-1 overflow-y-auto px-4 mt-3">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: c.color }}>{c.icon}</div>
                    <div>
                      <div className="font-black text-sm" style={{ color: c.color }}>{c.name}</div>
                      <p className="text-[10px] text-slate-400">{c.desc}</p>
                    </div>
                  </div>

                  {/* Stat Bars */}
                  <div className="space-y-2 mb-4">
                    {[
                      { label: 'JUMP', val: c.jump, max: maxJump },
                      { label: 'SPEED', val: c.speed, max: maxSpeed },
                      { label: 'FIRE', val: 1 - c.fire, max: 1 - 0.35 },
                      { label: 'HEALTH', val: c.hp, max: maxHp },
                    ].map(s => (
                      <div key={s.label} className="flex items-center gap-2">
                        <span className="text-[8px] font-black text-slate-400 w-10 uppercase">{s.label}</span>
                        <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={barStyle(s.val, s.max)} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Perk */}
                  <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 flex items-center gap-2">
                    <span className="text-base">🎁</span>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Starting Bonus</p>
                      <p className="text-[11px] font-black" style={{ color: c.color }}>{c.perk}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Footer Buttons */}
          <div className="flex-shrink-0 px-4 pb-5 pt-3 flex flex-col gap-2">
            <button
              onClick={initGame}
              className="w-full py-4 font-black text-xl rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
              style={{ background: `linear-gradient(90deg, ${CHARACTERS[selectedCharIndex].color}, ${CHARACTERS[selectedCharIndex].color}bb)`, color: '#000', boxShadow: `0 0 24px ${CHARACTERS[selectedCharIndex].color}66` }}
            >
              PLAY AS {CHARACTERS[selectedCharIndex].name} {CHARACTERS[selectedCharIndex].icon}
            </button>
            <button
              onClick={() => setShowShop(true)}
              className="w-full py-2 bg-white/5 text-white font-bold text-xs rounded-full border border-white/10 hover:bg-white/10 active:scale-95 transition-all"
            >
              🛒 BIT SHOP ({lifetimeBits} BITS)
            </button>
          </div>
        </div>
      )}

      {/* GAME OVER */}
      {gameState === 'GAMEOVER' && !showShop && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/90 z-20 p-6 text-center animate-in fade-in duration-300">
          <div className="text-6xl mb-4 animate-pulse">💥</div>
          <h2 className="text-4xl font-black text-white mb-1 uppercase italic tracking-wider drop-shadow-xl">Wasted</h2>
          <div className="text-sm font-bold text-red-300 mb-4">{deathQuote}</div>

          <div className="grid grid-cols-2 gap-4 w-full mt-2">
            <div className="bg-black/40 p-4 rounded-2xl border border-white/10">
              <div className="text-[10px] uppercase text-slate-400 font-bold">Score</div>
              <div className="text-2xl font-black text-white">{Math.floor(score)}</div>
            </div>
            <div className="bg-yellow-500/10 p-4 rounded-2xl border border-yellow-500/20">
              <div className="text-[10px] uppercase text-yellow-500 font-bold">Best</div>
              <div className="text-2xl font-black text-yellow-400">{highScore}</div>
            </div>
          </div>

          <button
            onClick={() => setGameState('CHARACTER_SELECT')}
            className="w-full max-w-[200px] py-3 mt-8 bg-white text-black font-black text-lg rounded-full shadow-lg hover:bg-slate-200 active:scale-95 transition-all"
          >
            RETRY
          </button>

          <button
            onClick={() => setShowShop(true)}
            className="w-full max-w-[200px] py-2 mt-4 bg-slate-800 text-white font-bold text-sm rounded-full border border-white/20 hover:bg-slate-700 active:scale-95 transition-all"
          >
            🛒 UPGRADES
          </button>
        </div>
      )}

      {/* SHOP OVERLAY */}
      {showShop && (
        <div className="absolute inset-0 bg-slate-950 z-30 p-6 flex flex-col animate-in slide-in-from-bottom duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black italic text-white tracking-tight">BIT SHOP</h2>
            <button
              onClick={() => setShowShop(false)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
            >
              ✕
            </button>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Bits</span>
            <span className="text-2xl font-black text-yellow-400">{lifetimeBits}</span>
          </div>

          <div className="space-y-4 overflow-y-auto pr-2">
            {/* JUMP UPGRADE */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-white text-sm">JUMP BOOST</h3>
                  <p className="text-[10px] text-slate-400">+5% Jump Height per level</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase">Level</div>
                  <div className="text-white font-bold">{upgrades.jump}/5</div>
                </div>
              </div>
              <button
                disabled={upgrades.jump >= 5}
                onClick={() => buyUpgrade('jump')}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${upgrades.jump >= 5 ? 'bg-slate-800 text-slate-500' : 'bg-blue-600 text-white shadow-lg active:scale-95'}`}
              >
                {upgrades.jump >= 5 ? 'MAX LEVEL' : `UPGRADE (${(upgrades.jump + 1) * 200} BITS)`}
              </button>
            </div>

            {/* FIRE RATE UPGRADE */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-white text-sm">QUICK FIRE</h3>
                  <p className="text-[10px] text-slate-400">-0.05s Shot Delay</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase">Level</div>
                  <div className="text-white font-bold">{upgrades.fireRate}/5</div>
                </div>
              </div>
              <button
                disabled={upgrades.fireRate >= 5}
                onClick={() => buyUpgrade('fireRate')}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${upgrades.fireRate >= 5 ? 'bg-slate-800 text-slate-500' : 'bg-purple-600 text-white shadow-lg active:scale-95'}`}
              >
                {upgrades.fireRate >= 5 ? 'MAX LEVEL' : `UPGRADE (${(upgrades.fireRate + 1) * 150} BITS)`}
              </button>
            </div>

            {/* HEALTH UPGRADE */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-white text-sm">EXTRA ARMOR</h3>
                  <p className="text-[10px] text-slate-400">+1 Initial Heart</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase">Level</div>
                  <div className="text-white font-bold">{upgrades.health}/3</div>
                </div>
              </div>
              <button
                disabled={upgrades.health >= 3}
                onClick={() => buyUpgrade('health')}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${upgrades.health >= 3 ? 'bg-slate-800 text-slate-500' : 'bg-red-600 text-white shadow-lg active:scale-95'}`}
              >
                {upgrades.health >= 3 ? 'MAX LEVEL' : `UPGRADE (${(upgrades.health + 1) * 500} BITS)`}
              </button>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button
              onClick={() => setShowShop(false)}
              className="w-full py-4 bg-white text-black font-black rounded-full"
            >
              DONE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};