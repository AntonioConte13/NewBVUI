
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Activity, Target, Trophy, Play, RefreshCw, Zap, MousePointer2 } from 'lucide-react';
import { TacticalButton } from '../../ui/TacticalButton';
import { motion, AnimatePresence } from 'framer-motion';

interface HittingDrillGameProps {
  onBack: () => void;
}

type GameState = 'menu' | 'playing' | 'summary';
type HitResult = 'PERFECT' | 'EARLY' | 'LATE' | 'MISS' | 'TAKE' | 'STRIKE';

const ZONES = {
    EARLY_LIMIT: 0.80,
    PERFECT_START: 0.85,
    PERFECT_END: 0.95,
    LATE_LIMIT: 0.98
};

export const HittingDrillGame: React.FC<HittingDrillGameProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [pitchesRemaining, setPitchesRemaining] = useState(10);
  const [lastResult, setLastResult] = useState<HitResult | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  
  // Ball State
  const [ballVisible, setBallVisible] = useState(false);
  const [ballScale, setBallScale] = useState(0.1);
  const [ballY, setBallY] = useState(20); // Top (Mound)
  const [isHit, setIsHit] = useState(false);
  const [hitTrajectory, setHitTrajectory] = useState({ x: 0, y: 0, scale: 0 });

  // Refs for Game Loop
  const requestRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);
  const pitchSpeedRef = useRef<number>(2000); // ms to reach plate
  const isSwingingRef = useRef(false);
  const ballProgressRef = useRef(0);

  const startGame = () => {
    setScore(0);
    setPitchesRemaining(10);
    setGameState('playing');
    setLastResult(null);
    setTimeout(throwPitch, 1500);
  };

  const throwPitch = () => {
    if (pitchesRemaining <= 0) {
        setGameState('summary');
        return;
    }

    // Reset Ball
    setBallVisible(true);
    setIsHit(false);
    isSwingingRef.current = false;
    setLastResult(null);
    ballProgressRef.current = 0;
    
    // Randomize Pitch Speed (1.2s to 2.5s)
    pitchSpeedRef.current = 1200 + Math.random() * 1300;
    startTimeRef.current = performance.now();

    // Start Loop
    requestRef.current = requestAnimationFrame(animatePitch);
  };

  const animatePitch = (time: number) => {
    const elapsed = time - startTimeRef.current;
    const progress = elapsed / pitchSpeedRef.current;
    ballProgressRef.current = progress;

    if (isSwingingRef.current) return; // Stop animation if swung (handled in swing logic)

    if (progress >= 1.1) {
        // Ball passed catcher
        handleMiss();
        return;
    }

    // Update Visuals
    // Y: 35% (Mound) -> 90% (Plate)
    const newY = 35 + (progress * 55);
    // Scale: 0.1 -> 1.5
    const newScale = 0.1 + (progress * 1.4);

    setBallY(newY);
    setBallScale(newScale);

    requestRef.current = requestAnimationFrame(animatePitch);
  };

  const handleSwing = () => {
    if (gameState !== 'playing' || !ballVisible || isSwingingRef.current || isHit) return;
    
    isSwingingRef.current = true;
    cancelAnimationFrame(requestRef.current!);
    
    const p = ballProgressRef.current;
    let result: HitResult = 'MISS';
    let points = 0;
    let text = "STRIKE!";
    
    // Physics for hit ball
    let trajX = (Math.random() * 200) - 100;
    let trajY = -200; // Up/Out
    let trajScale = 0.1;

    if (p >= ZONES.PERFECT_START && p <= ZONES.PERFECT_END) {
        result = 'PERFECT';
        points = 500;
        text = "CRUSHED!";
        trajY = -500; // Home Run
    } else if (p > ZONES.EARLY_LIMIT && p < ZONES.PERFECT_START) {
        result = 'EARLY';
        points = 100;
        text = "PULLED FOUL";
        trajX = -300; // Way left
    } else if (p > ZONES.PERFECT_END && p < ZONES.LATE_LIMIT) {
        result = 'LATE';
        points = 100;
        text = "OPPO SLAP";
        trajX = 300; // Way right
    } else {
        result = 'MISS';
        points = 0;
        text = "WHIFF!";
        trajY = 100; // Into catcher
    }

    setLastResult(result);
    setScore(s => s + points);
    setFeedbackText(text);
    setPitchesRemaining(p => p - 1);

    if (result !== 'MISS') {
        setIsHit(true);
        setHitTrajectory({ x: trajX, y: trajY, scale: trajScale });
    } else {
        setBallVisible(false);
    }

    // Next Pitch Delay
    setTimeout(() => {
        if (pitchesRemaining > 1) {
            throwPitch();
        } else {
            setGameState('summary');
        }
    }, 2000);
  };

  const handleMiss = () => {
      setBallVisible(false);
      setLastResult('STRIKE');
      setFeedbackText("TAKE - STRIKE");
      setPitchesRemaining(p => p - 1);
      
      setTimeout(() => {
        if (pitchesRemaining > 1) {
            throwPitch();
        } else {
            setGameState('summary');
        }
    }, 1500);
  };

  useEffect(() => {
      return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-gray-900 rounded-3xl overflow-hidden relative shadow-2xl border-4 border-duo-gray-800 select-none">
      
      {/* --- HEADER --- */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
          <div className="pointer-events-auto">
              <button onClick={onBack} className="p-2 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 text-white transition-colors">
                  <ArrowLeft size={20} />
              </button>
          </div>
          <div className="flex gap-4">
              <div className="bg-black/60 backdrop-blur-md px-4 py-1 rounded-xl border border-white/10">
                  <div className="text-[10px] text-gray-400 font-extrabold uppercase">Score</div>
                  <div className="text-xl font-black text-duo-yellow font-mono">{score}</div>
              </div>
              <div className="bg-black/60 backdrop-blur-md px-4 py-1 rounded-xl border border-white/10">
                  <div className="text-[10px] text-gray-400 font-extrabold uppercase">Left</div>
                  <div className="text-xl font-black text-white font-mono">{pitchesRemaining}</div>
              </div>
          </div>
      </div>

      {/* --- 3D VIEWPORT --- */}
      <div className="flex-1 relative bg-[#111] overflow-hidden flex flex-col items-center justify-center perspective-1000">
          
          {/* Background Stadium */}
          <div className="absolute inset-0 pointer-events-none opacity-50">
              {/* Sky */}
              <div className="absolute top-0 w-full h-[60%] bg-gradient-to-b from-slate-900 to-slate-800"></div>
              {/* Lights */}
              <div className="absolute top-[10%] left-[20%] w-2 h-2 bg-white shadow-[0_0_100px_60px_rgba(255,255,255,0.3)] rounded-full"></div>
              <div className="absolute top-[10%] right-[20%] w-2 h-2 bg-white shadow-[0_0_100px_60px_rgba(255,255,255,0.3)] rounded-full"></div>
              {/* Field */}
              <div className="absolute top-[50%] w-full h-[50%] bg-[#2e7d32] origin-top transform rotate-x-60 scale-150">
                  {/* Dirt Mound */}
                  <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-32 h-32 bg-[#8d6e63] rounded-full blur-md"></div>
              </div>
              {/* Cage Netting */}
              <div className="absolute inset-0 border-8 border-gray-800 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
          </div>

          {/* Strike Zone Target (Visual Reference) */}
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-48 h-64 border-4 border-white/20 rounded-lg z-10">
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                  <div className="border border-white/10"></div>
                  <div className="border border-white/10"></div>
                  <div className="border border-white/10"></div>
                  <div className="border border-white/10"></div>
              </div>
          </div>

          {/* Batter Silhouette (Static Overlay) */}
          <div className="absolute bottom-0 left-[-10%] w-[60%] h-[80%] bg-contain bg-no-repeat bg-bottom z-20 opacity-80 pointer-events-none" 
               style={{ backgroundImage: 'url(https://cdn.pixabay.com/photo/2014/04/03/10/00/batter-309566_1280.png)', filter: 'brightness(0)' }}>
          </div>

          {/* THE BALL */}
          {ballVisible && (
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 bg-white rounded-full z-30 shadow-inner"
                style={{
                    top: `${ballY}%`,
                    width: '60px',
                    height: '60px',
                    scale: isHit ? 0 : ballScale, // Hide instantly on hit logic, let Hit Animation take over
                }}
                animate={isHit ? {
                    x: hitTrajectory.x,
                    y: hitTrajectory.y,
                    scale: hitTrajectory.scale,
                    opacity: 0
                } : {}}
                transition={isHit ? { duration: 0.8, ease: "easeOut" } : { duration: 0 }}
              >
                  {/* Seams */}
                  <div className="absolute inset-0 border-2 border-red-600 border-dashed rounded-full opacity-50 animate-spin"></div>
              </motion.div>
          )}

          {/* Hit Feedback */}
          <AnimatePresence>
              {lastResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-[30%] z-50 flex flex-col items-center"
                  >
                      <div className={`
                        text-5xl font-black italic uppercase tracking-tighter drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] stroke-text
                        ${lastResult === 'PERFECT' ? 'text-duo-yellow' : lastResult === 'MISS' || lastResult === 'STRIKE' ? 'text-duo-red' : 'text-white'}
                      `}>
                          {feedbackText}
                      </div>
                      {lastResult === 'PERFECT' && (
                          <div className="text-duo-green font-extrabold text-xl mt-2 bg-white px-4 py-1 rounded-full shadow-lg">+500 XP</div>
                      )}
                  </motion.div>
              )}
          </AnimatePresence>

          {/* Menu Overlay */}
          {gameState === 'menu' && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-24 h-24 bg-duo-red rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-[0_0_30px_rgba(220,38,38,0.6)]">
                      <Target size={48} className="text-white" />
                  </div>
                  <h1 className="text-4xl font-black text-white uppercase italic tracking-tight mb-2">Cage Commander</h1>
                  <p className="text-gray-400 font-bold mb-8 max-w-xs">
                      Timing is everything. Tap SWING exactly when the ball enters the strike zone.
                  </p>
                  <TacticalButton onClick={startGame} icon={<Play size={24} />}>
                      Enter Cage
                  </TacticalButton>
              </div>
          )}

          {/* Summary Overlay */}
          {gameState === 'summary' && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-8 text-center">
                  <Trophy size={64} className="text-duo-yellow mb-4 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
                  <h2 className="text-3xl font-black text-white uppercase mb-1">Session Complete</h2>
                  <div className="text-6xl font-black text-duo-blue mb-6">{score}</div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-xs">
                      <div className="bg-gray-800 p-3 rounded-xl border border-gray-700">
                          <div className="text-[10px] font-bold text-gray-400 uppercase">Rating</div>
                          <div className="text-white font-bold">{score > 2000 ? 'Elite' : score > 1000 ? 'Pro' : 'Rookie'}</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-xl border border-gray-700">
                          <div className="text-[10px] font-bold text-gray-400 uppercase">XP Earned</div>
                          <div className="text-duo-green font-bold">+{Math.round(score / 10)}</div>
                      </div>
                  </div>

                  <div className="flex gap-3 w-full max-w-xs">
                      <TacticalButton fullWidth onClick={startGame} icon={<RefreshCw size={18} />}>
                          Again
                      </TacticalButton>
                      <TacticalButton fullWidth variant="secondary" onClick={onBack}>
                          Exit
                      </TacticalButton>
                  </div>
              </div>
          )}

      </div>

      {/* --- CONTROLS --- */}
      <div className="h-32 bg-gray-900 border-t-4 border-gray-800 flex items-center justify-center p-4 relative z-40">
          <button
            onMouseDown={handleSwing}
            onTouchStart={handleSwing}
            disabled={gameState !== 'playing' || isSwingingRef.current}
            className="w-full max-w-md h-full bg-duo-red hover:bg-red-500 active:bg-red-700 active:scale-95 text-white rounded-2xl font-black text-3xl uppercase tracking-widest transition-all shadow-[0_6px_0_#7f1d1d] active:shadow-none active:translate-y-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border-2 border-white/10"
          >
              <Zap size={32} fill="currentColor" />
              SWING
          </button>
          <div className="absolute bottom-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest pointer-events-none">
              Tap to Swing
          </div>
      </div>

    </div>
  );
};
