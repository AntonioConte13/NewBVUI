import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, Snowflake, Calendar, Flame, Trophy, Crown } from 'lucide-react';
import { TacticalButton } from '../ui/TacticalButton';

interface StreakModalProps {
  onClose: () => void;
}

interface DayStatus {
  day: string;
  status: 'hit' | 'miss' | 'freeze' | 'future';
  isToday: boolean;
}

const WEEK_DATA: DayStatus[] = [
  { day: 'M', status: 'hit', isToday: false },
  { day: 'T', status: 'hit', isToday: false },
  { day: 'W', status: 'freeze', isToday: false },
  { day: 'T', status: 'hit', isToday: false },
  { day: 'F', status: 'hit', isToday: false },
  { day: 'S', status: 'hit', isToday: true }, 
  { day: 'S', status: 'future', isToday: false },
];

export const StreakModal: React.FC<StreakModalProps> = ({ onClose }) => {
  // Mock Data to demonstrate Record Breaking state
  const currentStreak = 12;
  const lifetimeBest = 12; // Logic: If current >= lifetime, we are setting a record
  const isNewRecord = currentStreak >= lifetimeBest;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header - Dynamic based on Record Status */}
        <div className={`${isNewRecord ? 'bg-yellow-500' : 'bg-duo-red'} p-8 text-center relative overflow-hidden transition-colors duration-500`}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            {/* Confetti/Sparkle Overlay for Records */}
            {isNewRecord && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.4)_0%,_transparent_70%)] animate-pulse"></div>
            )}

            <button 
                onClick={onClose}
                className={`absolute top-4 right-4 rounded-full p-1 transition-colors z-10 ${isNewRecord ? 'text-yellow-900 hover:bg-yellow-600/20' : 'text-red-200 hover:text-white hover:bg-white/20'}`}
            >
                <X size={24} />
            </button>

            <div className="relative z-10 flex flex-col items-center">
                <div className="relative">
                    <motion.div 
                        animate={isNewRecord ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : { scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: isNewRecord ? 0.8 : 2, ease: "easeInOut" }}
                        className={`w-24 h-24 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border-4 shadow-lg ${
                            isNewRecord ? 'bg-white/30 border-white/60 text-white' : 'bg-white/20 border-white/30 text-white'
                        }`}
                    >
                        {isNewRecord ? (
                            <Crown size={48} className="drop-shadow-md" fill="currentColor" />
                        ) : (
                            <Flame size={48} className="drop-shadow-md" fill="currentColor" />
                        )}
                    </motion.div>
                    
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-xl text-xs font-extrabold uppercase shadow-md border-2 rotate-12 whitespace-nowrap ${
                            isNewRecord ? 'bg-white text-yellow-600 border-yellow-400' : 'bg-white text-duo-red border-duo-red'
                        }`}
                    >
                        {isNewRecord ? 'New Record!' : 'On Fire!'}
                    </motion.div>
                </div>
                
                <h2 className="text-5xl font-black text-white tracking-tight mb-1 drop-shadow-sm">{currentStreak}</h2>
                <h3 className={`text-lg font-extrabold uppercase tracking-widest ${isNewRecord ? 'text-yellow-900 opacity-80' : 'text-red-100'}`}>Day Streak</h3>
            </div>
        </div>

        {/* Body */}
        <div className="p-6 bg-white">
            
            <div className="text-center mb-8">
                <p className="text-duo-gray-500 font-bold text-sm">
                    {isNewRecord 
                        ? "You're rewriting history! Keep pushing to extend your record." 
                        : "You're crushing it! Practice tomorrow to keep the flame alive."
                    }
                </p>
            </div>

            {/* Calendar Row */}
            <div className="bg-duo-gray-50 border-2 border-duo-gray-200 rounded-2xl p-4 mb-6">
                <div className="flex justify-between items-center">
                    {WEEK_DATA.map((day, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2">
                            <span className={`text-xs font-extrabold uppercase ${day.isToday ? (isNewRecord ? 'text-yellow-600' : 'text-duo-red') : 'text-duo-gray-400'}`}>
                                {day.day}
                            </span>
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                day.status === 'hit' 
                                    ? isNewRecord ? 'bg-yellow-500 border-yellow-500 text-white' : 'bg-duo-red border-duo-red text-white' 
                                    : day.status === 'freeze' ? 'bg-blue-100 border-blue-300 text-blue-500' 
                                    : 'bg-transparent border-duo-gray-200 text-transparent'
                            } ${day.isToday && day.status !== 'hit' ? 'ring-4 ring-duo-gray-200' : ''}`}>
                                {day.status === 'hit' && <Check size={20} strokeWidth={4} />}
                                {day.status === 'freeze' && <Snowflake size={20} />}
                                {day.status === 'future' && <div className="w-2 h-2 rounded-full bg-duo-gray-200"></div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Grid - Updated to show Lifetime Best */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Total Days */}
                <div className="bg-white border-2 border-duo-gray-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
                    <div className="w-10 h-10 bg-duo-gray-100 rounded-lg flex items-center justify-center text-duo-gray-500">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <div className="text-lg font-extrabold text-duo-gray-800">142</div>
                        <div className="text-[10px] font-bold text-duo-gray-400 uppercase">Total Days</div>
                    </div>
                </div>

                {/* Lifetime Best - Highlighted if record */}
                <div className={`bg-white border-2 rounded-xl p-4 flex items-center gap-3 shadow-sm transition-colors ${isNewRecord ? 'border-yellow-400 bg-yellow-50' : 'border-duo-gray-200'}`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isNewRecord ? 'bg-yellow-200 text-yellow-700' : 'bg-duo-gray-100 text-duo-gray-500'}`}>
                        <Trophy size={20} />
                    </div>
                    <div>
                        <div className={`text-lg font-extrabold ${isNewRecord ? 'text-yellow-700' : 'text-duo-gray-800'}`}>{lifetimeBest}</div>
                        <div className={`text-[10px] font-bold uppercase ${isNewRecord ? 'text-yellow-600' : 'text-duo-gray-400'}`}>Lifetime Best</div>
                    </div>
                </div>
            </div>

            <TacticalButton fullWidth onClick={onClose}>
                Continue
            </TacticalButton>
        </div>

      </motion.div>
    </div>
  );
};