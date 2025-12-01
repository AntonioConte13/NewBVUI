import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Shield, ArrowUp, ArrowDown, Minus, Crown, Medal, Clock, AlertCircle, Star } from 'lucide-react';
import { LEAGUE_STANDINGS } from '../../constants';
import { LeagueParticipant } from '../../types';

interface LeaderboardsProps {
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
    const count = 25;
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

export const Leaderboards: React.FC<LeaderboardsProps> = ({ userXP }) => {
  const [activeLeague, setActiveLeague] = useState<LeagueTier>('affiliate');

  // Prepare standings based on active league
  const currentStandings = useMemo(() => {
      if (activeLeague === 'affiliate') {
          // Use real data + user injection for their current league
          const sorted = LEAGUE_STANDINGS.map(p => {
              if (p.isCurrentUser) {
                  return { ...p, xp: userXP };
              }
              return p;
          }).sort((a, b) => b.xp - a.xp)
            .map((p, index) => ({ ...p, rank: index + 1 }));
          return sorted;
      } else {
          // Use mock data for other leagues
          return generateMockStandings(activeLeague);
      }
  }, [activeLeague, userXP]);

  // Separation for Podium
  const topThree = currentStandings.slice(0, 3);
  // Podium Order: 2nd (left), 1st (center), 3rd (right)
  const podiumItems = [topThree[1], topThree[0], topThree[2]].filter(Boolean);
  
  const restOfPack = currentStandings.slice(3, currentStandings.length - 3);
  const bottomThree = currentStandings.slice(currentStandings.length - 3);

  const activeLeagueData = LEAGUES.find(l => l.id === activeLeague)!;
  
  const renderParticipant = (p: LeagueParticipant, zone: 'safe' | 'danger') => (
    <motion.div 
      key={p.name}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all mb-2 ${
        p.isCurrentUser 
        ? 'bg-duo-green/10 border-duo-green shadow-md z-10 relative scale-[1.02]' 
        : 'bg-white border-duo-gray-100 hover:border-duo-gray-200'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-8 text-center font-extrabold text-lg ${
           zone === 'danger' ? 'text-duo-red' : 'text-duo-gray-400'
        }`}>
            {p.rank}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-extrabold border-2 ${
            p.isCurrentUser ? 'bg-duo-green text-white border-duo-green' : 'bg-duo-gray-100 text-duo-gray-500 border-duo-gray-200'
        }`}>
            {p.avatar}
        </div>
        <div>
             <div className={`font-extrabold text-sm md:text-base ${p.isCurrentUser ? 'text-duo-green' : 'text-duo-gray-800'}`}>
                 {p.name} {p.isCurrentUser && "(You)"}
             </div>
             {p.isCurrentUser && (
                 <div className="text-[10px] font-bold text-duo-green uppercase bg-duo-green/10 px-2 py-0.5 rounded-lg w-fit mt-1">
                     Current Station
                 </div>
             )}
        </div>
      </div>
      
      <div className="flex flex-col items-end">
          <span className="font-black text-duo-gray-800 font-mono text-lg">{p.xp.toLocaleString()} XP</span>
          <div className="flex items-center gap-1 text-xs font-bold">
            {p.trend === 'up' && <><ArrowUp size={12} className="text-duo-green" /> <span className="text-duo-green">Rising</span></>}
            {p.trend === 'down' && <><ArrowDown size={12} className="text-duo-red" /> <span className="text-duo-red">Falling</span></>}
            {p.trend === 'same' && <><Minus size={12} className="text-duo-gray-300" /> <span className="text-duo-gray-400">Stable</span></>}
          </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 pb-20">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-8">
            <div>
                <h1 className="text-3xl font-extrabold text-duo-gray-800 mb-2 flex items-center gap-3">
                    <Trophy size={32} className="text-duo-yellow" />
                    Global Rankings
                </h1>
                <p className="text-duo-gray-500 font-bold">Compete against coaches worldwide to prove your program's dominance.</p>
            </div>
            <div className="flex items-center gap-2 bg-duo-gray-100 px-4 py-2 rounded-xl border-2 border-duo-gray-200 mt-4 md:mt-0">
                <Clock size={20} className="text-duo-gray-400" />
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-extrabold text-duo-gray-400 uppercase">Season Ends</span>
                    <span className="text-sm font-black text-duo-gray-800">3 Days 14h</span>
                </div>
            </div>
        </header>

        {/* League Selector */}
        <div className="bg-white p-6 rounded-3xl border-2 border-duo-gray-200 shadow-sm">
            <div className="flex justify-between items-center gap-2 overflow-x-auto custom-scrollbar pb-4 md:pb-0">
                {LEAGUES.map((league) => {
                    const isActive = activeLeague === league.id;
                    return (
                        <button
                            key={league.id}
                            onClick={() => setActiveLeague(league.id)}
                            className={`
                                flex-1 min-w-[120px] flex flex-col items-center justify-center p-4 rounded-2xl border-b-4 transition-all duration-300 relative
                                ${isActive 
                                    ? `bg-duo-gray-50 ${league.color} -translate-y-2 shadow-md` 
                                    : 'bg-transparent border-transparent hover:bg-duo-gray-50 hover:border-duo-gray-200'
                                }
                            `}
                        >
                            <div className={`
                                w-12 h-12 rounded-xl flex items-center justify-center mb-2 transition-transform
                                ${isActive ? 'scale-110' : 'scale-100 opacity-50'}
                            `}>
                                {league.id === 'pro' ? (
                                    <Crown size={32} className={isActive ? league.iconColor : 'text-gray-300'} fill="currentColor" />
                                ) : league.id === 'affiliate' ? (
                                    <Trophy size={32} className={isActive ? league.iconColor : 'text-gray-300'} fill="currentColor" />
                                ) : (
                                    <Medal size={32} className={isActive ? league.iconColor : 'text-gray-300'} fill="currentColor" />
                                )}
                            </div>
                            <span className={`text-xs font-extrabold uppercase tracking-wider ${isActive ? 'text-duo-gray-800' : 'text-duo-gray-400'}`}>
                                {league.name}
                            </span>
                            {isActive && (
                                <motion.div 
                                    layoutId="leagueIndicator"
                                    className="absolute -bottom-4 w-2 h-2 bg-duo-gray-800 rounded-full"
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>

        {/* Standings Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* PODIUM (Top 3) */}
                <div className="relative mt-12 mb-16 px-4">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-duo-yellow/10 text-duo-yellowDark px-4 py-1 rounded-full text-xs font-extrabold uppercase">
                            <ArrowUp size={14} /> Promotion Zone
                        </div>
                    </div>
                    
                    <div className="flex justify-center items-end gap-2 md:gap-6 h-[220px]">
                        {podiumItems.map((p, index) => {
                            // Determine style based on Rank
                            const isFirst = p.rank === 1;
                            const isSecond = p.rank === 2;
                            const isThird = p.rank === 3;
                            
                            let height = 'h-[140px]';
                            let color = 'bg-gradient-to-b from-gray-300 to-gray-400 border-gray-400';
                            let medalColor = 'text-gray-500';
                            let zIndex = 'z-10';
                            
                            if (isFirst) {
                                height = 'h-[180px]';
                                color = 'bg-gradient-to-b from-yellow-300 to-yellow-500 border-yellow-500';
                                medalColor = 'text-yellow-600';
                                zIndex = 'z-20';
                            } else if (isThird) {
                                height = 'h-[120px]';
                                color = 'bg-gradient-to-b from-orange-300 to-orange-400 border-orange-400';
                                medalColor = 'text-orange-700';
                                zIndex = 'z-0';
                            }

                            return (
                                <motion.div
                                    key={p.name}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex flex-col items-center ${zIndex} relative group w-1/3 md:w-32`}
                                >
                                    {/* Avatar Floating */}
                                    <div className={`mb-3 relative ${isFirst ? '-mt-8' : ''}`}>
                                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-xl font-extrabold border-4 shadow-lg bg-white ${isFirst ? 'border-yellow-400 text-yellow-600 scale-110' : isSecond ? 'border-gray-300 text-gray-500' : 'border-orange-300 text-orange-600'}`}>
                                            {p.avatar}
                                        </div>
                                        {isFirst && (
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500 animate-bounce">
                                                <Crown size={32} fill="currentColor" />
                                            </div>
                                        )}
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-lg shadow-sm border border-gray-100 whitespace-nowrap">
                                            <span className="text-[10px] font-black text-duo-gray-800">{p.xp} XP</span>
                                        </div>
                                    </div>

                                    {/* The Block */}
                                    <div className={`w-full ${height} rounded-t-2xl border-t-4 border-x-2 border-b-0 shadow-xl flex flex-col items-center justify-start pt-4 relative overflow-hidden ${color}`}>
                                        <div className="absolute inset-0 bg-white/10 opacity-50 pointer-events-none"></div>
                                        <span className={`text-4xl font-black text-white drop-shadow-md opacity-80`}>{p.rank}</span>
                                        <div className="mt-auto pb-4 text-center w-full px-1">
                                            <p className="text-xs font-extrabold text-white truncate w-full px-2 drop-shadow-sm">{p.name}</p>
                                            {p.isCurrentUser && <div className="text-[8px] bg-black/20 text-white rounded px-1 inline-block mt-1">YOU</div>}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                    
                    {/* Confetti Floor Effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-full mx-8"></div>
                </div>

                {/* Rest of List */}
                <div className="space-y-4">
                    {/* Safe Zone */}
                    <div>
                        <div className="flex items-center gap-2 mb-2 px-2">
                            <div className="w-6 h-6 bg-duo-gray-100 rounded-full flex items-center justify-center text-duo-gray-400">
                                <Shield size={14} />
                            </div>
                            <h3 className="text-xs font-extrabold text-duo-gray-400 uppercase tracking-wider">Safe Zone</h3>
                        </div>
                        <div className="bg-white border-2 border-duo-gray-200 rounded-3xl p-4 shadow-sm">
                            {restOfPack.map(p => renderParticipant(p, 'safe'))}
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div>
                        <div className="flex items-center gap-2 mb-2 px-2">
                            <div className="w-6 h-6 bg-duo-red/10 rounded-full flex items-center justify-center text-duo-red">
                                <ArrowDown size={14} />
                            </div>
                            <h3 className="text-xs font-extrabold text-duo-gray-400 uppercase tracking-wider">Demotion Zone</h3>
                        </div>
                        <div className="bg-white border-2 border-duo-red/20 rounded-3xl p-4 shadow-sm relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-duo-red to-red-600"></div>
                            {bottomThree.map(p => renderParticipant(p, 'danger'))}
                        </div>
                    </div>
                </div>

            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
                <div className="bg-duo-blue/5 border-2 border-duo-blue/20 rounded-3xl p-6 sticky top-6">
                    <h3 className="text-lg font-extrabold text-duo-blue uppercase mb-4">League Rules</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-sm text-duo-gray-600 font-medium">
                            <div className="mt-1 bg-duo-green/20 p-1 rounded text-duo-green">
                                <ArrowUp size={14} />
                            </div>
                            <span>Top 3 coaches advance to the next league tier at the end of the week.</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-duo-gray-600 font-medium">
                            <div className="mt-1 bg-duo-red/20 p-1 rounded text-duo-red">
                                <ArrowDown size={14} />
                            </div>
                            <span>Bottom 3 coaches are relegated to the previous tier.</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-duo-gray-600 font-medium">
                            <div className="mt-1 bg-duo-yellow/20 p-1 rounded text-duo-yellowDark">
                                <AlertCircle size={14} />
                            </div>
                            <span>XP is earned from Drill Completion, Certifications, and Social Engagement.</span>
                        </li>
                    </ul>
                    
                    <div className="mt-6 pt-6 border-t-2 border-duo-blue/10">
                        <h4 className="text-xs font-extrabold text-duo-gray-400 uppercase mb-2">Your Status</h4>
                        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-duo-blue/20 shadow-sm">
                            <span className="text-sm font-bold text-duo-gray-800">Rank #{currentStandings.find(p => p.isCurrentUser)?.rank || '-'}</span>
                            <span className="text-xs font-black text-duo-green bg-duo-green/10 px-2 py-1 rounded">SAFE</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};