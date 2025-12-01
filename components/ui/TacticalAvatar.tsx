import React from 'react';
import { motion } from 'framer-motion';

interface TacticalAvatarProps {
  integrity: number; // 0 - 100
  size?: 'sm' | 'md' | 'lg' | 'xl';
  initials: string;
}

export const TacticalAvatar: React.FC<TacticalAvatarProps> = ({ integrity, size = 'md', initials }) => {
  // State Logic
  const isCritical = integrity < 30;
  const isDecaying = integrity < 70 && integrity >= 30;
  const isOptimal = integrity >= 70;

  // Size classes
  const sizeClasses = {
    sm: "w-10 h-10 text-xs",
    md: "w-16 h-16 text-lg",
    lg: "w-24 h-24 text-2xl",
    xl: "w-40 h-40 text-4xl"
  };

  // Dynamic Colors based on integrity
  const borderColor = isCritical ? 'border-tactical-red' : isDecaying ? 'border-tactical-yellow' : 'border-tactical-green';
  const glowColor = isCritical ? 'shadow-[0_0_15px_rgba(239,68,68,0.6)]' : isDecaying ? 'shadow-[0_0_10px_rgba(234,179,8,0.4)]' : 'shadow-[0_0_15px_rgba(16,185,129,0.4)]';
  const bgColor = isCritical ? 'bg-red-900/20' : isDecaying ? 'bg-yellow-900/20' : 'bg-emerald-900/20';
  const textColor = isCritical ? 'text-tactical-red' : isDecaying ? 'text-tactical-yellow' : 'text-tactical-green';

  return (
    <div className="relative inline-block">
      <motion.div
        className={`${sizeClasses[size]} rounded-none ${bgColor} border-2 ${borderColor} ${glowColor} flex items-center justify-center font-mono font-bold ${textColor} relative overflow-hidden`}
        animate={isCritical ? {
            x: [0, -2, 2, -1, 0],
            opacity: [1, 0.8, 1],
        } : {}}
        transition={isCritical ? {
            repeat: Infinity,
            duration: 2,
            ease: "linear"
        } : {}}
      >
        {/* Scanline Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 animate-pulse"></div>

        {/* Initials */}
        <span className="relative z-10">{initials}</span>

        {/* Rot Overlays (Cracks/Rust representation) */}
        {isDecaying && (
            <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" viewBox="0 0 100 100">
                <path d="M10,10 L30,30 M80,80 L60,60" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
        )}
        {isCritical && (
            <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none text-tactical-red" viewBox="0 0 100 100">
                 <path d="M0,0 L40,40 M100,0 L70,30 M50,50 L55,80 M20,90 L40,70" stroke="currentColor" strokeWidth="2" fill="none" />
                 <rect x="0" y="0" width="100" height="100" fill="transparent" stroke="currentColor" strokeWidth="5" strokeDasharray="10 5" opacity="0.3" />
            </svg>
        )}
      </motion.div>

      {/* Health Bar Indicator underneath */}
      <div className="absolute -bottom-3 left-0 w-full h-1 bg-tactical-surface">
          <div 
            className={`h-full ${isCritical ? 'bg-tactical-red' : isOptimal ? 'bg-tactical-green' : 'bg-tactical-yellow'}`} 
            style={{ width: `${integrity}%` }}
          />
      </div>
    </div>
  );
};