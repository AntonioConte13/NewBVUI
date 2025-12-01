
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Play, FileText, Trophy, CheckCircle, Clock } from 'lucide-react';
import { TacticalButton } from '../ui/TacticalButton';

interface VideoModuleModalProps {
  onClose: () => void;
  onComplete: () => void;
}

export const VideoModuleModal: React.FC<VideoModuleModalProps> = ({ onClose, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Simulate video progress
  useEffect(() => {
    let interval: any;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress(p => {
          const next = p + 0.5;
          if (next >= 100) {
            setIsCompleted(true);
            return 100;
          }
          return next;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b-2 border-duo-gray-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-duo-gray-800">Energy Systems Protocol</h2>
            <p className="text-xs font-bold text-duo-gray-400 uppercase">Unit 2: Physiological Foundations</p>
          </div>
          <button onClick={onClose} className="text-duo-gray-400 hover:bg-duo-gray-100 rounded-full p-2 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-duo-gray-50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                {/* Video Section */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="aspect-video bg-black rounded-2xl relative overflow-hidden shadow-lg group">
                        <video 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                            poster="https://placehold.co/600x400/111827/DC2626?text=Energy+Systems"
                        />
                         {!isPlaying && (
                             <div className="absolute inset-0 flex items-center justify-center">
                                 <button 
                                    onClick={() => setIsPlaying(true)}
                                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white hover:scale-110 transition-transform shadow-xl"
                                 >
                                     <Play size={32} className="text-white ml-1" fill="currentColor" />
                                 </button>
                             </div>
                         )}
                         
                         {/* Progress Bar */}
                         <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-800/50">
                             <div className="h-full bg-duo-red transition-all duration-100 relative" style={{ width: `${progress}%` }}>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm scale-0 group-hover:scale-100 transition-transform"></div>
                             </div>
                         </div>

                         {/* Overlay Info */}
                         <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-mono border border-white/10 flex items-center gap-2">
                             <Clock size={12} />
                             04:12
                         </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border-2 border-duo-gray-200">
                        <h3 className="text-lg font-extrabold text-duo-gray-800 mb-2">Tactical Briefing</h3>
                        <p className="text-duo-gray-500 text-sm leading-relaxed font-medium">
                            Understanding the three primary energy systems (ATP-PC, Glycolytic, and Oxidative) is crucial for designing effective conditioning programs. 
                            Baseball is primarily an ATP-PC sport with alactic power bursts, yet aerobic capacity aids in recovery between explosive bouts.
                        </p>
                    </div>
                </div>

                {/* Sidebar: Key Concepts */}
                <div className="space-y-4">
                    <div className="bg-white p-5 rounded-2xl border-2 border-duo-gray-200">
                        <h3 className="text-xs font-extrabold text-duo-gray-400 uppercase mb-4 flex items-center gap-2">
                            <FileText size={14} /> Key Concepts
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "ATP-PC System (0-10s)",
                                "Glycolytic System (10s-2min)",
                                "Oxidative System (2min+)",
                                "Work-to-Rest Ratios",
                                "Baseball Specific Demands"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-bold text-duo-gray-700">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 transition-colors ${progress > (i+1)*18 ? 'bg-duo-green text-white' : 'bg-duo-blue/10 text-duo-blue'}`}>
                                        {progress > (i+1)*18 ? <CheckCircle size={14} /> : i + 1}
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                     <div className="bg-duo-yellow/10 p-5 rounded-2xl border-2 border-duo-yellow/30 relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 text-duo-yellow/20 rotate-12">
                            <Trophy size={100} />
                        </div>
                        <h3 className="text-xs font-extrabold text-duo-yellowDark uppercase mb-2 flex items-center gap-2 relative z-10">
                            <Trophy size={14} /> Completion Reward
                        </h3>
                        <div className="text-2xl font-extrabold text-duo-gray-800 relative z-10">250 XP</div>
                        <div className="text-xs font-bold text-duo-gray-500 relative z-10">Upon finishing video</div>
                     </div>
                </div>
            </div>
        </div>

        <div className="p-6 border-t-2 border-duo-gray-100 bg-white flex justify-end gap-4 shrink-0">
            <TacticalButton variant="secondary" onClick={onClose}>
                Save Progress
            </TacticalButton>
            <TacticalButton 
                onClick={onComplete}
                disabled={!isCompleted}
                className={!isCompleted ? "opacity-50 cursor-not-allowed" : ""}
            >
                Complete Module
            </TacticalButton>
        </div>

      </motion.div>
    </div>
  );
};
