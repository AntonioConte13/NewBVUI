
import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Clock, Bell, Calendar } from 'lucide-react';
import { TacticalButton } from './ui/TacticalButton';

interface ComingSoonProps {
  featureName?: string;
  description?: string;
  icon?: React.ReactNode | string;
  estimatedLaunch?: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ 
  featureName = "Module Locked", 
  description = "This tactical directive is currently in R&D. Access is restricted until deployment phase is complete.",
  icon,
  estimatedLaunch
}) => {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white border-2 border-duo-gray-200 rounded-3xl p-8 shadow-xl relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-duo-gray-100 rounded-full flex items-center justify-center mb-6 border-4 border-duo-gray-200 relative">
            {icon ? (
              typeof icon === 'string' ? <span className="text-4xl">{icon}</span> : icon
            ) : (
              <Lock size={48} className="text-duo-gray-400" />
            )}
            
            <div className="absolute -bottom-2 -right-2 bg-duo-yellow text-white p-2 rounded-full border-4 border-white shadow-sm">
                <Clock size={20} />
            </div>
          </div>
          
          <h2 className="text-3xl font-extrabold text-duo-gray-800 uppercase mb-2 tracking-tight">
            {featureName}
          </h2>
          
          <div className="flex flex-col gap-2 items-center mb-6">
            <div className="inline-block px-3 py-1 bg-duo-gray-100 rounded-lg text-xs font-bold text-duo-gray-500 uppercase tracking-widest border border-duo-gray-200">
              Coming Soon
            </div>
            {estimatedLaunch && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-duo-blue">
                <Calendar size={12} />
                <span>Target Launch: {estimatedLaunch}</span>
              </div>
            )}
          </div>
          
          <p className="text-duo-gray-500 font-medium mb-8 leading-relaxed">
            {description}
          </p>
          
          <TacticalButton icon={<Bell size={18} />} fullWidth>
            Notify When Ready
          </TacticalButton>
        </div>
      </motion.div>
    </div>
  );
};
