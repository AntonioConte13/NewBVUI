
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Target, Zap, Calendar, Video, Star, TrendingUp, Activity, ChevronRight, ArrowLeft, History, ShoppingCart, Unlock, Minus, Plus } from 'lucide-react';
import { TacticalButton } from '../ui/TacticalButton';

interface XPBreakdownModalProps {
  onClose: () => void;
  totalXP: number;
}

// Event Templates
const EARN_TYPES = [
    { title: "Daily Streak Bonus", category: "Streak", amount: 50, icon: Zap, color: "text-duo-yellow", bg: "bg-duo-yellow/10" },
    { title: "Perfect Drill Execution", category: "Drill", amount: 100, icon: Target, color: "text-duo-green", bg: "bg-duo-green/10" },
    { title: "Module Completion", category: "Certification", amount: 500, icon: Trophy, color: "text-duo-yellow", bg: "bg-duo-yellow/10" },
    { title: "Squad Check-in", category: "Social", amount: 25, icon: Calendar, color: "text-duo-blue", bg: "bg-duo-blue/10" },
    { title: "Video Analysis", category: "Analysis", amount: 75, icon: Video, color: "text-duo-blue", bg: "bg-duo-blue/10" },
    { title: "Quiz Passed", category: "Quiz", amount: 150, icon: Star, color: "text-purple-500", bg: "bg-purple-500/10" },
];

const SPEND_TYPES = [
    { title: "Unlock Elite Drill", category: "Shop", amount: 200, icon: Unlock },
    { title: "Fast-Track Cooldown", category: "Boost", amount: 50, icon: Zap },
    { title: "Profile Customization", category: "Cosmetic", amount: 100, icon: ShoppingCart },
];

export const XPBreakdownModal: React.FC<XPBreakdownModalProps> = ({ onClose, totalXP }) => {
    const [view, setView] = useState<'overview' | 'history'>('overview');

    // Calculate next level logic
    const currentLevel = Math.floor(totalXP / 1000) + 1;
    const xpForNextLevel = currentLevel * 1000;
    const progress = (totalXP % 1000) / 1000 * 100;
    const xpRemaining = xpForNextLevel - totalXP;

    // Generate comprehensive history that sums to totalXP
    // We use a "Reverse Ledger" approach: Start at TotalXP and explain it backwards to 0.
    const { fullHistory, lifetimeEarned, lifetimeSpent } = useMemo(() => {
        const events = [];
        let remainingToExplain = totalXP;
        let dayOffset = 0;
        let totalEarnedCounter = 0;
        let totalSpentCounter = 0;
        
        // Safety break to prevent infinite loops in edge cases
        let iterations = 0;
        const MAX_ITERATIONS = 500;

        while (remainingToExplain > 0 && iterations < MAX_ITERATIONS) {
            iterations++;
            
            // 15% Chance to generate a SPEND event (which increases the amount we need to explain as earnings)
            // But only if we aren't too close to 0 to avoid weird math at the end
            const isSpend = Math.random() < 0.15 && remainingToExplain > 200;

            if (isSpend) {
                const template = SPEND_TYPES[Math.floor(Math.random() * SPEND_TYPES.length)];
                events.push({
                    id: `hist-${iterations}`,
                    title: template.title,
                    category: template.category,
                    amount: -template.amount, // Negative
                    icon: template.icon,
                    isPositive: false,
                    time: dayOffset === 0 ? 'Today' : dayOffset === 1 ? 'Yesterday' : `${dayOffset} days ago`
                });
                remainingToExplain += template.amount; // We need to find MORE earnings to cover this spend
                totalSpentCounter += template.amount;
            } else {
                // Generate Earning
                const template = EARN_TYPES[Math.floor(Math.random() * EARN_TYPES.length)];
                
                // Cap amount if we are closing in on 0
                let amount = template.amount;
                let title = template.title;
                
                if (remainingToExplain < amount) {
                    amount = remainingToExplain;
                    title = "Adjustment Bonus";
                }

                events.push({
                    id: `hist-${iterations}`,
                    title: title,
                    category: template.category,
                    amount: amount, // Positive
                    icon: template.icon,
                    color: template.color,
                    bg: template.bg,
                    isPositive: true,
                    time: dayOffset === 0 ? 'Today' : dayOffset === 1 ? 'Yesterday' : `${dayOffset} days ago`
                });
                
                remainingToExplain -= amount;
                totalEarnedCounter += amount;
            }

            // Increment days randomly
            if (Math.random() > 0.7) dayOffset += Math.floor(Math.random() * 2) + 1;
        }

        // Initial "Account Created" event
        events.push({
            id: 'hist-init',
            title: 'Account Activated',
            category: 'System',
            amount: 0,
            icon: Activity,
            isPositive: true,
            color: 'text-gray-400',
            bg: 'bg-gray-100',
            time: `${dayOffset + 1} days ago`
        });

        return { 
            fullHistory: events, 
            lifetimeEarned: totalEarnedCounter, 
            lifetimeSpent: totalSpentCounter 
        };
    }, [totalXP]);

    const recentEarnings = fullHistory.filter(e => e.isPositive && e.amount > 0).slice(0, 5);

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
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            >
                {/* Header - Tactical Dark Theme */}
                <div className="bg-duo-gray-900 p-6 pb-8 text-center relative overflow-hidden border-b-4 border-duo-gray-800 shrink-0">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    
                    <div className="absolute top-4 left-4 z-20">
                        {view === 'history' && (
                            <button 
                                onClick={() => setView('overview')}
                                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors flex items-center gap-1"
                            >
                                <ArrowLeft size={20} />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors z-20"
                    >
                        <X size={24} />
                    </button>

                    <div className="relative z-10 flex flex-col items-center">
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-16 h-16 bg-duo-gray-800 rounded-full flex items-center justify-center mb-3 border-4 border-duo-gray-700 shadow-lg relative"
                        >
                            <Star size={32} className="text-duo-yellow" fill="currentColor" />
                            <div className="absolute -bottom-2 bg-duo-green text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full border-2 border-duo-gray-900">
                                LVL {currentLevel}
                            </div>
                        </motion.div>
                        
                        <h2 className="text-4xl font-black text-white tracking-tight mb-1">{totalXP.toLocaleString()}</h2>
                        <h3 className="text-xs font-extrabold text-duo-gray-400 uppercase tracking-widest">
                            Current XP Balance
                        </h3>
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 relative bg-white overflow-hidden flex flex-col">
                    <AnimatePresence mode="wait">
                        {view === 'overview' ? (
                            <motion.div 
                                key="overview"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="absolute inset-0 flex flex-col"
                            >
                                {/* Level Progress Section */}
                                <div className="bg-duo-gray-50 p-6 border-b-2 border-duo-gray-200 shrink-0">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-extrabold text-duo-gray-500 uppercase flex items-center gap-1">
                                            <TrendingUp size={14} /> To Level {currentLevel + 1}
                                        </span>
                                        <span className="text-xs font-bold text-duo-gray-400">{totalXP} / {xpForNextLevel} XP</span>
                                    </div>
                                    <div className="w-full h-4 bg-duo-gray-200 rounded-full overflow-hidden shadow-inner relative">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-duo-yellow to-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                                        />
                                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
                                    </div>
                                    <p className="text-[10px] font-bold text-duo-gray-400 mt-2 text-center">
                                        Earn <span className="text-duo-green">{xpRemaining} more XP</span> to level up!
                                    </p>
                                </div>

                                {/* Lifetime Performance Tracker */}
                                <div className="p-4 bg-white border-b-2 border-duo-gray-200 shrink-0">
                                    <h4 className="text-xs font-extrabold text-duo-gray-400 uppercase mb-3 flex items-center gap-2">
                                        <Activity size={14} /> Ledger Summary
                                    </h4>
                                    
                                    <button 
                                        onClick={() => setView('history')}
                                        className="w-full bg-duo-gray-50 border-2 border-duo-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-duo-blue hover:bg-duo-blue/5 transition-all group cursor-pointer relative mb-2"
                                    >
                                        <div className="flex flex-col items-start">
                                            <div className="text-[10px] font-extrabold text-duo-gray-400 uppercase mb-1">Full Activity Log</div>
                                            <div className="text-sm font-bold text-duo-gray-600">View all earnings & spendings</div>
                                        </div>
                                        <div className="bg-white p-2 rounded-full text-duo-gray-300 group-hover:text-duo-blue group-hover:translate-x-1 transition-all border border-duo-gray-200">
                                            <ChevronRight size={20} />
                                        </div>
                                    </button>
                                </div>

                                {/* Recent Earnings List */}
                                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white">
                                    <h4 className="text-xs font-extrabold text-duo-gray-400 uppercase mb-4 px-2">Recent Earnings</h4>
                                    <div className="space-y-3">
                                        {recentEarnings.map((item, index) => (
                                            <motion.div 
                                                key={item.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="flex items-center justify-between p-3 rounded-xl border-2 border-duo-gray-100 hover:border-duo-gray-200 hover:bg-duo-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 border-transparent shadow-sm ${item.bg} ${item.color}`}>
                                                        <item.icon size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-extrabold text-duo-gray-800 text-sm">{item.title}</div>
                                                        <div className="text-[10px] font-bold text-duo-gray-400 uppercase flex items-center gap-1">
                                                            {item.category} <span className="w-1 h-1 bg-duo-gray-300 rounded-full"></span> {item.time}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="font-mono font-black text-duo-green text-sm bg-duo-green/5 px-2 py-1 rounded-lg border border-duo-green/10">
                                                    +{item.amount}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="history"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="absolute inset-0 flex flex-col"
                            >
                                {/* Summary Cards */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-duo-gray-50 border-b-2 border-duo-gray-200 shrink-0">
                                    <div className="bg-white border-2 border-duo-gray-100 rounded-xl p-3 shadow-sm">
                                        <div className="text-[10px] font-extrabold text-duo-gray-400 uppercase mb-1">Lifetime Earned</div>
                                        <div className="text-xl font-black text-duo-green flex items-center gap-1">
                                            <Plus size={14} /> {lifetimeEarned.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="bg-white border-2 border-duo-gray-100 rounded-xl p-3 shadow-sm">
                                        <div className="text-[10px] font-extrabold text-duo-gray-400 uppercase mb-1">Lifetime Spent</div>
                                        <div className="text-xl font-black text-duo-red flex items-center gap-1">
                                            <Minus size={14} /> {lifetimeSpent.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Full History List */}
                                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white">
                                    <div className="mb-4 px-2 flex items-center justify-between">
                                        <h4 className="text-xs font-extrabold text-duo-gray-400 uppercase flex items-center gap-2">
                                            <History size={14} /> Full Event Log
                                        </h4>
                                        <span className="text-[10px] font-bold text-duo-gray-300 uppercase">{fullHistory.length} Events</span>
                                    </div>
                                    <div className="space-y-2">
                                        {fullHistory.map((item, index) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between p-3 rounded-xl border-2 border-transparent hover:border-duo-gray-100 hover:bg-duo-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 shadow-sm ${
                                                        item.isPositive 
                                                        ? 'bg-white border-duo-gray-100 ' + (item.color || 'text-gray-400') 
                                                        : 'bg-duo-red/5 border-duo-red/20 text-duo-red'
                                                    }`}>
                                                        <item.icon size={16} />
                                                    </div>
                                                    <div>
                                                        <div className="font-extrabold text-duo-gray-800 text-xs">{item.title}</div>
                                                        <div className="text-[10px] font-bold text-duo-gray-400 uppercase">
                                                            {item.time}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`font-mono font-black text-xs px-2 py-1 rounded-lg ${
                                                    item.isPositive ? 'text-duo-green bg-duo-green/5' : 'text-duo-red bg-duo-red/5'
                                                }`}>
                                                    {item.amount > 0 ? '+' : ''}{item.amount}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-4 border-t-2 border-duo-gray-200 bg-white shrink-0">
                    {view === 'overview' ? (
                        <TacticalButton fullWidth onClick={onClose}>
                            Close Report
                        </TacticalButton>
                    ) : (
                        <TacticalButton fullWidth variant="secondary" onClick={() => setView('overview')}>
                            Back to Summary
                        </TacticalButton>
                    )}
                </div>

            </motion.div>
        </div>
    );
};
