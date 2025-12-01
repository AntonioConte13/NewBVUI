
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Lock, BookOpen, Video, Trophy, Zap, MapPin, Flag } from 'lucide-react';
import { CERT_PATH, BVSA_QUIZZES } from '../../constants';
import { QuizModal } from './QuizModal';
import { VideoModuleModal } from './VideoModuleModal';
import { QuizQuestion } from '../../types';

interface CertificationProps {
  userXP: number;
  addXP: (amount: number) => void;
}

export const Certification: React.FC<CertificationProps> = ({ userXP, addXP }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<{ title: string, questions: QuizQuestion[] } | null>(null);
  
  // State for modules (local tracking of completion)
  const [modules, setModules] = useState(CERT_PATH);
  const [pointDelta, setPointDelta] = useState<number | null>(null);

  // Helper to animate points
  const triggerPointAnimation = (xp: number) => {
      setPointDelta(xp);
      addXP(xp); // Update Global State
      setTimeout(() => setPointDelta(null), 2500);
  };

  const handleModuleClick = (moduleId: string, type: string, status: string) => {
      if (status === 'locked') return;
      
      const quizData = BVSA_QUIZZES[moduleId];

      if (quizData) {
          setActiveQuiz({ 
              title: quizData.title, 
              questions: quizData.questions 
          });
          setShowQuiz(true);
      } else if (type === 'video') {
          setShowVideo(true);
      } else {
          // Fallback or specific trophy logic
          console.log("Module clicked:", moduleId);
      }
  };

  const unlockNextModule = (currentModuleId: string) => {
      const idx = modules.findIndex(m => m.id === currentModuleId);
      if (idx !== -1) {
          setModules(prev => {
              const newModules = [...prev];
              // Mark current as completed
              if (newModules[idx].status !== 'completed') {
                  newModules[idx].status = 'completed';
                  // Unlock next if exists
                  if (idx < newModules.length - 1) {
                      newModules[idx + 1].status = 'active';
                  }
              }
              return newModules;
          });
      }
  };

  const handleVideoComplete = () => {
      const xp = 250;
      triggerPointAnimation(xp);
      setShowVideo(false);
  };

  const handleQuizPass = (xp: number) => {
      triggerPointAnimation(xp);
      setShowQuiz(false);

      if (activeQuiz) {
           const currentModuleId = Object.keys(BVSA_QUIZZES).find(key => BVSA_QUIZZES[key].title === activeQuiz.title);
           if (currentModuleId) {
               unlockNextModule(currentModuleId);
           }
      }
  };

  const getIcon = (type: string, size = 24) => {
    switch(type) {
      case 'video': return <Video size={size} />;
      case 'quiz': return <Star size={size} />;
      case 'trophy': return <Trophy size={size} />;
      default: return <BookOpen size={size} />;
    }
  };

  // --- Field Layout Calculation ---
  // REVERSED: Start from Top (Home Plate) -> Down -> Bottom (World Series)
  const generatePathPoints = (count: number) => {
      const points = [];
      const rowHeight = 160; // Spacing between nodes
      const startY = 250; // Padding from top to fit Home Plate
      
      for (let i = 0; i < count; i++) {
          // Zigzag logic
          let xPercent = 50; 
          const sineWave = Math.sin(i * 0.9) * 35; // Amplitude
          xPercent = 50 + sineWave;
          
          // REVERSED Y: Start from top (startY) and go down (increase Y)
          points.push({ x: xPercent, y: startY + (i * rowHeight) });
      }
      return points;
  };

  const nodePositions = generatePathPoints(modules.length);
  // Calculate total height based on last node + space for trophy (Increased for final curve)
  const totalHeight = nodePositions.length > 0 ? nodePositions[nodePositions.length - 1].y + 500 : 800;

  // Create SVG Path string
  const generateSvgPath = () => {
      if (nodePositions.length === 0) return "";
      
      let d = `M ${nodePositions[0].x}% ${nodePositions[0].y}`;
      
      for (let i = 1; i < nodePositions.length; i++) {
          const curr = nodePositions[i];
          const prev = nodePositions[i-1];
          
          // Top-to-Bottom flow control points
          const cp1x = prev.x;
          const cp1y = prev.y + 80; // Control point goes DOWN from prev
          const cp2x = curr.x;
          const cp2y = curr.y - 80; // Control point comes from UP towards curr

          d += ` C ${cp1x}% ${cp1y}, ${cp2x}% ${cp2y}, ${curr.x}% ${curr.y}`;
      }

      // Add final curve to center for the trophy
      if (nodePositions.length > 0) {
          const last = nodePositions[nodePositions.length - 1];
          const finishX = 50; // Center
          const finishY = last.y + 180; // Below last node
          
          const cp1x = last.x;
          const cp1y = last.y + 80;
          const cp2x = finishX;
          const cp2y = finishY - 80;
          
          d += ` C ${cp1x}% ${cp1y}, ${cp2x}% ${cp2y}, ${finishX}% ${finishY}`;
      }

      return d;
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Point Delta Animation */}
      <AnimatePresence>
        {pointDelta && (
            <motion.div 
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 1, y: -200, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[150] pointer-events-none"
            >
                <div className="flex flex-col items-center">
                    <div className="text-7xl font-extrabold text-duo-yellow drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] flex items-center gap-2" style={{ textShadow: '3px 3px 0 #000' }}>
                        <Trophy size={80} fill="currentColor" /> +{pointDelta}
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      {showQuiz && activeQuiz && (
        <QuizModal 
            title={activeQuiz.title} 
            questions={activeQuiz.questions} 
            onClose={() => setShowQuiz(false)} 
            onPass={handleQuizPass}
        />
      )}
      {showVideo && <VideoModuleModal onClose={() => setShowVideo(false)} onComplete={handleVideoComplete} />}
      
      {/* Header HUD - Scoreboard Style - Lowered Z-Index to 40 so sidebar (60) covers it */}
      <header className="sticky top-4 z-40 mx-4 mb-8">
        <div className="bg-[#111827] border-4 border-white rounded-3xl shadow-[0_8px_16px_rgba(0,0,0,0.3)] p-4 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
            
            {/* Background pattern for scoreboard look */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-duo-blue/20 to-transparent pointer-events-none"></div>

            {/* Left: Title Area */}
            <div className="relative z-10 flex items-center gap-4 w-full md:w-auto">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 border-4 border-duo-gray-200 shrink-0">
                     <MapPin size={32} className="text-duo-red" fill="currentColor" />
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tight transform -skew-x-6 drop-shadow-lg truncate">
                        Bobby's Way
                    </h1>
                    <div className="flex items-center gap-2 mt-0.5">
                        <div className="h-1.5 w-8 bg-duo-red rounded-full"></div>
                        <p className="text-[10px] md:text-xs font-bold text-duo-gray-300 uppercase tracking-widest truncate">
                            Official Certification Pathway
                        </p>
                    </div>
                </div>
            </div>

            {/* Right: XP Scoreboard */}
            <div className="relative z-10 bg-black/40 border-2 border-white/10 rounded-2xl px-5 py-2 flex items-center gap-4 shadow-inner backdrop-blur-sm min-w-[160px] justify-between w-full md:w-auto">
                <div className="flex flex-col">
                    <span className="text-[10px] font-extrabold text-duo-gray-400 uppercase tracking-wider">Current XP</span>
                    <span className="text-2xl md:text-3xl font-mono font-black text-white leading-none tracking-tight drop-shadow-md">
                        {userXP.toLocaleString()}
                    </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-duo-yellow flex items-center justify-center text-white shadow-[0_0_20px_rgba(250,204,21,0.6)] border-2 border-white">
                    <Zap size={20} fill="currentColor" />
                </div>
            </div>
        </div>
      </header>

      {/* REALISTIC FIELD CONTAINER */}
      <div 
        className="relative overflow-hidden rounded-[2.5rem] border-8 border-[#2f4f2f] shadow-2xl"
        style={{ 
            height: `${totalHeight}px`,
            background: 'linear-gradient(180deg, #3a7c48 0%, #4ade80 100%)',
        }}
      >
         {/* Grass Texture Overlay */}
         <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay" 
             style={{ 
                 backgroundImage: `url("https://www.transparenttextures.com/patterns/grass.png")`,
                 backgroundSize: '200px 200px'
             }} 
         />
         
         {/* Mowed Lawn Stripes */}
         <div className="absolute inset-0 pointer-events-none opacity-10" style={{
             backgroundImage: 'repeating-linear-gradient(0deg, #000, #000 50px, transparent 50px, transparent 100px)',
             backgroundSize: '100% 100px'
         }}></div>

         {/* SVG Layer for Path */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
             <defs>
                 {/* Dirt Texture Pattern */}
                 <pattern id="dirtPattern" patternUnits="userSpaceOnUse" width="100" height="100">
                     <rect width="100" height="100" fill="#8B4513" />
                     <filter id="noise">
                         <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                     </filter>
                     <rect width="100" height="100" filter="url(#noise)" opacity="0.3" />
                 </pattern>
                 <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="black" floodOpacity="0.3"/>
                 </filter>
             </defs>

             {/* The Outer Path (Border) */}
             <path 
                d={generateSvgPath()} 
                fill="none" 
                stroke="#3e2723" 
                strokeWidth="70" 
                strokeLinecap="round"
                opacity="0.4"
             />
             {/* The Inner Path (Dirt) */}
             <path 
                d={generateSvgPath()} 
                fill="none" 
                stroke="#8B4513" 
                strokeWidth="58" 
                strokeLinecap="round" 
                strokeDasharray="1 0"
             />
             {/* Path Texture Overlay */}
             <path 
                d={generateSvgPath()} 
                fill="none" 
                stroke="url(#dirtPattern)" 
                strokeWidth="58" 
                strokeLinecap="round"
                opacity="0.8"
             />
         </svg>

         {/* Start Marker (Home Plate) - NOW AT TOP */}
         <div 
            className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            style={{ top: '60px' }}
         >
             <div className="w-32 h-32 bg-white clip-path-home-plate flex items-center justify-center shadow-2xl relative z-10">
                 {/* Inner bevel for realism */}
                 <div className="absolute inset-2 bg-gray-100 clip-path-home-plate flex items-center justify-center border-t-4 border-gray-300">
                    <span className="font-extrabold text-duo-gray-400 uppercase text-xs mt-4">START</span>
                 </div>
             </div>
             {/* Dirt circle under home plate */}
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#6d4c41] rounded-full blur-sm -z-10"></div>
             <style>{`.clip-path-home-plate { clip-path: polygon(50% 0, 100% 50%, 100% 100%, 0 100%, 0 50%); }`}</style>
         </div>

         {/* Render Nodes */}
         {modules.map((module, index) => {
             const pos = nodePositions[index];
             const isActive = module.status === 'active';
             const isCompleted = module.status === 'completed';
             const isLocked = module.status === 'locked';

             // Every 4th module is a "Base" (Diamond), others are "Mounds" (Circle)
             const isBase = (index + 1) % 4 === 0 || index === modules.length - 1;

             return (
                 <div 
                    key={module.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
                    style={{ 
                        left: `${pos.x}%`, 
                        top: `${pos.y}px`,
                        zIndex: 20 + index
                    }}
                 >
                     {/* Dirt Cutout Underneath */}
                     <div className="absolute w-32 h-32 bg-[#6d4c41] rounded-full -z-10 opacity-90 border-4 border-[#5d4037] shadow-inner"></div>

                     {/* Active Indicator Pulse (Pulsing Ring) */}
                     {isActive && (
                        <motion.div 
                            initial={{ scale: 1, opacity: 0.6 }}
                            animate={{ scale: 1.3, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                            className={`absolute top-0 left-0 w-full h-full ${isBase ? 'rounded-lg rotate-45' : 'rounded-full'} border-4 border-duo-blue z-0 pointer-events-none`}
                        />
                     )}

                     {/* The Base/Mound Entity */}
                     <motion.button
                        whileHover={!isLocked ? { scale: 1.15, translateY: -5 } : {}}
                        whileTap={!isLocked ? { scale: 0.9 } : {}}
                        onClick={() => handleModuleClick(module.id, module.iconType, module.status)}
                        className={`
                            relative flex items-center justify-center transition-colors duration-300 z-10
                            ${isBase 
                                ? 'w-24 h-24 rotate-45 rounded-lg' // Diamond Base
                                : 'w-20 h-20 rounded-full' // Circular Mound
                            }
                            ${isCompleted 
                                ? 'bg-white shadow-[4px_4px_0_#cbd5e1,0_10px_20px_rgba(0,0,0,0.3)]' 
                                : isActive 
                                    ? 'bg-white shadow-[0_0_25px_rgba(255,255,255,0.8),4px_4px_0_#cbd5e1]' 
                                    : 'bg-duo-gray-200 shadow-[2px_2px_0_#94a3b8] cursor-not-allowed opacity-80'
                            }
                        `}
                     >
                        {/* 3D Edge Effect */}
                        <div className={`absolute inset-0 rounded-inherit border-b-4 border-r-4 pointer-events-none ${isCompleted ? 'border-gray-300' : 'border-gray-200'}`}></div>

                        {/* Content Icon with Animation */}
                        <motion.div 
                            className={`${isBase ? '-rotate-45' : ''} ${isCompleted ? 'text-duo-green' : isActive ? 'text-duo-blue' : 'text-duo-gray-400'} relative z-10`}
                            animate={
                                isActive ? { 
                                    y: [0, -3, 0],
                                    transition: { repeat: Infinity, duration: 2, ease: "easeInOut" } 
                                } : isCompleted ? {
                                    scale: 1,
                                    opacity: 1
                                } : {
                                    opacity: 0.7
                                }
                            }
                        >
                            {isCompleted ? (
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                                >
                                    <Check size={36} strokeWidth={4} />
                                </motion.div>
                            ) : isLocked ? (
                                <Lock size={28} />
                            ) : (
                                getIcon(module.iconType, isBase ? 36 : 28)
                            )}
                        </motion.div>

                     </motion.button>
                     
                     {/* Tooltip Label */}
                     <motion.div 
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className={`
                            mt-8 px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 shadow-lg text-center min-w-[120px] transition-all
                            ${isActive ? 'bg-duo-blue/90 text-white -translate-y-2' : 'bg-black/60 text-white/80'}
                        `}
                     >
                         <div className="text-[10px] font-extrabold uppercase tracking-widest opacity-70 mb-0.5">
                             {isCompleted ? 'Completed' : isLocked ? 'Locked' : 'Current'}
                         </div>
                         <div className="text-xs font-bold leading-tight">
                             {module.title}
                         </div>
                     </motion.div>

                 </div>
             );
         })}

         {/* BVSA Certified Coach Trophy at the Bottom - NOW AT END */}
         <div 
            className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center"
            style={{ top: `${nodePositions.length > 0 ? nodePositions[nodePositions.length - 1].y + 130 : 800}px` }}
         >
             <div className="w-40 h-40 relative flex items-center justify-center">
                 <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl animate-pulse"></div>
                 <Trophy size={80} className="text-yellow-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] relative z-10" fill="url(#goldGradient)" />
                 
                 <svg width="0" height="0">
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop stopColor="#FDE68A" offset="0%" />
                        <stop stopColor="#D97706" offset="100%" />
                    </linearGradient>
                </svg>
             </div>
             <div className="bg-yellow-500 text-white px-6 py-2 rounded-full font-extrabold uppercase tracking-widest shadow-lg border-2 border-yellow-300 text-center whitespace-nowrap text-sm md:text-base">
                 BVSA Certified Coach
             </div>
         </div>
         
      </div>

    </div>
  );
};
