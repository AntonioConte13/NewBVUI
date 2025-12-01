import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { TacticalButton } from './TacticalButton';

export const FocusTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<'FOCUS' | 'BREAK'>('FOCUS');
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (sessionType === 'FOCUS') {
          setStreak(s => s + 1);
          // Here we would trigger an "Integrity Boost"
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, sessionType]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
    setSessionType('FOCUS');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="bg-tactical-card border border-tactical-border p-6 rounded-none relative overflow-hidden">
      {/* Background Pulse for "Active" state */}
      {isActive && (
          <div className="absolute inset-0 bg-tactical-red/5 animate-pulse pointer-events-none"></div>
      )}

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
            <h3 className="text-tactical-red font-display font-bold uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={16} />
                Focus Protocol
            </h3>
            <div className="text-xs font-mono text-tactical-text-secondary">
                Streak: <span className="text-tactical-green">{streak}</span> Cycles
            </div>
        </div>
        <div className="px-2 py-1 border border-tactical-border text-xs font-mono text-tactical-text-muted">
            {sessionType}
        </div>
      </div>

      <div className="text-5xl font-mono font-bold text-white text-center py-6 tracking-widest relative z-10">
        {formatTime(timeLeft)}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-tactical-surface mb-6 relative z-10">
        <div 
            className={`h-full ${isActive ? 'bg-tactical-red shadow-[0_0_10px_#ef4444]' : 'bg-tactical-border'}`} 
            style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex gap-2 relative z-10">
        <TacticalButton 
            fullWidth 
            onClick={toggleTimer} 
            variant={isActive ? 'danger' : 'primary'}
            className={isActive ? "animate-pulse" : ""}
        >
            {isActive ? <Pause size={16} /> : <Play size={16} />}
            {isActive ? 'HALT' : 'ENGAGE'}
        </TacticalButton>
        <button 
            onClick={resetTimer}
            className="px-4 border border-tactical-border hover:bg-tactical-surface text-tactical-text-secondary transition-colors"
        >
            <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
};