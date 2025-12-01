
import React, { useState } from 'react';
import { Activity, TrendingUp, Target, Calendar, Zap, Trophy, ClipboardList, ChevronRight, Plus, MessageSquare, Video, FileText, Users, AlertCircle, CheckSquare, Star, Clock, Map, Lock, Database } from 'lucide-react';
import { LeagueModal } from './LeagueModal';
import { StreakModal } from './StreakModal';
import { XPBreakdownModal } from './XPBreakdownModal';
import { SavedPostsWidget } from './SavedPostsWidget';
import { SavedCollection, ViewState } from '../../types';
import { TacticalButton } from '../ui/TacticalButton';
import { isFeatureEnabled } from '../../config/featureFlags';

interface DashboardProps {
  savedCollections: SavedCollection[];
  setSavedCollections: React.Dispatch<React.SetStateAction<SavedCollection[]>>;
  setCurrentView: (view: ViewState) => void;
  userXP: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ savedCollections, setSavedCollections, setCurrentView, userXP }) => {
  const [showLeagueModal, setShowLeagueModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showXPModal, setShowXPModal] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Feature Flags
  const isSocialEnabled = isFeatureEnabled('SOCIAL_FEED');
  const isVideoEnabled = isFeatureEnabled('VIDEO_ANALYSIS');
  const isSquadEnabled = isFeatureEnabled('SQUAD_MANAGEMENT');
  const isLeaderboardEnabled = isFeatureEnabled('LEADERBOARDS');

  return (
    <div className="space-y-8 pb-12">
      {showLeagueModal && <LeagueModal onClose={() => setShowLeagueModal(false)} userXP={userXP} />}
      {showStreakModal && <StreakModal onClose={() => setShowStreakModal(false)} />}
      {showXPModal && <XPBreakdownModal onClose={() => setShowXPModal(false)} totalXP={userXP} />}
      
      {/* HERO SECTION */}
      <header className="bg-[#111827] rounded-3xl p-8 relative overflow-hidden shadow-lg border-4 border-white">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-duo-green/20 to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
                <div className="flex items-center gap-2 text-duo-gray-400 text-xs font-extrabold uppercase tracking-widest mb-1">
                    <Calendar size={14} /> {currentDate}
                </div>
                <h1 className="text-4xl font-black text-white uppercase tracking-tight italic">Command Center</h1>
                <p className="text-duo-gray-300 font-bold mt-2 max-w-md">
                    Season Phase: <span className="text-duo-green">Pre-Season Prep</span>. Focus on conditioning and fundamental mechanics.
                </p>
            </div>

            {/* Desktop HUD Widgets */}
            <div className="flex gap-4">
                <button 
                    onClick={() => setShowStreakModal(true)}
                    className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-3 flex flex-col items-center min-w-[90px] hover:bg-white/20 transition-all group hover:scale-105 cursor-pointer"
                >
                    <Zap className="text-duo-yellow mb-1 group-hover:scale-110 transition-transform" fill="currentColor" size={24} />
                    <span className="font-black text-white text-xl leading-none">12</span>
                    <span className="text-[10px] font-bold text-white/60 uppercase">Streak</span>
                </button>

                <button 
                    onClick={() => setShowXPModal(true)}
                    className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-3 flex flex-col items-center min-w-[90px] hover:bg-white/20 transition-all group hover:scale-105 cursor-pointer"
                >
                    <Star className="text-duo-yellow mb-1 group-hover:scale-110 transition-transform" fill="currentColor" size={24} />
                    <span className="font-black text-white text-xl leading-none">{userXP.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-white/60 uppercase">Total XP</span>
                </button>

                <button 
                    onClick={() => isLeaderboardEnabled ? setShowLeagueModal(true) : null}
                    className={`bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-2xl p-3 flex flex-col items-center min-w-[90px] transition-all group ${isLeaderboardEnabled ? 'hover:bg-white/20 hover:scale-105 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                >
                    <Trophy className="text-duo-yellow mb-1 group-hover:scale-110 transition-transform" fill="currentColor" size={24} />
                    <span className="font-black text-white text-xl leading-none">Gold</span>
                    <span className="text-[10px] font-bold text-white/60 uppercase">League</span>
                </button>
            </div>
        </div>
      </header>

      {/* QUICK ACTIONS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* 1. Drill Database (Armory - Always On) */}
          <button 
            onClick={() => setCurrentView('armory')}
            className="bg-white border-2 border-duo-gray-200 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-duo-green hover:shadow-md transition-all group"
          >
              <div className="w-12 h-12 bg-duo-green/10 text-duo-green rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Database size={24} strokeWidth={3} />
              </div>
              <span className="text-xs font-extrabold text-duo-gray-800 uppercase">Drill Database</span>
          </button>

          {/* 2. Broadcast (Tactical/Social - Flagged) */}
          {isSocialEnabled ? (
            <button 
                onClick={() => setCurrentView('broadcast')}
                className="bg-white border-2 border-duo-gray-200 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-duo-blue hover:shadow-md transition-all group"
            >
                <div className="w-12 h-12 bg-duo-blue/10 text-duo-blue rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare size={24} strokeWidth={3} />
                </div>
                <span className="text-xs font-extrabold text-duo-gray-800 uppercase">Broadcast</span>
            </button>
          ) : (
            <div className="bg-duo-gray-50 border-2 border-duo-gray-200 p-4 rounded-2xl flex flex-col items-center gap-2 opacity-75 cursor-not-allowed">
                <div className="w-12 h-12 bg-duo-gray-200 text-duo-gray-400 rounded-xl flex items-center justify-center">
                    <Lock size={24} strokeWidth={3} />
                </div>
                <span className="text-xs font-extrabold text-duo-gray-400 uppercase">Comms Locked</span>
            </div>
          )}

          {/* 3. Pathway (Moved from Metrics) */}
          <button 
            onClick={() => setCurrentView('certification')}
            className="bg-white border-2 border-duo-gray-200 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-purple-500 hover:shadow-md transition-all group"
          >
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Map size={24} strokeWidth={3} />
              </div>
              <span className="text-xs font-extrabold text-duo-gray-800 uppercase">Pathway</span>
          </button>

          {/* 4. Create Quiz (Quiz Builder - Always On) */}
          <button 
            onClick={() => setCurrentView('quiz-builder')}
            className="bg-white border-2 border-duo-gray-200 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-duo-yellow hover:shadow-md transition-all group"
          >
              <div className="w-12 h-12 bg-duo-yellow/10 text-duo-yellowDark rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ClipboardList size={24} strokeWidth={3} />
              </div>
              <span className="text-xs font-extrabold text-duo-gray-800 uppercase">Create Quiz</span>
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN (Main) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* TACTICAL METRICS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Readiness - LOCKED */}
                <div className="bg-duo-gray-50 border-2 border-duo-gray-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between opacity-75 cursor-not-allowed">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-xs font-extrabold text-duo-gray-400 uppercase mb-1">Team Readiness</div>
                            <div className="text-xl font-black text-duo-gray-400">Locked</div>
                        </div>
                        <div className="h-10 w-10 bg-duo-gray-200 rounded-lg flex items-center justify-center text-duo-gray-400">
                            <Lock size={20} />
                        </div>
                    </div>
                    <div className="text-[10px] font-bold text-duo-gray-400 mt-3">
                        Analytics Unavailable
                    </div>
                </div>

                {/* 2. Drills Completed - LOCKED */}
                <div className="bg-duo-gray-50 border-2 border-duo-gray-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between opacity-75 cursor-not-allowed">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-xs font-extrabold text-duo-gray-400 uppercase mb-1">Drills Completed</div>
                            <div className="text-xl font-black text-duo-gray-400">Locked</div>
                        </div>
                        <div className="h-10 w-10 bg-duo-gray-200 rounded-lg flex items-center justify-center text-duo-gray-400">
                            <Lock size={20} />
                        </div>
                    </div>
                    <div className="text-[10px] font-bold text-duo-gray-400 mt-3">
                        Tracking Paused
                    </div>
                </div>

                {/* 3. Drills Assigned - LOCKED */}
                <div className="bg-duo-gray-50 border-2 border-duo-gray-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between opacity-75 cursor-not-allowed">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="text-xs font-extrabold text-duo-gray-400 uppercase mb-1">Drills Assigned</div>
                            <div className="text-xl font-black text-duo-gray-400">Locked</div>
                        </div>
                        <div className="h-10 w-10 bg-duo-gray-200 rounded-lg flex items-center justify-center text-duo-gray-400">
                            <Lock size={20} />
                        </div>
                    </div>
                    <div className="text-[10px] font-bold text-duo-gray-400 mt-3">
                        Assignment Access Restricted
                    </div>
                </div>

                {/* 4. Video Lab (Moved from Quick Actions) */}
                {isVideoEnabled ? (
                    <div 
                        onClick={() => setCurrentView('video-inbox')}
                        className="bg-white border-2 border-duo-gray-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between cursor-pointer hover:border-duo-red transition-all group"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-xs font-extrabold text-duo-gray-400 uppercase mb-1">Video Lab</div>
                                <div className="text-xl font-black text-duo-gray-800 truncate">Analyze</div>
                            </div>
                            <div className="h-10 w-10 bg-duo-red/10 rounded-lg flex items-center justify-center text-duo-red group-hover:scale-110 transition-transform">
                                <Video size={20} />
                            </div>
                        </div>
                        <div className="text-[10px] font-bold text-duo-gray-400 mt-3 truncate">
                            Upload & Review
                        </div>
                    </div>
                ) : (
                    <div className="bg-duo-gray-50 border-2 border-duo-gray-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between opacity-75 cursor-not-allowed">
                         <div className="flex justify-between items-start">
                            <div>
                                <div className="text-xs font-extrabold text-duo-gray-400 uppercase mb-1">Video Lab</div>
                                <div className="text-xl font-black text-duo-gray-400 truncate">Locked</div>
                            </div>
                            <div className="h-10 w-10 bg-duo-gray-200 rounded-lg flex items-center justify-center text-duo-gray-400">
                                <Lock size={20} />
                            </div>
                        </div>
                        <div className="text-[10px] font-bold text-duo-gray-400 mt-3 truncate">
                            Feature Restricted
                        </div>
                    </div>
                )}
            </div>

            {/* SQUAD SNAPSHOT */}
            {isSquadEnabled ? (
                <div className="bg-white border-2 border-duo-gray-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-extrabold text-duo-gray-800 uppercase flex items-center gap-2">
                            <Users size={24} className="text-duo-gray-400" /> Squad Status
                        </h3>
                        <button onClick={() => setCurrentView('my-squad')} className="text-duo-blue text-xs font-extrabold uppercase hover:underline">
                            View Roster
                        </button>
                    </div>
                    
                    {/* Visual Bar */}
                    <div className="flex w-full h-4 rounded-full overflow-hidden mb-4">
                        <div className="bg-duo-green w-[70%]"></div>
                        <div className="bg-duo-yellow w-[20%]"></div>
                        <div className="bg-duo-red w-[10%]"></div>
                    </div>
                    
                    <div className="flex justify-between text-xs font-bold text-duo-gray-500">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-duo-green"></div>
                            Active (14)
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-duo-yellow"></div>
                            Rest/Recovery (4)
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-duo-red"></div>
                            Injured (2)
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white border-2 border-duo-gray-200 rounded-3xl p-8 shadow-sm text-center flex flex-col items-center justify-center h-48">
                    <div className="w-16 h-16 bg-duo-gray-100 rounded-full flex items-center justify-center mb-4 text-duo-gray-400 border-4 border-white shadow-sm">
                        <Users size={32} />
                    </div>
                    <h3 className="text-lg font-extrabold text-duo-gray-800 uppercase mb-1">Squad Management</h3>
                    <p className="text-xs font-bold text-duo-gray-400 bg-duo-gray-100 px-3 py-1 rounded-full mt-2">Coming Q2 2026</p>
                </div>
            )}

            {/* INTEL BANK (Saved Posts) */}
            {isSocialEnabled ? (
                <div className="flex-1 min-h-[350px]">
                    <SavedPostsWidget collections={savedCollections} setCollections={setSavedCollections} />
                </div>
            ) : (
                <div className="bg-white border-2 border-duo-gray-200 rounded-3xl p-8 shadow-sm text-center flex flex-col items-center justify-center min-h-[350px]">
                    <div className="w-20 h-20 bg-duo-gray-100 rounded-full flex items-center justify-center mb-4 text-duo-gray-400 border-4 border-white shadow-sm">
                        <MessageSquare size={36} />
                    </div>
                    <h3 className="text-lg font-extrabold text-duo-gray-800 uppercase mb-1">Intel Bank</h3>
                    <p className="text-xs font-bold text-duo-gray-400 max-w-xs mx-auto mt-1">
                        Social intel and saved content features are currently locked.
                    </p>
                </div>
            )}

        </div>

        {/* RIGHT COLUMN (Side) */}
        <div className="flex flex-col gap-6">
            
            {/* DAILY DIRECTIVES - CLEANED UP */}
            <div className="bg-white border-2 border-duo-gray-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-extrabold text-duo-gray-800 uppercase flex items-center gap-2">
                        <ClipboardList size={24} className="text-duo-blue" /> Daily Directives
                    </h3>
                    <span className="text-xs font-bold text-duo-gray-400 bg-duo-gray-100 px-2 py-1 rounded-lg">4 Tasks</span>
                </div>
                
                <div className="space-y-3">
                    {[
                        { title: 'Review Pitching Mechs', xp: 50, done: true },
                        { title: 'Assign "Short Hop"', xp: 30, done: true },
                        { title: 'Complete Bio Quiz', xp: 100, done: false },
                        { title: 'Update Roster Status', xp: 25, done: false }
                    ].map((goal, i) => (
                        <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                            goal.done 
                            ? 'bg-duo-gray-50 border-transparent opacity-75' 
                            : 'bg-white border-duo-gray-100 hover:border-duo-blue shadow-sm'
                        }`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors shrink-0 ${
                                    goal.done 
                                    ? 'bg-duo-green border-duo-green text-white' 
                                    : 'border-duo-gray-300 text-transparent'
                                }`}>
                                    {goal.done && <CheckSquare size={14} fill="currentColor" />}
                                </div>
                                <span className={`font-bold text-sm ${goal.done ? 'text-duo-gray-400 line-through' : 'text-duo-gray-800'}`}>
                                    {goal.title}
                                </span>
                            </div>
                            <span className={`text-[10px] font-extrabold px-2 py-1 rounded-lg whitespace-nowrap ${
                                goal.done 
                                ? 'text-duo-gray-400 bg-duo-gray-200' 
                                : 'text-duo-yellowDark bg-duo-yellow/10'
                            }`}>
                                +{goal.xp} XP
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 pt-4 border-t-2 border-duo-gray-100 text-center">
                    <span className="text-[10px] font-extrabold text-duo-gray-400 uppercase flex items-center justify-center gap-1">
                        <Clock size={12} /> Resets in 14:02:30
                    </span>
                </div>
            </div>

            {/* LEADERBOARD WIDGET - CLEANED UP */}
            {isLeaderboardEnabled ? (
                <div className="bg-white border-2 border-duo-gray-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-extrabold text-duo-gray-800 uppercase flex items-center gap-2">
                            <Trophy size={24} className="text-duo-yellow" /> Top Performers
                        </h3>
                        <button onClick={() => setShowLeagueModal(true)} className="text-duo-blue hover:bg-duo-blue/10 p-2 rounded-xl transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: 'D. Washington', xp: '2,450', avatar: 'DW', rank: 1 },
                            { name: 'J. Chen', xp: '2,100', avatar: 'JC', rank: 2 },
                            { name: 'T. Silva', xp: '1,890', avatar: 'TS', rank: 3 },
                        ].map((p, i) => {
                            const rankColor = i === 0 ? 'bg-yellow-400 text-yellow-900' : i === 1 ? 'bg-gray-300 text-gray-800' : 'bg-orange-400 text-orange-900';
                            
                            return (
                                <div key={i} className="flex items-center justify-between p-3 rounded-2xl border-2 border-transparent hover:border-duo-gray-200 hover:bg-duo-gray-50 transition-all cursor-pointer group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black shadow-sm ${rankColor}`}>
                                            {p.rank}
                                        </div>
                                        
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-duo-gray-200 flex items-center justify-center text-xs font-extrabold text-duo-gray-500 border-2 border-white shadow-sm">
                                                {p.avatar}
                                            </div>
                                            <div>
                                                <div className="font-extrabold text-duo-gray-800 text-sm">{p.name}</div>
                                                <div className="text-[10px] font-bold text-duo-gray-400 uppercase">Varsity Squad</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="font-mono font-black text-duo-green text-sm bg-duo-green/5 px-2 py-1 rounded-lg group-hover:bg-white transition-colors">
                                        {p.xp}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <button 
                        onClick={() => setShowLeagueModal(true)}
                        className="w-full mt-6 py-3 rounded-xl bg-duo-gray-50 hover:bg-duo-gray-100 text-duo-gray-500 font-extrabold text-xs uppercase tracking-wider transition-colors border-2 border-duo-gray-100"
                    >
                        View Full Standings
                    </button>
                </div>
            ) : (
                <div className="bg-white border-2 border-duo-gray-200 rounded-3xl p-8 shadow-sm text-center flex flex-col items-center justify-center h-64">
                    <div className="w-16 h-16 bg-duo-gray-100 rounded-full flex items-center justify-center mb-4 text-duo-gray-400 border-4 border-white shadow-sm">
                        <Trophy size={32} />
                    </div>
                    <h3 className="text-lg font-extrabold text-duo-gray-800 uppercase mb-1">Global Rankings</h3>
                    <p className="text-xs font-bold text-duo-gray-400 bg-duo-gray-100 px-3 py-1 rounded-full mt-2">Coming Soon</p>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};
