
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Shield, Zap, Target, Activity, Play, Pause, DollarSign, Heart, Trophy, RotateCcw, Users, ChevronUp, Trash2, X } from 'lucide-react';
import { TacticalButton } from '../../ui/TacticalButton';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Constants ---

type TowerType = 'PITCHER' | 'INFIELD' | 'OUTFIELD';
type EnemyType = 'ROOKIE' | 'SPEEDSTER' | 'SLUGGER';

interface TowerConfig {
  type: TowerType;
  name: string;
  cost: number;
  range: number; // Percentage of field width
  damage: number;
  cooldown: number; // ms
  color: string;
  projectileColor: string;
  icon: React.ElementType;
  desc: string;
}

const TOWERS: Record<TowerType, TowerConfig> = {
  PITCHER: {
    type: 'PITCHER',
    name: 'The Ace',
    cost: 75,
    range: 22,
    damage: 40,
    cooldown: 900,
    color: 'bg-blue-600 border-blue-400',
    projectileColor: '#3b82f6',
    icon: Zap,
    desc: 'Balanced damage.'
  },
  INFIELD: {
    type: 'INFIELD',
    name: 'Gold Glove',
    cost: 150,
    range: 28,
    damage: 15,
    cooldown: 300, // Rapid fire
    color: 'bg-yellow-600 border-yellow-400',
    projectileColor: '#eab308',
    icon: Shield,
    desc: 'Rapid defense.'
  },
  OUTFIELD: {
    type: 'OUTFIELD',
    name: 'Sniper',
    cost: 250,
    range: 55,
    damage: 120,
    cooldown: 1800, // Slow
    color: 'bg-red-600 border-red-400',
    projectileColor: '#ef4444',
    icon: Target,
    desc: 'Long range.'
  }
};

interface EnemyConfig {
    speed: number;
    hpMultiplier: number;
    color: string;
    radius: number; // Visual size
    reward: number;
}

const ENEMIES: Record<EnemyType, EnemyConfig> = {
    ROOKIE: { speed: 1, hpMultiplier: 1, color: '#94a3b8', radius: 6, reward: 10 }, // Gray
    SPEEDSTER: { speed: 1.8, hpMultiplier: 0.6, color: '#22d3ee', radius: 5, reward: 15 }, // Cyan
    SLUGGER: { speed: 0.6, hpMultiplier: 3.0, color: '#ef4444', radius: 9, reward: 25 }, // Red
};

// --- PATH NODES (Baseball Diamond) ---
const PATH_NODES = [
  { x: 50, y: 90 }, // Home
  { x: 85, y: 50 }, // 1st
  { x: 50, y: 15 }, // 2nd
  { x: 15, y: 50 }, // 3rd
  { x: 50, y: 90 }  // Home (Score)
];

// Calculate segments for constant speed movement
const calculatePathData = () => {
    let totalLength = 0;
    const segments = [];
    
    for (let i = 0; i < PATH_NODES.length - 1; i++) {
        const p1 = PATH_NODES[i];
        const p2 = PATH_NODES[i+1];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len = Math.sqrt(dx*dx + dy*dy);
        
        segments.push({
            start: totalLength,
            end: totalLength + len,
            length: len,
            p1,
            p2
        });
        totalLength += len;
    }
    return { totalLength, segments };
};

const { totalLength: TOTAL_PATH_LEN, segments: PATH_SEGMENTS } = calculatePathData();

interface Enemy {
  id: string;
  type: EnemyType;
  progress: number; // 0 to TOTAL_PATH_LEN
  hp: number;
  maxHp: number;
  speed: number;
  x: number;
  y: number;
  waveIdx: number;
  frozen?: number; // Slow effect timestamp
}

interface ActiveTower {
  id: string;
  type: TowerType;
  x: number;
  y: number;
  lastFired: number;
  angle: number;
  level: number;
  damageDealt: number;
}

interface Projectile {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  timestamp: number;
}

interface Particle {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number; // 0-1
    color: string;
}

interface FloatingText {
    id: string;
    x: number;
    y: number;
    text: string;
    life: number;
    color: string;
}

// --- Game Component ---

interface TowerDefenseGameProps {
  onBack: () => void;
}

export const TowerDefenseGame: React.FC<TowerDefenseGameProps> = ({ onBack }) => {
  // --- State ---
  const [money, setMoney] = useState(200);
  const [lives, setLives] = useState(20);
  const [wave, setWave] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  
  // Selection State
  const [selectedTowerType, setSelectedTowerType] = useState<TowerType | null>(null);
  const [selectedPlacedTowerId, setSelectedPlacedTowerId] = useState<string | null>(null);
  
  const [gameSpeed, setGameSpeed] = useState(1);

  // --- Refs (Game Loop Data) ---
  const enemiesRef = useRef<Enemy[]>([]);
  const towersRef = useRef<ActiveTower[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  
  // Loop Timing
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  
  // Wave Management
  const waveActiveRef = useRef<boolean>(false);
  const enemiesToSpawnRef = useRef<EnemyType[]>([]);
  const spawnTimerRef = useRef<number>(0);
  const waveDelayTimerRef = useRef<number>(0);
  
  // Sync Ref
  const gameSpeedRef = useRef(1);

  // Force Render Trigger (for UI updates that depend on ref changes)
  const [renderTrigger, setRenderTrigger] = useState(0);

  useEffect(() => {
    gameSpeedRef.current = gameSpeed;
  }, [gameSpeed]);

  // --- Core Logic ---

  const getPositionOnPath = (currentDist: number) => {
    const segment = PATH_SEGMENTS.find(s => currentDist >= s.start && currentDist < s.end) || PATH_SEGMENTS[PATH_SEGMENTS.length - 1];
    const segmentProgress = (currentDist - segment.start) / segment.length;
    return {
        x: segment.p1.x + (segment.p2.x - segment.p1.x) * segmentProgress,
        y: segment.p1.y + (segment.p2.y - segment.p1.y) * segmentProgress
    };
  };

  const startGame = () => {
    setMoney(250);
    setLives(20);
    setWave(1);
    setGameOver(false);
    setGameWon(false);
    setHasStarted(true);
    enemiesRef.current = [];
    towersRef.current = [];
    projectilesRef.current = [];
    particlesRef.current = [];
    floatingTextsRef.current = [];
    waveActiveRef.current = false;
    waveDelayTimerRef.current = 0;
    
    startWave(1);
    setIsPlaying(true);
  };

  const startWave = (waveNum: number) => {
    waveActiveRef.current = true;
    
    // Build Wave Composition
    const count = 5 + Math.floor(waveNum * 1.5);
    const composition: EnemyType[] = [];
    
    for (let i = 0; i < count; i++) {
        if (waveNum % 3 === 0 && i % 3 === 0) {
            composition.push('SLUGGER');
        } else if (waveNum % 2 === 0 && i % 2 === 0) {
            composition.push('SPEEDSTER');
        } else {
            composition.push('ROOKIE');
        }
    }
    
    enemiesToSpawnRef.current = composition;
    spawnTimerRef.current = 0;
  };

  const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicking empty space
    if (selectedPlacedTowerId) {
        setSelectedPlacedTowerId(null); // Deselect tower
        return;
    }

    if (!selectedTowerType || gameOver) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Check Collision
    const collision = [...PATH_NODES, ...towersRef.current].some((obj: any) => {
        const ox = obj.x !== undefined ? obj.x : obj.x;
        const oy = obj.y !== undefined ? obj.y : obj.y;
        const dist = Math.sqrt(Math.pow(ox - x, 2) + Math.pow(oy - y, 2));
        return dist < 7; // Radius check
    });
    if (collision) return;

    const config = TOWERS[selectedTowerType];
    if (money < config.cost) return;

    setMoney(prev => prev - config.cost);
    towersRef.current.push({
      id: `t-${Date.now()}`,
      type: selectedTowerType,
      x,
      y,
      lastFired: 0,
      angle: 0,
      level: 1,
      damageDealt: 0
    });
    setSelectedTowerType(null);
    setRenderTrigger(prev => prev + 1);
  };

  const handleTowerClick = (e: React.MouseEvent, towerId: string) => {
      e.stopPropagation();
      if (selectedTowerType) {
          setSelectedTowerType(null); // Cancel placement if clicking tower
      }
      setSelectedPlacedTowerId(towerId);
  };

  const upgradeTower = () => {
      if (!selectedPlacedTowerId) return;
      const tower = towersRef.current.find(t => t.id === selectedPlacedTowerId);
      if (!tower) return;

      const config = TOWERS[tower.type];
      const cost = Math.floor(config.cost * 0.8 * tower.level);

      if (money >= cost) {
          setMoney(prev => prev - cost);
          tower.level += 1;
          setRenderTrigger(prev => prev + 1);
          
          // Spawn visual text
          floatingTextsRef.current.push({
              id: `ft-${Date.now()}`,
              x: tower.x,
              y: tower.y - 5,
              text: "LEVEL UP!",
              life: 1.0,
              color: '#fbbf24'
          });
      }
  };

  const sellTower = () => {
      if (!selectedPlacedTowerId) return;
      const towerIdx = towersRef.current.findIndex(t => t.id === selectedPlacedTowerId);
      if (towerIdx === -1) return;

      const tower = towersRef.current[towerIdx];
      const config = TOWERS[tower.type];
      // Refund 50% of base + 50% of upgrades estimate
      const refund = Math.floor((config.cost * 0.5) + (config.cost * 0.4 * (tower.level - 1)));
      
      setMoney(prev => prev + refund);
      towersRef.current.splice(towerIdx, 1);
      setSelectedPlacedTowerId(null);
      
      // Particle effect
      for(let i=0; i<10; i++) {
          particlesRef.current.push({
              id: `part-${Date.now()}-${i}`,
              x: tower.x,
              y: tower.y,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2,
              life: 1.0,
              color: '#94a3b8'
          });
      }
  };

  // --- Game Loop ---

  useEffect(() => {
    const loop = (time: number) => {
      if (!isPlaying || gameOver || gameWon) {
        frameRef.current = requestAnimationFrame(loop);
        lastTimeRef.current = time;
        return;
      }

      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;
      
      if (deltaTime > 100) return; // Pause catch-up

      const speedMultiplier = gameSpeedRef.current;
      const effectiveDelta = deltaTime * speedMultiplier;

      // 1. Wave Spawning
      if (waveActiveRef.current) {
          if (enemiesToSpawnRef.current.length > 0) {
              if (time - spawnTimerRef.current > (800 / speedMultiplier)) {
                  const type = enemiesToSpawnRef.current.shift()!;
                  const config = ENEMIES[type];
                  const baseHp = 80 + (wave * 30);
                  
                  enemiesRef.current.push({
                      id: `e-${Date.now()}-${Math.random()}`,
                      type,
                      progress: 0,
                      hp: baseHp * config.hpMultiplier,
                      maxHp: baseHp * config.hpMultiplier,
                      speed: (12 * config.speed) + (wave * 0.5),
                      x: PATH_NODES[0].x,
                      y: PATH_NODES[0].y,
                      waveIdx: wave
                  });
                  spawnTimerRef.current = time;
              }
          } else if (enemiesRef.current.length === 0) {
              waveActiveRef.current = false;
              waveDelayTimerRef.current = time;
          }
      } else {
          if (time - waveDelayTimerRef.current > (3000 / speedMultiplier)) {
              if (wave < 15) {
                  setWave(w => {
                      const next = w + 1;
                      startWave(next);
                      return next;
                  });
              } else {
                  setGameWon(true);
              }
          }
      }

      // 2. Update Entities
      
      // Enemies
      let livesLost = 0;
      enemiesRef.current = enemiesRef.current.filter(enemy => {
          enemy.progress += (enemy.speed * (effectiveDelta / 1000));
          if (enemy.progress >= TOTAL_PATH_LEN) {
              livesLost++;
              return false;
          }
          const pos = getPositionOnPath(enemy.progress);
          enemy.x = pos.x;
          enemy.y = pos.y;
          return true;
      });

      if (livesLost > 0) {
          setLives(prev => {
              const next = prev - livesLost;
              if (next <= 0) {
                  setGameOver(true);
                  setIsPlaying(false);
              }
              return next;
          });
      }

      // Towers
      towersRef.current.forEach(tower => {
          const config = TOWERS[tower.type];
          // Level Scaling: +20% damage, +5% range per level
          const currentDamage = config.damage * (1 + ((tower.level - 1) * 0.2));
          const currentRange = config.range * (1 + ((tower.level - 1) * 0.05));
          const currentCooldown = config.cooldown * (Math.pow(0.9, tower.level - 1)); // 10% faster fire rate per level

          if (time - tower.lastFired > (currentCooldown / speedMultiplier)) {
              const target = enemiesRef.current.find(e => {
                  const dist = Math.sqrt(Math.pow(e.x - tower.x, 2) + Math.pow(e.y - tower.y, 2));
                  return dist <= currentRange;
              });

              if (target) {
                  tower.lastFired = time;
                  tower.angle = Math.atan2(target.y - tower.y, target.x - tower.x) * (180 / Math.PI);
                  
                  target.hp -= currentDamage;
                  tower.damageDealt += currentDamage;

                  // Projectile Visual
                  projectilesRef.current.push({
                      id: `p-${Date.now()}-${Math.random()}`,
                      startX: tower.x,
                      startY: tower.y,
                      endX: target.x,
                      endY: target.y,
                      color: config.projectileColor,
                      timestamp: time
                  });

                  // Hit Particles
                  for(let i=0; i<3; i++) {
                      particlesRef.current.push({
                          id: `pt-${Date.now()}-${Math.random()}`,
                          x: target.x,
                          y: target.y,
                          vx: (Math.random() - 0.5) * 2,
                          vy: (Math.random() - 0.5) * 2,
                          life: 1.0,
                          color: config.projectileColor
                      });
                  }

                  // Kill?
                  if (target.hp <= 0) {
                      setMoney(m => m + ENEMIES[target.type].reward);
                      // Explosion
                      for(let i=0; i<8; i++) {
                        particlesRef.current.push({
                            id: `ex-${Date.now()}-${Math.random()}`,
                            x: target.x,
                            y: target.y,
                            vx: (Math.random() - 0.5) * 4,
                            vy: (Math.random() - 0.5) * 4,
                            life: 1.5,
                            color: ENEMIES[target.type].color
                        });
                      }
                      // Float Text
                      floatingTextsRef.current.push({
                          id: `ft-${Date.now()}-${Math.random()}`,
                          x: target.x,
                          y: target.y,
                          text: `+$${ENEMIES[target.type].reward}`,
                          life: 1.0,
                          color: '#4ade80'
                      });
                      
                      enemiesRef.current = enemiesRef.current.filter(e => e.id !== target.id);
                  }
              }
          }
      });

      // Cleanup Visuals
      projectilesRef.current = projectilesRef.current.filter(p => time - p.timestamp < (100 / speedMultiplier));
      
      particlesRef.current.forEach(p => {
          p.x += p.vx * (effectiveDelta / 50);
          p.y += p.vy * (effectiveDelta / 50);
          p.life -= (effectiveDelta / 500);
      });
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);

      floatingTextsRef.current.forEach(t => {
          t.y -= (0.5 * (effectiveDelta / 50)); // Float up
          t.life -= (effectiveDelta / 1000);
      });
      floatingTextsRef.current = floatingTextsRef.current.filter(t => t.life > 0);

      setRenderTrigger(time);
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isPlaying, gameOver, gameWon, wave]);


  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-slate-900 rounded-3xl overflow-hidden relative shadow-2xl border-4 border-slate-800">
      
      {/* --- HUD --- */}
      <div className="bg-slate-800 p-3 flex justify-between items-center border-b-2 border-slate-700 z-10">
          <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 rounded-xl bg-slate-700 text-gray-400 hover:text-white transition-colors">
                  <ArrowLeft size={20} />
              </button>
              
              <div className="flex gap-2">
                  <div className="bg-slate-900 border border-slate-700 px-3 py-1 rounded flex flex-col items-center min-w-[60px]">
                      <span className="text-[9px] text-gray-500 uppercase font-bold">Wave</span>
                      <span className="text-white font-mono font-bold">{wave}</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-700 px-3 py-1 rounded flex flex-col items-center min-w-[60px]">
                      <span className="text-[9px] text-gray-500 uppercase font-bold">Lives</span>
                      <span className="text-white font-mono font-bold flex items-center gap-1">
                          <Heart size={12} className="text-red-500" fill="currentColor" /> {lives}
                      </span>
                  </div>
                  <div className="bg-slate-900 border border-slate-700 px-3 py-1 rounded flex flex-col items-center min-w-[80px]">
                      <span className="text-[9px] text-gray-500 uppercase font-bold">Budget</span>
                      <span className="text-green-400 font-mono font-bold flex items-center gap-1">
                          <DollarSign size={12} /> {money}
                      </span>
                  </div>
              </div>
          </div>

          <div className="flex gap-2">
              {[1, 2, 4].map(speed => (
                  <button 
                    key={speed}
                    onClick={() => setGameSpeed(speed)}
                    className={`px-2 py-1 rounded text-xs font-bold ${gameSpeed === speed ? 'bg-blue-600 text-white' : 'bg-slate-700 text-gray-400'}`}
                  >
                      {speed}x
                  </button>
              ))}
              <button 
                onClick={hasStarted ? () => setIsPlaying(!isPlaying) : startGame}
                className={`px-4 py-1 rounded text-xs font-bold uppercase flex items-center gap-2 ${hasStarted ? 'bg-slate-700 text-white' : 'bg-green-600 text-white'}`}
              >
                  {hasStarted ? (isPlaying ? <Pause size={14}/> : <Play size={14}/>) : <Play size={14}/>}
              </button>
          </div>
      </div>

      {/* --- GAME BOARD --- */}
      <div className="flex-1 relative bg-[#0B1120] overflow-hidden select-none cursor-crosshair" onClick={handleBoardClick}>
          
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-10" 
               style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
          </div>

          <div className="absolute inset-4 md:inset-12 border-2 border-slate-700 rounded-3xl bg-slate-900/50 relative">
              
              {/* Bases Visuals */}
              <div className="absolute left-[50%] top-[90%] w-6 h-6 bg-white transform -translate-x-1/2 -translate-y-1/2 clip-home-plate z-10 shadow-lg" /> {/* Home */}
              <div className="absolute left-[85%] top-[50%] w-6 h-6 bg-white transform -translate-x-1/2 -translate-y-1/2 rotate-45 z-10 border border-gray-300 shadow-lg" /> {/* 1st */}
              <div className="absolute left-[50%] top-[15%] w-6 h-6 bg-white transform -translate-x-1/2 -translate-y-1/2 rotate-45 z-10 border border-gray-300 shadow-lg" /> {/* 2nd */}
              <div className="absolute left-[15%] top-[50%] w-6 h-6 bg-white transform -translate-x-1/2 -translate-y-1/2 rotate-45 z-10 border border-gray-300 shadow-lg" /> {/* 3rd */}
              <style>{`.clip-home-plate { clip-path: polygon(50% 0, 100% 50%, 100% 100%, 0 100%, 0 50%); }`}</style>

              {/* 1. PATH */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <polyline 
                    points={PATH_NODES.map(p => `${p.x}%,${p.y}%`).join(' ')}
                    fill="none"
                    className="stroke-cyan-900"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <motion.polyline
                    points={PATH_NODES.map(p => `${p.x}%,${p.y}%`).join(' ')}
                    fill="none"
                    className="stroke-cyan-500/30"
                    strokeWidth="2"
                    strokeDasharray="10 10"
                    animate={{ strokeDashoffset: -20 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
              </svg>

              {/* Range Indicator (Placement/Selection) */}
              {(selectedTowerType || selectedPlacedTowerId) && (
                  (() => {
                      let x, y, r;
                      if (selectedPlacedTowerId) {
                          const t = towersRef.current.find(t => t.id === selectedPlacedTowerId);
                          if (!t) return null;
                          x = t.x; y = t.y;
                          const config = TOWERS[t.type];
                          r = config.range * (1 + ((t.level - 1) * 0.05));
                      } else {
                          // Placement mouse follow would require mouse tracking state, 
                          // skipping for simplicity in this update, only showing selected tower ranges
                          return null;
                      }
                      
                      // Approximate visual radius in % based on aspect ratio (assuming 16:9ish)
                      // This is a visual approximation
                      return (
                          <div 
                            className="absolute border-2 border-white/30 bg-white/5 rounded-full pointer-events-none z-0 animate-pulse"
                            style={{
                                left: `${x}%`, top: `${y}%`,
                                width: `${r * 2}%`, height: `${r * 3.5}%`, // Aspect correction
                                transform: 'translate(-50%, -50%)'
                            }}
                          />
                      );
                  })()
              )}

              {/* 2. ENTITIES */}
              {enemiesRef.current.map(enemy => (
                  <div
                    key={enemy.id}
                    className="absolute z-20 transition-transform"
                    style={{ 
                        left: `${enemy.x}%`, top: `${enemy.y}%`,
                        width: `${ENEMIES[enemy.type].radius * 0.3}rem`,
                        height: `${ENEMIES[enemy.type].radius * 0.3}rem`,
                        transform: 'translate(-50%, -50%)'
                    }}
                  >
                      <div className="w-full h-full rounded-full border border-white shadow-sm relative" style={{ backgroundColor: ENEMIES[enemy.type].color }}>
                          {/* Health Bar */}
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-1 bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full bg-green-500" style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }} />
                          </div>
                      </div>
                  </div>
              ))}

              {towersRef.current.map(tower => {
                  const config = TOWERS[tower.type];
                  const isSelected = selectedPlacedTowerId === tower.id;
                  return (
                      <div 
                        key={tower.id}
                        onClick={(e) => handleTowerClick(e, tower.id)}
                        className={`absolute w-8 h-8 md:w-10 md:h-10 rounded-full border-2 shadow-lg z-30 flex items-center justify-center cursor-pointer transition-transform hover:scale-110
                            ${config.color} ${isSelected ? 'ring-4 ring-white z-40' : 'border-white'}
                        `}
                        style={{ 
                            left: `${tower.x}%`, top: `${tower.y}%`,
                            transform: `translate(-50%, -50%) rotate(${tower.angle}deg)`
                        }}
                      >
                          <config.icon size={18} className="text-white transform -rotate-90" /> {/* Rotate icon to point right initially */}
                          
                          {/* Level Badge */}
                          {tower.level > 1 && (
                              <div className="absolute -top-2 -right-2 bg-black text-yellow-400 text-[8px] font-black px-1.5 rounded-full border border-yellow-400 z-50 transform rotate-[-${tower.angle}deg]">
                                  {tower.level}
                              </div>
                          )}
                      </div>
                  );
              })}

              {/* Particles */}
              {particlesRef.current.map(p => (
                  <div 
                    key={p.id}
                    className="absolute w-1 h-1 rounded-full pointer-events-none z-30"
                    style={{ 
                        left: `${p.x}%`, top: `${p.y}%`,
                        backgroundColor: p.color,
                        opacity: p.life,
                        transform: 'translate(-50%, -50%)'
                    }}
                  />
              ))}

              {/* Floating Text */}
              {floatingTextsRef.current.map(t => (
                  <div 
                    key={t.id}
                    className="absolute pointer-events-none z-50 text-xs font-black"
                    style={{ 
                        left: `${t.x}%`, top: `${t.y}%`,
                        color: t.color,
                        opacity: t.life,
                        transform: 'translate(-50%, -50%)',
                        textShadow: '0 1px 2px black'
                    }}
                  >
                      {t.text}
                  </div>
              ))}

              {/* Projectiles */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
                  {projectilesRef.current.map(p => (
                      <line 
                        key={p.id}
                        x1={`${p.startX}%`} y1={`${p.startY}%`}
                        x2={`${p.endX}%`} y2={`${p.endY}%`}
                        stroke={p.color}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                  ))}
              </svg>

          </div>

          {/* Overlays */}
          <AnimatePresence>
              {(!isPlaying || gameOver || gameWon) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                  >
                      <div className="bg-slate-800 p-8 rounded-2xl border-2 border-slate-600 text-center max-w-sm w-full shadow-2xl">
                          {gameWon ? (
                              <>
                                  <Trophy size={48} className="mx-auto text-yellow-400 mb-4" />
                                  <h2 className="text-2xl font-black text-white uppercase mb-2">Field Secure</h2>
                                  <TacticalButton fullWidth onClick={startGame}>Redeploy</TacticalButton>
                              </>
                          ) : gameOver ? (
                              <>
                                  <Activity size={48} className="mx-auto text-red-500 mb-4" />
                                  <h2 className="text-2xl font-black text-white uppercase mb-2">Mission Failed</h2>
                                  <TacticalButton fullWidth onClick={startGame}>Retry</TacticalButton>
                              </>
                          ) : !hasStarted ? (
                              <>
                                  <Shield size={48} className="mx-auto text-blue-500 mb-4" />
                                  <h2 className="text-2xl font-black text-white uppercase mb-2">Tower Defense</h2>
                                  <p className="text-gray-400 text-sm mb-6">
                                      Defend against Rookies, Speedsters, and Sluggers.
                                  </p>
                                  <TacticalButton fullWidth onClick={startGame} icon={<Play size={18} />}>Initialize</TacticalButton>
                              </>
                          ) : (
                              <>
                                  <Pause size={48} className="mx-auto text-gray-400 mb-4" />
                                  <h2 className="text-2xl font-black text-white uppercase mb-6">Paused</h2>
                                  <div className="flex gap-3">
                                      <TacticalButton fullWidth variant="secondary" onClick={startGame} icon={<RotateCcw size={18} />}>Restart</TacticalButton>
                                      <TacticalButton fullWidth onClick={() => setIsPlaying(true)} icon={<Play size={18} />}>Resume</TacticalButton>
                                  </div>
                              </>
                          )}
                      </div>
                  </motion.div>
              )}
          </AnimatePresence>

      </div>

      {/* --- FOOTER (Selection / Upgrade) --- */}
      <div className="bg-slate-800 p-4 border-t-2 border-slate-700 z-40 h-32 flex items-center justify-center">
          {selectedPlacedTowerId ? (
              /* Upgrade Menu */
              (() => {
                  const tower = towersRef.current.find(t => t.id === selectedPlacedTowerId);
                  if (!tower) return null;
                  const config = TOWERS[tower.type];
                  const upgradeCost = Math.floor(config.cost * 0.8 * tower.level);
                  const sellValue = Math.floor((config.cost * 0.5) + (config.cost * 0.4 * (tower.level - 1)));

                  return (
                      <div className="flex items-center gap-6 animate-in fade-in slide-in-from-bottom-4 w-full max-w-lg justify-between">
                          <div className="flex items-center gap-4">
                              <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 border-white shadow-lg ${config.color}`}>
                                  <config.icon size={24} className="text-white" />
                              </div>
                              <div>
                                  <div className="text-white font-black uppercase text-lg">{config.name}</div>
                                  <div className="text-xs font-mono text-yellow-400 font-bold">LVL {tower.level}</div>
                                  <div className="text-[10px] text-gray-400 mt-1">DMG: {Math.round(tower.damageDealt)}</div>
                              </div>
                          </div>

                          <div className="flex gap-3">
                              <button 
                                onClick={sellTower}
                                className="flex flex-col items-center justify-center bg-red-900/50 border border-red-700 rounded-xl p-2 px-4 hover:bg-red-900 transition-colors text-red-200"
                              >
                                  <span className="text-xs font-bold uppercase mb-1">Sell</span>
                                  <span className="text-sm font-mono font-black flex items-center gap-1">
                                      <DollarSign size={12} /> {sellValue}
                                  </span>
                              </button>

                              <button 
                                onClick={upgradeTower}
                                disabled={money < upgradeCost}
                                className={`flex flex-col items-center justify-center border rounded-xl p-2 px-4 transition-all min-w-[100px] ${
                                    money >= upgradeCost 
                                    ? 'bg-green-900/50 border-green-500 text-green-100 hover:bg-green-800' 
                                    : 'bg-slate-700 border-slate-600 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                  <span className="text-xs font-bold uppercase mb-1 flex items-center gap-1">
                                      <ChevronUp size={12} /> Upgrade
                                  </span>
                                  <span className="text-sm font-mono font-black flex items-center gap-1">
                                      <DollarSign size={12} /> {upgradeCost}
                                  </span>
                              </button>
                              
                              <button onClick={() => setSelectedPlacedTowerId(null)} className="p-2 text-gray-500 hover:text-white">
                                  <X size={24} />
                              </button>
                          </div>
                      </div>
                  );
              })()
          ) : (
              /* Build Menu */
              <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                  {Object.values(TOWERS).map(tower => (
                      <button
                        key={tower.type}
                        onClick={() => setSelectedTowerType(tower.type)}
                        disabled={money < tower.cost}
                        className={`
                            flex flex-col items-center p-2 rounded-xl border-2 transition-all
                            ${selectedTowerType === tower.type ? 'bg-slate-700 border-white ring-2 ring-blue-400' : 'bg-slate-700 border-slate-600 hover:border-slate-500'}
                            ${money < tower.cost ? 'opacity-50 grayscale cursor-not-allowed' : ''}
                        `}
                      >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mb-1 ${tower.color}`}>
                              <tower.icon size={16} />
                          </div>
                          <div className="text-[10px] font-black text-white uppercase">{tower.name}</div>
                          <div className="text-[10px] font-mono text-yellow-400 font-bold">${tower.cost}</div>
                      </button>
                  ))}
              </div>
          )}
      </div>

    </div>
  );
};
