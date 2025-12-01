
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Shield, ArrowUp, ArrowDown, Minus, Medal, Crown } from 'lucide-react';
import { LEAGUE_STANDINGS } from '../../constants';
import { LeagueParticipant } from '../../types';

interface LeagueModalProps {
  onClose: () => void;
  userXP: number;
}

type LeagueTier = 'rec' | 'organized' | 'affiliate' | 'pro';

const LEAGUES: { id: LeagueTier; name: string; color: string; iconColor: string; xpRange: [number, number] }[] = [
  { id: 'rec', name: 'Rec Ball', color: 'border-orange-700', iconColor: 'text-orange-700', xpRange: [500, 1000] },
  { id: 'organized', name: 'Organized Ball', color: 'border-gray-400', iconColor: 'text-gray-400', xpRange: [1000, 1800] },
  { id: 'affiliate', name: 'Affiliate Ball', color: 'border-yellow-500', iconColor: 'text-yellow-500', xpRange: [1800, 2500] },
  { id: 'pro', name: 'Pro Ball', color: 'border-cyan-400', iconColor: 'text-cyan-400', xpRange: [3000, 5000] },
];

// Helper to generate consistent fake data for other leagues
const generateMockStandings = (leagueId: LeagueTier): LeagueParticipant[] => {
    const league = LEAGUES.find(l => l.id === leagueId)!;
    const count = 15;
    const baseXP = league.xpRange[1];
    
    return Array.from({ length: count }).map((_, i) => ({
        rank: i + 1,
        name: `${league.name.split(' ')[0]} Athlete ${i + 1}`,
        xp: Math.floor(baseXP - (i * (baseXP - league.xpRange[0]) / count)),
        avatar: String.fromCharCode(65 + i) + String.fromCharCode(65 + i), // AA, BB, etc.
        isCurrentUser: false,
        trend: i % 3 === 0 ? 'up' : i % 2 === 0 ? 'down' : 'same'
    }));
};

export const LeagueModal: React.FC<LeagueModalProps> = ({ onClose, userXP }) => {
  // Default to 'affiliate' assuming that's where the user is based on previous context (Gold)
  const [activeLeague, setActiveLeague] = useState<LeagueTier>('affiliate');
  
  // Prepare standings based on active league
  const currentStandings = useMemo(() => {
      if (activeLeague === 'affiliate') {
          // Use real data + user injection for their current league
          return LEAGUE_STANDINGS.map(p => {
              if (p.isCurrentUser) {
                  return { ...p, xp: userXP };
              }
              return p;
          }).sort((a, b) => b.xp - a.xp)
            .map((p, index) => ({ ...p, rank: index + 1 }));
      } else {
          // Use mock data for other leagues
          return generateMockStandings(activeLeague);
      }
  }, [activeLeague, userXP]);

  const topThree = currentStandings.slice(0, 3);
  const middlePack = currentStandings.slice(3, 12);
  const bottomThree = currentStandings.slice(12);

  const renderParticipant = (p: LeagueParticipant) => (
    <div 
      key={p.name}
      className={`flex items-center justify-between p-3 rounded-xl transition-all border-2 ${
        p.isCurrentUser 
        ? 'bg-duo-green/10 border-duo-green shadow-sm' 
        : 'bg-transparent border-transparent hover:bg-duo-gray-100'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-8 text-center font-extrabold ${
           p.rank <= 3 ? 'text-duo-yellow' : p.rank > 12 ? 'text-duo-red' : 'text-duo-gray-400'
        }`}>
            {p.rank}
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold border-2 ${
            p.isCurrentUser ? 'bg-duo-green text-white border-duo-green' : 'bg-duo-gray-200 text-duo-gray-500 border-duo-gray-300'
        }`}>
            {p.avatar}
        </div>
        <div>
             <div className={`font-extrabold ${p.isCurrentUser ? 'text-duo-green' : 'text-duo-gray-800'}`}>
                 {p.name} {p.isCurrentUser && "(You)"}
             </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
          <span className="font-bold text-duo-gray-500">{p.xp.toLocaleString()} XP</span>
          {p.trend === 'up' && <ArrowUp size={16} className="text-duo-green" />}
          {p.trend === 'down' && <ArrowDown size={16} className="text-duo-red" />}
          {p.trend === 'same' && <Minus size={16} className="text-duo-gray-300" />}
      </div>
    </div>
  );

  const activeLeagueData = LEAGUES.find(l => l.id === activeLeague)!;
  const userIsInThisLeague = activeLeague === 'affiliate'; // Hardcoded for demo
  const currentUserRank = userIsInThisLeague ? currentStandings.find(p => p.isCurrentUser)?.rank || 0 : 0;

  let footerText = "";
  let footerColor = "text-duo-gray-500";

  if (userIsInThisLeague) {
      if (currentUserRank <= 3) {
          footerText = `Promotion Zone! Rank #${currentUserRank}`;
          footerColor = "text-duo-yellow";
      } else if (currentUserRank > 12) {
          footerText = `Demotion Zone. Rank #${currentUserRank}`;
          footerColor = "text-duo-red";
      } else {
          footerText = `Safe Zone. Rank #${currentUserRank}`;
          footerColor = "text-duo-gray-800";
      }
  } else {
      footerText = `Viewing ${activeLeagueData.name}`;
  }

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
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
      >
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-duo-gray-400 hover:text-duo-gray-800 hover:bg-duo-gray-200/80 rounded-full p-1 transition-colors z-[60] bg-white/50 backdrop-blur-sm"
        >
            <X size={24} />
        </button>

        {/* Header with League Toggle */}
        <div className="bg-duo-gray-100 p-6 pb-4 text-center relative overflow-hidden border-b-2 border-duo-gray-200">
            <div className="relative z-10 flex flex-col items-center">
                
                {/* League Icons Row */}
                <div className="flex items-center justify-center gap-2 mb-6 w-full overflow-x-auto no-scrollbar px-4">
                    {LEAGUES.map((league) => {
                        const isActive = activeLeague === league.id;
                        return (
                            <button
                                key={league.id}
                                onClick={() => setActiveLeague(league.id)}
                                className={`
                                    flex flex-col items-center justify-center transition-all duration-300 relative
                                    ${isActive ? 'scale-110 z-10' : 'scale-90 opacity-50 hover:opacity-80'}
                                `}
                            >
                                <div className={`
                                    w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border-4 shadow-sm mb-1 transition-all
                                    ${isActive ? `bg-white ${league.color} shadow-lg` : 'bg-gray-200 border-gray-300'}
                                `}>
                                    {league.id === 'pro' ? (
                                        <Crown size={24} className={isActive ? league.iconColor : 'text-gray-400'} fill="currentColor" />
                                    ) : league.id === 'affiliate' ? (
                                        <Trophy size={24} className={isActive ? league.iconColor : 'text-gray-400'} fill="currentColor" />
                                    ) : (
                                        <Medal size={24} className={isActive ? league.iconColor : 'text-gray-400'} fill="currentColor" />
                                    )}
                                </div>
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeIndicator"
                                        className={`h-1 w-8 rounded-full mt-1 ${league.iconColor.replace('text-', 'bg-')}`}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeLeague}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-center"
                    >
                        <h2 className="text-2xl font-extrabold text-duo-gray-800 uppercase tracking-wide leading-none">
                            {activeLeagueData.name}
                        </h2>
                        <div className="flex items-center justify-center gap-2 mt-2">
                             {userIsInThisLeague ? (
                                 <div className="flex items-center gap-2 text-duo-gray-500 text-xs font-bold uppercase bg-white px-3 py-1.5 rounded-xl border-2 border-duo-gray-200">
                                     <Shield size={12} /> 4 Days Remaining
                                 </div>
                             ) : (
                                 <div className="flex items-center gap-2 text-duo-gray-400 text-xs font-bold uppercase">
                                     Global Standings
                                 </div>
                             )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white">
             <AnimatePresence mode='wait'>
                 <motion.div
                    key={activeLeague}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                 >
                     {/* Promotion Zone */}
                     <div className="mb-2">
                        <div className="text-xs font-extrabold text-duo-gray-400 uppercase mb-2 flex items-center gap-2 px-2">
                            <ArrowUp size={14} className="text-duo-yellow" /> Promotion Zone
                        </div>
                        <div className="space-y-1 bg-duo-yellow/5 rounded-2xl p-1 border-2 border-duo-yellow/20">
                            {topThree.map((p) => renderParticipant(p))}
                        </div>
                     </div>

                     <div className="h-2"></div>

                     {/* Safe Zone */}
                     <div className="space-y-1">
                        {middlePack.map((p) => renderParticipant(p))}
                     </div>

                     <div className="h-2"></div>

                     {/* Demotion Zone */}
                     <div className="mt-2">
                        <div className="text-xs font-extrabold text-duo-gray-400 uppercase mb-2 flex items-center gap-2 px-2">
                            <ArrowDown size={14} className="text-duo-red" /> Demotion Zone
                        </div>
                        <div className="space-y-1 bg-duo-red/5 rounded-2xl p-1 border-2 border-duo-red/20">
                            {bottomThree.map((p) => renderParticipant(p))}
                        </div>
                     </div>
                 </motion.div>
             </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-duo-gray-200 bg-duo-gray-50 text-center">
            <p className="text-sm font-bold text-duo-gray-500">
                <span className={`font-extrabold ${footerColor}`}>{footerText}</span>
            </p>
        </div>

      </motion.div>
    </div>
  );
};
