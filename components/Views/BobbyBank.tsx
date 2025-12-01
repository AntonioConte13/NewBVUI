
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, TrendingUp, Lock, ShoppingBag, ChevronRight, 
  HelpCircle, ShieldCheck, AlertCircle, History, Plus, Minus, Star,
  Target, Flame, Video, Users, Database, Award, UserCheck
} from 'lucide-react';
import { BobbyBankState, BobbyTransaction } from '../../types';
import { TacticalButton } from '../ui/TacticalButton';

export const BobbyBank: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'earn' | 'spend'>('earn');
  const [showRules, setShowRules] = useState(false);

  // Mock Data
  const [bankState, setBankState] = useState<BobbyBankState>({
    balance: 1250,
    pending: 150,
    lifetimeEarned: 3400,
    transactions: [
      { id: 't1', date: 'Today, 9:41 AM', description: 'Daily Streak Bonus', amount: 20, type: 'EARN', category: 'Streak' },
      { id: 't2', date: 'Yesterday', description: 'Completed "Hitting 101"', amount: 100, type: 'EARN', category: 'Drill' },
      { id: 't3', date: 'Oct 24', description: 'Unlocked "Elite Pitching" Plan', amount: 500, type: 'SPEND', category: 'Shop' },
      { id: 't4', date: 'Oct 22', description: 'Weekly Challenge Reward', amount: 250, type: 'EARN', category: 'Challenge' },
      { id: 't5', date: 'Oct 20', description: 'Video Verification Pending', amount: 50, type: 'PENDING', category: 'Drill' },
    ]
  });

  const earnMethods = [
    { title: 'Daily Drill', reward: '10-20', desc: 'Complete your assigned daily tactical drill.', icon: <Target size={24} /> },
    { title: '7-Day Streak', reward: '50', desc: 'Log in and train for 7 days in a row.', icon: <Flame size={24} /> },
    { title: 'Video Reps', reward: '25', desc: 'Upload a video of your mechanics for verification.', icon: <Video size={24} /> },
    { title: 'Invite Teammate', reward: '100', desc: 'Get a squad member to join BVAI.', icon: <Users size={24} /> },
  ];

  const spendOptions = [
    { title: 'Pro Drill Library', cost: 500, desc: 'Unlock advanced MLB-level drills.', icon: <Database size={24} /> },
    { title: 'Profile Badge', cost: 250, desc: 'Exclusive "Slugger" badge for your profile.', icon: <Award size={24} /> }, 
    { title: 'Coach Breakdown', cost: 1000, desc: '1-on-1 video analysis from a certified coach.', icon: <UserCheck size={24} /> },
    { title: 'Store Discount', cost: 2000, desc: '10% off merch at the physical academy store.', icon: <ShoppingBag size={24} /> },
  ];

  // Tier Logic
  const tiers = [
    { name: 'Rookie', min: 0, color: 'text-gray-400' },
    { name: 'All-Star', min: 1000, color: 'text-blue-400' },
    { name: 'MVP', min: 5000, color: 'text-yellow-400' },
    { name: 'Hall of Famer', min: 10000, color: 'text-purple-400' },
  ];
  
  const currentTierIndex = tiers.findIndex((t, i) => 
    bankState.lifetimeEarned >= t.min && (tiers[i+1] ? bankState.lifetimeEarned < tiers[i+1].min : true)
  );
  // Fallback
  const currentTier = tiers[currentTierIndex === -1 ? 0 : currentTierIndex];
  const nextTier = tiers[currentTierIndex + 1];
  
  // Safe calculation for progress
  const progressToNext = nextTier 
    ? ((bankState.lifetimeEarned - currentTier.min) / (nextTier.min - currentTier.min)) * 100
    : 100;

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-duo-gray-800 uppercase italic tracking-tight flex items-center gap-3">
            <Wallet size={40} className="text-duo-green" />
            Bobby Bank
          </h1>
          <p className="text-duo-gray-500 font-bold mt-1">Track, earn, and spend your hard-earned Bobby Bucks.</p>
        </div>
        <div className="bg-duo-gray-100 px-4 py-2 rounded-xl border-2 border-duo-gray-200 flex items-center gap-2">
            <ShieldCheck size={18} className="text-duo-blue" />
            <span className="text-xs font-extrabold text-duo-gray-500 uppercase">Secure Vault</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Balance & Actions */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Balance Card */}
            <div className="bg-[#111827] rounded-3xl p-8 relative overflow-hidden shadow-xl border-4 border-duo-gray-800">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-duo-green/10 to-transparent pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="text-sm font-extrabold text-duo-gray-400 uppercase tracking-widest mb-1">Available Balance</div>
                        <div className="text-6xl font-black text-white tracking-tighter drop-shadow-lg flex items-baseline gap-2">
                            {bankState.balance.toLocaleString()} 
                            <span className="text-2xl text-duo-green">BB</span>
                        </div>
                        
                        {bankState.pending > 0 && (
                            <div className="mt-2 inline-flex items-center gap-2 bg-duo-gray-800/50 px-3 py-1 rounded-lg border border-duo-gray-700">
                                <Lock size={12} className="text-duo-yellow" />
                                <span className="text-xs font-bold text-duo-gray-300">
                                    {bankState.pending} Bucks Pending Verification
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Tier Badge */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-w-[180px] text-center">
                        <div className="text-[10px] font-extrabold text-duo-gray-400 uppercase mb-1">Current Status</div>
                        <div className={`text-2xl font-black uppercase ${currentTier.color} drop-shadow-sm`}>
                            {currentTier.name}
                        </div>
                        {nextTier && (
                            <div className="mt-2">
                                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-duo-green transition-all duration-1000" style={{ width: `${progressToNext}%` }}></div>
                                </div>
                                <div className="text-[9px] font-bold text-gray-500 mt-1 text-right">
                                    {Math.round(nextTier.min - bankState.lifetimeEarned)} to {nextTier.name}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions Tabs */}
            <div className="bg-white border-2 border-duo-gray-200 rounded-3xl p-6 shadow-sm">
                <div className="flex gap-2 mb-6 border-b-2 border-duo-gray-100 pb-1">
                    <button 
                        onClick={() => setActiveTab('earn')}
                        className={`flex-1 pb-3 text-sm font-extrabold uppercase tracking-wide transition-all border-b-4 ${
                            activeTab === 'earn' 
                            ? 'border-duo-green text-duo-green' 
                            : 'border-transparent text-duo-gray-400 hover:text-duo-gray-600'
                        }`}
                    >
                        Ways to Earn
                    </button>
                    <button 
                        onClick={() => setActiveTab('spend')}
                        className={`flex-1 pb-3 text-sm font-extrabold uppercase tracking-wide transition-all border-b-4 ${
                            activeTab === 'spend' 
                            ? 'border-duo-blue text-duo-blue' 
                            : 'border-transparent text-duo-gray-400 hover:text-duo-gray-600'
                        }`}
                    >
                        Spend Bucks
                    </button>
                </div>

                <div className="min-h-[300px]">
                    <AnimatePresence mode='wait'>
                        {activeTab === 'earn' ? (
                            <motion.div 
                                key="earn"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                {earnMethods.map((method, idx) => (
                                    <div key={idx} className="bg-duo-gray-50 border-2 border-duo-gray-200 rounded-2xl p-4 flex items-start gap-4 hover:border-duo-green transition-all group cursor-pointer">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-duo-green shadow-sm border border-duo-gray-100 group-hover:scale-110 transition-transform">
                                            {method.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-duo-gray-800 text-sm uppercase">{method.title}</h3>
                                            <p className="text-xs font-medium text-duo-gray-500 leading-tight my-1">{method.desc}</p>
                                            <div className="inline-flex items-center gap-1 bg-duo-green/10 text-duo-green px-2 py-0.5 rounded-md text-[10px] font-black uppercase">
                                                <Plus size={10} /> {method.reward} Bucks
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="col-span-1 md:col-span-2 mt-4 text-center">
                                    <p className="text-xs font-bold text-duo-gray-400 italic">More earning opportunities coming in future updates (Tournaments, Events).</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="spend"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                {spendOptions.map((item, idx) => (
                                    <div key={idx} className="bg-duo-gray-50 border-2 border-duo-gray-200 rounded-2xl p-4 flex items-start gap-4 hover:border-duo-blue transition-all group cursor-pointer">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-duo-blue shadow-sm border border-duo-gray-100 group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-extrabold text-duo-gray-800 text-sm uppercase">{item.title}</h3>
                                            <p className="text-xs font-medium text-duo-gray-500 leading-tight my-1">{item.desc}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <div className="inline-flex items-center gap-1 bg-duo-blue/10 text-duo-blue px-2 py-0.5 rounded-md text-[10px] font-black uppercase">
                                                    <Minus size={10} /> {item.cost} Bucks
                                                </div>
                                                {bankState.balance < item.cost && (
                                                    <span className="text-[10px] font-bold text-duo-red">Insufficient</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="col-span-1 md:col-span-2 p-4 bg-duo-yellow/10 border-2 border-duo-yellow/30 rounded-xl text-center">
                                    <p className="text-xs font-bold text-duo-yellowDark">
                                        <AlertCircle size={12} className="inline mr-1" />
                                        Note: Some rewards are time-limited or subject to coach approval.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>

        {/* Right Column: History & Rules */}
        <div className="space-y-6">
            
            {/* Transaction History */}
            <div className="bg-white border-2 border-duo-gray-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-extrabold text-duo-gray-800 uppercase flex items-center gap-2 mb-4">
                    <History size={20} className="text-duo-gray-400" /> Recent Activity
                </h3>
                
                <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {bankState.transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 bg-duo-gray-50 border-2 border-duo-gray-100 rounded-2xl">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 ${
                                    tx.type === 'EARN' ? 'bg-duo-green/10 border-duo-green text-duo-green' :
                                    tx.type === 'SPEND' ? 'bg-duo-red/10 border-duo-red text-duo-red' :
                                    'bg-duo-yellow/10 border-duo-yellow text-duo-yellowDark'
                                }`}>
                                    {tx.type === 'EARN' ? <TrendingUp size={14} /> : tx.type === 'SPEND' ? <ShoppingBag size={14} /> : <Lock size={14} />}
                                </div>
                                <div>
                                    <div className="text-xs font-extrabold text-duo-gray-800">{tx.description}</div>
                                    <div className="text-[10px] font-bold text-duo-gray-400">{tx.date} • {tx.category}</div>
                                </div>
                            </div>
                            <div className={`text-sm font-black ${
                                tx.type === 'EARN' ? 'text-duo-green' :
                                tx.type === 'SPEND' ? 'text-duo-red' :
                                'text-duo-gray-400'
                            }`}>
                                {tx.type === 'EARN' ? '+' : tx.type === 'SPEND' ? '-' : ''}{tx.amount}
                            </div>
                        </div>
                    ))}
                </div>
                
                <button className="w-full mt-4 text-xs font-extrabold text-duo-gray-400 uppercase hover:text-duo-blue transition-colors flex items-center justify-center gap-1">
                    View Full History <ChevronRight size={14} />
                </button>
            </div>

            {/* Rules Accordion */}
            <div className="bg-white border-2 border-duo-gray-200 rounded-3xl overflow-hidden shadow-sm">
                <button 
                    onClick={() => setShowRules(!showRules)}
                    className="w-full p-6 flex items-center justify-between hover:bg-duo-gray-50 transition-colors"
                >
                    <h3 className="text-lg font-extrabold text-duo-gray-800 uppercase flex items-center gap-2">
                        <HelpCircle size={20} className="text-duo-blue" /> Rules & Fair Play
                    </h3>
                    <ChevronRight size={20} className={`text-duo-gray-400 transition-transform ${showRules ? 'rotate-90' : ''}`} />
                </button>
                
                {showRules && (
                    <div className="p-6 pt-0 bg-duo-gray-50 border-t-2 border-duo-gray-200 text-sm text-duo-gray-600 space-y-4">
                        <div>
                            <h4 className="font-extrabold text-duo-gray-800 uppercase text-xs mb-1">Not Real Money</h4>
                            <p className="text-xs">Bobby Bucks are a virtual currency for this app only. They have no real-world cash value and cannot be exchanged for money.</p>
                        </div>
                        <div>
                            <h4 className="font-extrabold text-duo-gray-800 uppercase text-xs mb-1">Code of Conduct</h4>
                            <ul className="list-disc list-inside text-xs space-y-1">
                                <li>No cheating or faking drills.</li>
                                <li>Coaches review activity regularly.</li>
                                <li>Suspicious activity leads to buck removal.</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-extrabold text-duo-gray-800 uppercase text-xs mb-1">Parents & Coaches</h4>
                            <p className="text-xs">This system rewards engagement and discipline. Parents can view transaction history to monitor activity.</p>
                        </div>
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};
