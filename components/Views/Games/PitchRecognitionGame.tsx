
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Eye, Target, Activity, Trophy, Play, Pause, RotateCcw, Check, X as XIcon, Zap, Wind, CircleDot } from 'lucide-react';
import { TacticalButton } from '../../ui/TacticalButton';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Constants ---

type PitchType = '4-Seam' | 'Curveball' | 'Slider' | 'Changeup';

interface PitchConfig {
  type: PitchType;
  speedMs: number; // Flight duration
  breakX: number; // Horizontal break (percent of screen width, relative to center)
  breakY: number; // Vertical drop (percent of screen height)
  spinRate: number; // Animation duration in seconds
  spinDirection: 'back' | 'top' | 'side' | 'tumble';
  velocity: string;
}

const PITCH_TYPES: PitchConfig[] = [
  { 
    type: '4-Seam', 
    speedMs: 600, 
    breakX: 0, 
    breakY: 5, 
    spinRate: 0.1, 
    spinDirection: 'back',
    velocity: '96 MPH'
  },
  { 
    type: 'Curveball', 
    speedMs: 900, 
    breakX: 5, 
    breakY: 35, 
    spinRate: 0.15, 
    spinDirection: 'top',
    velocity: '78 MPH'
  },
  { 
    type: 'Slider', 
    speedMs: 750, 
    breakX: -15, 
    breakY: 15, 
    spinRate: 0.12, 
    spinDirection: 'side',
    velocity: '85 MPH'
  },
  { 
    type: 'Changeup', 
    speedMs: 850, 
    breakX: -5, 
    breakY: 20, 
    spinRate: 0.25, 
    spinDirection: 'tumble',
    velocity: '83 MPH'
  }
];

interface PitchResult {
  actual: PitchConfig;
  guess: PitchType | null;
  score: number;
  reactionTime: number;
}

// --- Component ---

interface PitchRecognitionGameProps {
  onBack: () => void;
}

export const PitchRecognitionGame: React.FC<PitchRecognitionGameProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<'intro' | 'ready' | 'pitching' | 'feedback' | 'summary'>('intro');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [pitchesLeft, setPitchesLeft] = useState(10);
  const [currentPitch, setCurrentPitch] = useState<PitchConfig | null>(null);
  const [lastResult, setLastResult] = useState<PitchResult | null>(null);
  
  // Ball Physics State
  const [ballState, setBallState] = useState({ x: 50, y: 40, scale: 0.02, opacity: 0, rotation: 0 });
  
  // Refs for animation loop
  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setPitchesLeft(10);
    setGameState('ready');
    setLastResult(null);
  };

  const throwPitch = () => {
    if (pitchesLeft <= 0) return;
    
    // 1. Select Random Pitch with Variations
    const template = PITCH_TYPES[Math.floor(Math.random() * PITCH_TYPES.length)];
    const randomX = (Math.random() * 6) - 3; // +/- 3% location variance
    const randomY = (Math.random() * 6) - 3;
    
    const pitch: PitchConfig = {
        ...template,
        breakX: template.breakX + randomX,
        breakY: template.breakY + randomY,
        speedMs: template.speedMs * (0.95 + Math.random() * 0.1) // +/- 5% speed var
    };

    setCurrentPitch(pitch);
    setGameState('pitching');
    startTimeRef.current = performance.now();

    // Start Animation Loop
    const animate = (time: number) => {
        const elapsed = time - startTimeRef.current;
        const progress = Math.min(elapsed / pitch.speedMs, 1);
        
        // Trajectory Calculation
        
        // Easing for depth (Exponential for "coming at you")
        const depthEase = Math.pow(progress, 3); 
        const scale = 0.02 + (0.98 * depthEase); // Start tiny (2%), end full size (100%)
        
        // Y Movement (Height): 
        // Start: 40% (Release Point) -> End: 50% + Break
        // Gravity effect increases non-linearly
        const startY = 40;
        const endY = 50 + pitch.breakY;
        const currentY = startY + (endY - startY) * Math.pow(progress, 1.8); 
        
        // X Movement (Horizontal): 
        // Start: 50% (Center Mound) -> End: 50% + Break
        const startX = 50;
        const endX = 50 + pitch.breakX;
        const currentX = startX + (endX - startX) * Math.pow(progress, 1.5);

        setBallState({
            x: currentX,
            y: currentY,
            scale: scale,
            opacity: 1,
            rotation: elapsed // Used for spin calculation in render
        });

        if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate);
        } else {
            // Pitch crossed plate - Auto Fail if no guess
            handleGuess(null); 
        }
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleGuess = (guess: PitchType | null) => {
    if (gameState !== 'pitching') return;
    cancelAnimationFrame(animationRef.current!);
    
    if (!currentPitch) return;

    const isCorrect = guess === currentPitch.type;
    const points = isCorrect ? 100 + (streak * 50) : 0;
    
    const result: PitchResult = {
        actual: currentPitch,
        guess: guess,
        reactionTime: (performance.now() - startTimeRef.current) / 1000,
        score: points
    };

    setLastResult(result);
    setScore(s => s + points);
    setStreak(s => isCorrect ? s + 1 : 0);
    setPitchesLeft(p => p - 1);
    setGameState('feedback');

    // Auto advance
    setTimeout(() => {
        if (pitchesLeft <= 1) {
            setGameState('summary');
        } else {
             setBallState(prev => ({ ...prev, opacity: 0 })); // Hide ball
             setGameState('ready');
        }
    }, 2500);
  };

  // Render Helper: Spin Animation
  const getSpinStyle = (pitch: PitchConfig | null) => {
      if (!pitch) return {};
      
      // CSS Animation Keyframes are simulated here via Framer Motion in the JSX
      // But we determine direction
      switch(pitch.spinDirection) {
          case 'back': return { rotateX: -360 };
          case 'top': return { rotateX: 360 };
          case 'side': return { rotateZ: -360 };
          case 'tumble': return { rotateX: 180, rotateZ: 180 };
          default: return {};
      }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-gray-900 rounded-3xl overflow-hidden relative shadow-2xl border-4 border-duo-gray-800">
      
      {/* --- HEADER HUD --- */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent h-32 pointer-events-none">
          <div className="pointer-events-auto">
              <button onClick={onBack} className="p-2 bg-black/40 backdrop-blur-md rounded-xl hover:bg-white/20 text-white transition-colors border border-white/10">
                  <ArrowLeft size={20} />
              </button>
          </div>

          {/* Digital Scoreboard */}
          <div className="flex flex-col items-center">
              <div className="bg-black/80 border-2 border-gray-700 rounded-lg px-6 py-2 shadow-[0_0_15px_rgba(0,0,0,0.8)] flex items-center gap-6 backdrop-blur-sm">
                  <div className="text-center">
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Score</div>
                      <div className="text-2xl font-mono font-black text-duo-yellow leading-none drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">
                          {score.toString().padStart(4, '0')}
                      </div>
                  </div>
                  <div className="h-8 w-px bg-gray-700"></div>
                  <div className="text-center">
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Streak</div>
                      <div className="flex justify-center gap-1">
                          {[...Array(3)].map((_, i) => (
                              <div key={i} className={`w-2 h-2 rounded-full ${i < streak ? 'bg-duo-green shadow-[0_0_5px_#22c55e]' : 'bg-gray-800'}`}></div>
                          ))}
                          {streak > 3 && <span className="text-xs font-bold text-duo-green ml-1">+{streak - 3}</span>}
                      </div>
                  </div>
              </div>
              <div className="mt-2 bg-black/60 px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/10 backdrop-blur-sm">
                  PITCH {11 - pitchesLeft} / 10
              </div>
          </div>

          <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      {/* --- 3D GAME VIEWPORT --- */}
      <div className="flex-1 relative overflow-hidden bg-[#1a1a1a] flex flex-col items-center justify-center" style={{ perspective: '800px' }}>
          
          {/* STADIUM BACKGROUND LAYERS */}
          <div className="absolute inset-0 pointer-events-none transform-style-3d">
                {/* Sky */}
                <div className="absolute top-0 left-0 w-full h-[60%] bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155]"></div>
                
                {/* Stadium Lights Glow */}
                <div className="absolute top-10 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-[100px]"></div>
                <div className="absolute top-10 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-[100px]"></div>

                {/* Batter's Eye / Center Field Wall */}
                <div className="absolute top-[40%] left-0 w-full h-[20%] bg-[#0f172a] flex items-end justify-center">
                    <div className="w-[60%] h-[80%] bg-[#020617] rounded-t-3xl border-t-4 border-gray-800 shadow-2xl"></div>
                </div>

                {/* Outfield Grass */}
                <div className="absolute top-[50%] left-0 w-full h-[50%] bg-gradient-to-b from-[#14532d] to-[#166534] origin-top transform rotate-x-60"></div>
                
                {/* Infield Dirt / Mound */}
                <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#78350f] rounded-[100%] blur-xl opacity-60 transform scale-y-50"></div>
                <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-32 h-8 bg-white/20 rounded-[100%] blur-md"></div> {/* Rubber */}
          </div>

          {/* STRIKE ZONE (HUD Element in 3D space) */}
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[280px] border-2 border-white/20 rounded-lg bg-white/5 backdrop-blur-[1px] z-10">
              {/* Zone Grid */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                  {[...Array(9)].map((_, i) => <div key={i} className="border border-white/5"></div>)}
              </div>
          </div>

          {/* --- THE BALL --- */}
          <motion.div 
            className="absolute z-20 will-change-transform"
            style={{ 
                left: `${ballState.x}%`, 
                top: `${ballState.y}%`,
                width: '120px', 
                height: '120px',
                x: '-50%',
                y: '-50%',
                scale: ballState.scale,
                opacity: ballState.opacity,
            }}
          >
              {/* Ball Rendering */}
              <motion.div 
                  className="w-full h-full rounded-full bg-white relative overflow-hidden shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.3)]"
                  animate={gameState === 'pitching' && currentPitch ? getSpinStyle(currentPitch) : {}}
                  transition={{ repeat: Infinity, duration: currentPitch?.spinRate || 1, ease: "linear" }}
              >
                   {/* Texture/Shading */}
                   <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-300 rounded-full"></div>
                   
                   {/* Seams (Red Dashed Lines) */}
                   <div className="absolute inset-0 border-[6px] border-dashed border-red-600 rounded-full opacity-90 w-[130%] h-[130%] -top-[15%] -left-[15%] clip-path-seam-1"></div>
                   <div className="absolute inset-0 border-[6px] border-dashed border-red-600 rounded-full opacity-90 w-[130%] h-[130%] top-[15%] left-[15%] clip-path-seam-2"></div>
              </motion.div>
          </motion.div>

          {/* --- BALL SHADOW --- */}
          <motion.div 
             className="absolute z-10 bg-black/40 rounded-[100%] blur-md pointer-events-none"
             style={{
                 left: `${ballState.x}%`,
                 top: '75%', // Fixed on ground plane
                 x: '-50%',
                 y: '-50%',
                 width: '120px',
                 height: '40px',
                 scale: ballState.scale * 1.2, // Shadow grows with ball but stays flat
                 opacity: ballState.opacity * 0.6
             }}
          />

          {/* --- INTRO / READY OVERLAYS --- */}
          <AnimatePresence mode='wait'>
             {gameState === 'intro' && (
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50"
                 >
                     <div className="bg-white p-8 rounded-3xl max-w-md text-center border-4 border-duo-blue shadow-2xl">
                         <div className="w-20 h-20 bg-duo-blue/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                             <Eye size={40} className="text-duo-blue" />
                         </div>
                         <h1 className="text-3xl font-extrabold text-duo-gray-800 mb-2 uppercase italic">Eye of the Tiger</h1>
                         <p className="text-duo-gray-500 font-bold mb-8">
                             Identify the pitch type as it breaks. Speed and accuracy determine your OPS.
                         </p>
                         <TacticalButton fullWidth onClick={startGame}>
                             Step into the Box
                         </TacticalButton>
                     </div>
                 </motion.div>
             )}

             {gameState === 'ready' && (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center z-40 cursor-pointer"
                    onClick={throwPitch}
                 >
                     <div className="bg-black/50 backdrop-blur-sm px-8 py-4 rounded-full border-2 border-white/20 text-white font-extrabold uppercase tracking-[0.2em] hover:bg-white/10 hover:scale-105 transition-all flex items-center gap-3">
                         <CircleDot size={24} className="animate-pulse text-duo-red" />
                         Tap to Pitch
                     </div>
                 </motion.div>
             )}
             
             {/* --- FEEDBACK OVERLAY --- */}
             {gameState === 'feedback' && lastResult && (
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
                 >
                     <div className="relative">
                         {/* Main Badge */}
                         <div className={`
                            px-12 py-8 rounded-3xl border-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center transform rotate-[-5deg]
                            ${lastResult.actual.type === lastResult.guess 
                                ? 'bg-duo-green border-white text-white' 
                                : 'bg-duo-red border-white text-white'
                            }
                         `}>
                             <div className="text-6xl font-black uppercase tracking-tighter mb-2 drop-shadow-md">
                                 {lastResult.actual.type === lastResult.guess ? 'STRIKE!' : 'BALL!'}
                             </div>
                             <div className="text-xl font-bold uppercase opacity-90 flex items-center gap-2 bg-black/20 px-4 py-1 rounded-full">
                                 {lastResult.actual.velocity} • {lastResult.actual.type}
                             </div>
                         </div>

                         {/* Stats Tag */}
                         <motion.div 
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="absolute -bottom-6 -right-6 bg-white text-duo-gray-900 px-4 py-2 rounded-xl border-4 border-duo-gray-900 shadow-xl flex items-center gap-2"
                         >
                             <Zap size={16} className="text-duo-yellow" fill="currentColor" />
                             <span className="font-black font-mono">{lastResult.score} XP</span>
                         </motion.div>
                     </div>
                 </motion.div>
             )}

             {gameState === 'summary' && (
                 <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50"
                 >
                     <div className="bg-white p-8 rounded-3xl max-w-sm text-center border-4 border-duo-blue shadow-2xl">
                         <Trophy size={64} className="mx-auto text-duo-yellow mb-4 drop-shadow-lg" fill="currentColor" />
                         <h2 className="text-3xl font-extrabold text-duo-gray-800 mb-1 uppercase">Session Stats</h2>
                         <div className="text-6xl font-black text-duo-blue mb-4 tracking-tighter">{score}</div>
                         
                         <div className="grid grid-cols-2 gap-2 mb-8 text-left">
                             <div className="bg-duo-gray-100 p-3 rounded-xl">
                                 <div className="text-[10px] font-bold text-duo-gray-400 uppercase">Accuracy</div>
                                 <div className="text-lg font-black text-duo-gray-800">{Math.round((score / 1500) * 100)}%</div>
                             </div>
                             <div className="bg-duo-gray-100 p-3 rounded-xl">
                                 <div className="text-[10px] font-bold text-duo-gray-400 uppercase">Avg React</div>
                                 <div className="text-lg font-black text-duo-gray-800">0.42s</div>
                             </div>
                         </div>
                         
                         <div className="flex gap-3">
                            <TacticalButton fullWidth onClick={startGame}>
                                Replay
                            </TacticalButton>
                            <TacticalButton fullWidth variant="secondary" onClick={onBack}>
                                Locker Room
                            </TacticalButton>
                         </div>
                     </div>
                 </motion.div>
             )}
          </AnimatePresence>

      </div>

      {/* --- CONTROLS (Arcade Buttons) --- */}
      <div className="bg-gray-900 p-4 pb-6 border-t-4 border-gray-800 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {PITCH_TYPES.map(p => (
                  <button
                    key={p.type}
                    disabled={gameState !== 'pitching'}
                    onClick={() => handleGuess(p.type as PitchType)}
                    className={`
                        relative overflow-hidden py-4 rounded-2xl font-black uppercase text-sm md:text-base tracking-wider transition-all transform active:scale-95
                        ${gameState === 'feedback' && lastResult?.actual.type === p.type 
                            ? 'bg-duo-green text-white shadow-[0_0_20px_#22c55e] scale-105 z-10 ring-4 ring-white' // Reveal Correct
                            : gameState === 'feedback' && lastResult?.guess === p.type
                                ? 'bg-duo-red text-white opacity-50' // Wrong Guess
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-lg border-b-4 border-black active:border-b-0 active:translate-y-1' // Default
                        }
                    `}
                  >
                      <div className="relative z-10 flex flex-col items-center">
                          {p.type}
                          <span className="text-[10px] font-medium opacity-60 normal-case tracking-normal font-mono mt-1">{p.velocity}</span>
                      </div>
                      
                      {/* Button Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                  </button>
              ))}
          </div>
      </div>
    </div>
  );
};
