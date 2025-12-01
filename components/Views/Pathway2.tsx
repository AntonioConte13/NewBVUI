
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Lock, BookOpen, Video, Trophy, Zap, MapPin, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { CERT_PATH, BVSA_QUIZZES } from '../../constants';
import { QuizModal } from './QuizModal';
import { VideoModuleModal } from './VideoModuleModal';
import { QuizQuestion, CertModule } from '../../types';

interface Pathway2Props {
  userXP: number;
  addXP: (amount: number) => void;
  isAdminUnlockEnabled?: boolean;
}

export const Pathway2: React.FC<Pathway2Props> = ({ userXP, addXP, isAdminUnlockEnabled = false }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<{ title: string, questions: QuizQuestion[] } | null>(null);
  
  // State for modules (local tracking of completion)
  const [modules, setModules] = useState<CertModule[]>(() => {
      const finalModule: CertModule = {
          id: 'cert-completion',
          title: 'BVSA Certified Coach',
          description: 'Official Certification. Mastery of all tactical protocols and academy standards.',
          status: 'locked',
          xpReward: 10000,
          iconType: 'trophy'
      };
      return [...CERT_PATH, finalModule];
  });

  const [activeIndex, setActiveIndex] = useState(0); // Center card index
  const [pointDelta, setPointDelta] = useState<number | null>(null);

  // Initialize active index to first active/uncompleted module
  useEffect(() => {
    const firstActive = modules.findIndex(m => m.status === 'active');
    if (firstActive !== -1) setActiveIndex(firstActive);
  }, []);

  // Helper to animate points
  const triggerPointAnimation = (xp: number) => {
      setPointDelta(xp);
      addXP(xp); // Update Global State
      setTimeout(() => setPointDelta(null), 2500);
  };

  const handleModuleClick = (moduleId: string, type: string, status: string) => {
      // If admin unlock is off AND status is locked, prevent click
      if (status === 'locked' && !isAdminUnlockEnabled) return;
      
      const quizData = BVSA_QUIZZES[moduleId];

      if (quizData) {
          setActiveQuiz({ 
              title: quizData.title, 
              questions: quizData.questions 
          });
          setShowQuiz(true);
      } else if (type === 'video') {
          setShowVideo(true);
      } else if (moduleId === 'cert-completion') {
          // Final Trophy Click Logic
          triggerPointAnimation(10000);
          setModules(prev => {
              const newModules = [...prev];
              const idx = newModules.findIndex(m => m.id === moduleId);
              if (idx !== -1) newModules[idx].status = 'completed';
              return newModules;
          });
      } else {
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
      // Auto-advance logic if needed
      const currentModule = modules[activeIndex];
      unlockNextModule(currentModule.id);
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

  // --- Carousel Logic ---
  const nextCard = () => {
      if (activeIndex < modules.length - 1) setActiveIndex(prev => prev + 1);
  };

  const prevCard = () => {
      if (activeIndex > 0) setActiveIndex(prev => prev - 1);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextCard();
      if (e.key === 'ArrowLeft') prevCard();
      if (e.key === 'Enter') {
          // Optional: Allow Enter key to deploy ONLY if the card is centered
          const m = modules[activeIndex];
          // Check locked status respecting admin override
          const isLocked = m.status === 'locked' && !isAdminUnlockEnabled;
          if (!isLocked) {
             handleModuleClick(m.id, m.iconType, m.status);
          }
      }
  };

  useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, modules, isAdminUnlockEnabled]);


  const getIcon = (type: string, size = 24) => {
    switch(type) {
      case 'video': return <Video size={size} />;
      case 'quiz': return <Star size={size} />;
      case 'trophy': return <Trophy size={size} />;
      default: return <BookOpen size={size} />;
    }
  };

  // Render a single card in the stack
  const renderCard = (module: CertModule, index: number) => {
      const offset = index - activeIndex;
      const isActive = index === activeIndex;
      const isLocked = module.status === 'locked' && !isAdminUnlockEnabled;
      const isCompleted = module.status === 'completed';
      
      // Visual config based on state (BVSA Colors: Red/Navy/White)
      let borderColor = 'border-gray-700';
      let bgColor = 'bg-gray-900';
      let shadowColor = 'shadow-none';
      let textColor = 'text-gray-500';
      let iconColor = 'text-gray-600';
      let badgeStyle = 'border-gray-700 text-gray-500 bg-gray-800';
      let buttonStyle = 'bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed';

      if (isCompleted) {
          borderColor = 'border-gray-500';
          bgColor = 'bg-gray-800';
          shadowColor = 'shadow-[0_0_30px_rgba(100,116,139,0.3)]';
          textColor = 'text-gray-400';
          iconColor = 'text-green-500';
          badgeStyle = 'border-green-900/30 bg-green-900/20 text-green-500';
          buttonStyle = 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600';
      } else if (isActive && !isLocked) {
          // BVSA Active State
          borderColor = 'border-red-600';
          bgColor = 'bg-[#0f172a]'; // Slate 900
          shadowColor = 'shadow-[0_0_50px_rgba(220,38,38,0.4)]'; // Strong Red Glow
          textColor = 'text-red-500';
          iconColor = 'text-red-500';
          badgeStyle = 'border-red-500 bg-red-500/10 text-red-500';
          buttonStyle = 'bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500 hover:scale-[1.02] active:scale-95 hover:shadow-red-600/50';
      } else if (isLocked) {
          borderColor = 'border-gray-800';
          bgColor = 'bg-black/80';
          textColor = 'text-gray-700';
          iconColor = 'text-gray-800';
      }

      // Special Styling for the Final Certificate Module
      if (module.id === 'cert-completion') {
          if (!isLocked) {
              borderColor = 'border-yellow-500';
              iconColor = 'text-yellow-500';
              shadowColor = 'shadow-[0_0_60px_rgba(234,179,8,0.3)]';
              buttonStyle = 'bg-yellow-500 text-black border-yellow-400 hover:bg-yellow-400';
          }
      }

      // 3D Transform Logic
      if (Math.abs(offset) > 2) return null;

      const xOffset = offset * 220; // Spacing
      const zOffset = Math.abs(offset) * -100; // Depth
      const scale = 1 - Math.abs(offset) * 0.15;
      const opacity = 1 - Math.abs(offset) * 0.3;
      const rotateY = offset * 25; // Rotation effect

      return (
          <motion.div
              key={module.id}
              initial={false}
              animate={{
                  x: xOffset,
                  z: zOffset,
                  scale: scale,
                  opacity: opacity,
                  rotateY: rotateY,
                  zIndex: 10 - Math.abs(offset)
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={() => {
                  // Click anywhere on card centers it
                  setActiveIndex(index);
              }}
              className={`
                  absolute w-[280px] h-[420px] rounded-3xl border-4 ${borderColor} ${bgColor} ${shadowColor}
                  flex flex-col items-center justify-between p-6 cursor-pointer backdrop-blur-md select-none
                  transform-style-3d transition-colors duration-300
              `}
              style={{ left: 'calc(50% - 140px)', top: 'calc(50% - 210px)' }}
          >
              {/* Header Badge */}
              <div className="w-full flex justify-between items-center">
                  <div className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border-2 ${badgeStyle}`}>
                      {module.id === 'cert-completion' ? 'FINAL' : `Module ${index + 1}`}
                  </div>
                  {isCompleted ? (
                      <Check className="text-green-500" size={20} />
                  ) : isLocked ? (
                      <Lock className="text-gray-700" size={20} />
                  ) : (
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]" />
                  )}
              </div>

              {/* Main Icon/Art */}
              <div className="flex-1 flex items-center justify-center relative w-full">
                  <div className={`absolute inset-0 opacity-10 bg-[radial-gradient(circle,_${isCompleted?'#22c55e': isActive && !isLocked ? '#ef4444' : '#334155'}_0%,_transparent_70%)]`}></div>
                  
                  <motion.div 
                    animate={isActive && offset === 0 ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                    transition={{ duration: 4, repeat: Infinity }}
                    className={`w-32 h-32 rounded-full border-4 ${borderColor} flex items-center justify-center relative z-10 ${iconColor} ${isLocked ? 'opacity-20' : 'opacity-100'}`}
                  >
                      {getIcon(module.iconType, 64)}
                  </motion.div>
              </div>

              {/* Info Footer */}
              <div className="w-full text-center">
                  <h3 className={`text-2xl font-black uppercase italic tracking-tighter mb-2 ${isLocked ? 'text-gray-700' : 'text-white'}`}>
                      {module.title}
                  </h3>
                  
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-black/40 rounded-lg p-2 border border-white/5">
                          <div className="text-[9px] text-gray-500 uppercase font-bold">Type</div>
                          <div className={`text-xs font-extrabold uppercase ${textColor}`}>{module.iconType}</div>
                      </div>
                      <div className="bg-black/40 rounded-lg p-2 border border-white/5">
                          <div className="text-[9px] text-gray-500 uppercase font-bold">Reward</div>
                          <div className={`text-xs font-extrabold uppercase ${isLocked ? 'text-gray-600' : 'text-yellow-400'}`}>
                              +{module.xpReward} XP
                          </div>
                      </div>
                  </div>

                  {/* Interactive Deploy Button */}
                  <button 
                      onClick={(e) => {
                          e.stopPropagation(); // Prevent card centering logic from firing again
                          if (offset === 0) {
                              handleModuleClick(module.id, module.iconType, module.status);
                          } else {
                              setActiveIndex(index); // If they click the button on a side card, just center it
                          }
                      }}
                      disabled={isLocked}
                      className={`w-full py-4 rounded-2xl font-black uppercase text-base tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl border-2 ${buttonStyle}`}
                  >
                      {isLocked ? (
                          <><Lock size={16} /> LOCKED</>
                      ) : isCompleted ? (
                          <><Check size={16} /> COMPLETED</>
                      ) : module.id === 'cert-completion' ? (
                          <><Trophy size={18} fill="currentColor" /> CLAIM</>
                      ) : (
                          <><Zap size={18} fill="currentColor" /> DEPLOY</>
                      )}
                  </button>
              </div>

              {/* Scanlines Overlay */}
              <div className="absolute inset-0 rounded-3xl bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none mix-blend-overlay"></div>
              <div className="absolute inset-0 rounded-3xl border-t border-white/10 pointer-events-none"></div>
          </motion.div>
      );
  };

  const isModalOpen = showQuiz || showVideo;

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[calc(100vh-120px)] flex flex-col bg-[#0a0a0a] rounded-[3rem] overflow-hidden border-4 border-[#1f2937] shadow-2xl">
      
      {/* XP & Notification Layer */}
      <AnimatePresence>
        {pointDelta && (
            <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1.5 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[200] pointer-events-none"
            >
                <div className="text-8xl font-black text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.8)] flex items-center gap-4 italic">
                    <Trophy size={100} strokeWidth={3} /> 
                    <span>+{pointDelta}</span>
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

      {!isModalOpen && (
        <>
          {/* Top Bar: Stats */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-lg pointer-events-auto">
                  <div>
                      <h1 className="text-white font-black uppercase italic text-xl tracking-tighter leading-none">Pathway 2</h1>
                      <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1">Advanced Tactics</div>
                  </div>
                  <div className="h-8 w-px bg-white/20"></div>
                  <div className="flex flex-col">
                      <span className="text-[9px] text-gray-400 font-bold uppercase">Progress</span>
                      <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-red-600" 
                                style={{ width: `${(modules.filter(m => m.status === 'completed').length / modules.length) * 100}%` }} 
                              />
                          </div>
                          <span className="text-xs font-bold text-white">
                              {Math.round((modules.filter(m => m.status === 'completed').length / modules.length) * 100)}%
                          </span>
                      </div>
                  </div>
              </div>

              <div className="bg-black/60 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-lg pointer-events-auto">
                  <div className="text-right">
                      <div className="text-[9px] text-gray-400 font-bold uppercase">Current XP</div>
                      <div className="text-xl font-mono font-black text-white leading-none">{userXP.toLocaleString()}</div>
                  </div>
                  <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                      <Zap size={24} fill="currentColor" />
                  </div>
              </div>
          </div>

          {/* Middle: 3D Carousel */}
          <div className="flex-1 relative flex items-center justify-center perspective-1000">
              {/* Background Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] pointer-events-none"></div>

              <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
                  <AnimatePresence>
                      {modules.map((module, index) => renderCard(module, index))}
                  </AnimatePresence>
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={prevCard}
                disabled={activeIndex === 0}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 hover:bg-red-600 text-white border-2 border-white/10 hover:border-red-500 backdrop-blur-md transition-all disabled:opacity-0 disabled:cursor-not-allowed z-30 group flex items-center justify-center hover:scale-110 shadow-lg"
              >
                  <ChevronLeft size={40} className="group-hover:-translate-x-1 transition-transform" strokeWidth={4} />
              </button>
              <button 
                onClick={nextCard}
                disabled={activeIndex === modules.length - 1}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 hover:bg-red-600 text-white border-2 border-white/10 hover:border-red-500 backdrop-blur-md transition-all disabled:opacity-0 disabled:cursor-not-allowed z-30 group flex items-center justify-center hover:scale-110 shadow-lg"
              >
                  <ChevronRight size={40} className="group-hover:translate-x-1 transition-transform" strokeWidth={4} />
              </button>
          </div>

          {/* Bottom Bar: Description / Loadout Info */}
          <div className="h-32 bg-black/80 border-t border-white/10 backdrop-blur-xl p-6 flex items-center justify-between z-30">
              <div className="max-w-2xl">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      <Activity size={18} className="text-red-500" /> 
                      MISSION BRIEFING: {modules[activeIndex].title}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1 font-medium leading-relaxed">
                      {modules[activeIndex].description}
                  </p>
              </div>
              
              <div className="hidden md:flex gap-4">
                  <div className="flex flex-col items-center px-4 border-r border-white/10">
                      <span className="text-[10px] text-gray-500 uppercase font-bold">Difficulty</span>
                      <span className="text-white font-black uppercase italic">Elite</span>
                  </div>
                  <div className="flex flex-col items-center px-4 border-r border-white/10">
                      <span className="text-[10px] text-gray-500 uppercase font-bold">Est. Time</span>
                      <span className="text-white font-black uppercase italic">15 Min</span>
                  </div>
                  <div className="flex flex-col items-center px-4">
                      <span className="text-[10px] text-gray-500 uppercase font-bold">Requirements</span>
                      <span className="text-white font-black uppercase italic">Lvl 5+</span>
                  </div>
              </div>
          </div>
        </>
      )}

    </div>
  );
};
