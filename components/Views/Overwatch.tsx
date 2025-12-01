import React, { useState, useEffect } from 'react';
import { ShieldAlert, Star, Archive, Trash2, Share2, Search, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle, Clock, ChevronRight, ChevronLeft, User, Bot, MoreVertical, Inbox, Filter, MessageSquare, Lock, Unlock, Key, LayoutDashboard, Eye, EyeOff, Wallet, Gamepad2, Users, Zap } from 'lucide-react';
import { FeedbackEvent, ViewState } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { TacticalButton } from '../ui/TacticalButton';

interface OverwatchProps {
  isAdminUnlockEnabled?: boolean;
  setIsAdminUnlockEnabled?: (enabled: boolean) => void;
  setCurrentView?: (view: ViewState) => void;
}

export const Overwatch: React.FC<OverwatchProps> = ({ isAdminUnlockEnabled = false, setIsAdminUnlockEnabled, setCurrentView }) => {
  const [activeView, setActiveView] = useState<'feedback' | 'hidden'>('feedback');
  const [feedbackItems, setFeedbackItems] = useState<FeedbackEvent[]>([]);
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative' | 'starred' | 'archived' | 'pending'>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  // Initial Data Load
  useEffect(() => {
    const stored = localStorage.getItem('bvai_admin_feedback');
    if (stored) {
      setFeedbackItems(JSON.parse(stored));
    } else {
      const mocks: FeedbackEvent[] = [
        {
          id: 'fb-1',
          sessionId: 'sess-101',
          userPrompt: 'What is the best drill for hip separation?',
          modelResponse: 'The Three Pump Drill is excellent for isolating the gather phase and timing hand break with knee drop.',
          rating: 'positive',
          comment: 'Really accurate, exactly what I needed.',
          timestamp: Date.now() - 10000000,
          status: 'starred'
        },
        {
          id: 'fb-2',
          sessionId: 'sess-102',
          userPrompt: 'Explain the kinetic chain.',
          modelResponse: 'Energy transfer from ground to hand.',
          rating: 'negative',
          comment: 'Too brief. Needed more detail on specific segments.',
          timestamp: Date.now() - 5000000,
          status: 'new'
        },
        {
          id: 'fb-3',
          sessionId: 'sess-103',
          userPrompt: 'Who won the 1986 World Series?',
          modelResponse: 'The New York Mets defeated the Boston Red Sox.',
          rating: 'positive',
          timestamp: Date.now() - 2000000,
          status: 'new'
        }
      ];
      setFeedbackItems(mocks);
      localStorage.setItem('bvai_admin_feedback', JSON.stringify(mocks));
    }
  }, []);

  const updateStorage = (items: FeedbackEvent[]) => {
      setFeedbackItems(items);
      localStorage.setItem('bvai_admin_feedback', JSON.stringify(items));
  };

  const handleAction = (id: string, action: 'star' | 'archive' | 'delete') => {
      if (action === 'delete') {
          const newItems = feedbackItems.filter(i => i.id !== id);
          updateStorage(newItems);
          if (selectedId === id) setSelectedId(null);
          return;
      }

      const newItems = feedbackItems.map(i => {
          if (i.id === id) {
              if (action === 'star') return { ...i, status: i.status === 'starred' ? 'new' : 'starred' } as FeedbackEvent;
              if (action === 'archive') return { ...i, status: i.status === 'archived' ? 'new' : 'archived' } as FeedbackEvent;
          }
          return i;
      });
      updateStorage(newItems);
  };

  const handleSelect = (id: string) => {
      setSelectedId(id);
      setMobileView('detail');
  };

  const filteredItems = feedbackItems.filter(item => {
      const matchesSearch = 
        item.userPrompt.toLowerCase().includes(search.toLowerCase()) || 
        item.comment?.toLowerCase().includes(search.toLowerCase());
      
      if (!matchesSearch) return false;

      if (filter === 'all') return item.status !== 'archived';
      if (filter === 'archived') return item.status === 'archived';
      if (filter === 'starred') return item.status === 'starred';
      if (filter === 'pending') return item.status === 'new';
      if (filter === 'positive') return item.rating === 'positive' && item.status !== 'archived';
      if (filter === 'negative') return item.rating === 'negative' && item.status !== 'archived';
      
      return true;
  });

  const selectedItem = feedbackItems.find(i => i.id === selectedId);

  const stats = {
      total: feedbackItems.length,
      positive: feedbackItems.filter(i => i.rating === 'positive').length,
      negative: feedbackItems.filter(i => i.rating === 'negative').length,
      pending: feedbackItems.filter(i => i.status === 'new').length
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
        
        {/* Header Stats & Toggle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between px-2 shrink-0 gap-4">
            <div>
                <h1 className="text-2xl font-extrabold text-duo-gray-800 flex items-center gap-2">
                    <ShieldAlert size={28} className="text-duo-red" />
                    Overwatch
                </h1>
            </div>

            {/* View Toggle */}
            <div className="bg-duo-gray-100 p-1 rounded-xl border-2 border-duo-gray-200 flex">
                <button
                    onClick={() => setActiveView('feedback')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold uppercase transition-all ${
                        activeView === 'feedback'
                        ? 'bg-white text-duo-gray-800 shadow-sm'
                        : 'text-duo-gray-400 hover:text-duo-gray-600'
                    }`}
                >
                    <LayoutDashboard size={16} /> Overwatch
                </button>
                <button
                    onClick={() => setActiveView('hidden')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-extrabold uppercase transition-all ${
                        activeView === 'hidden'
                        ? 'bg-white text-duo-red shadow-sm'
                        : 'text-duo-gray-400 hover:text-duo-gray-600'
                    }`}
                >
                    <EyeOff size={16} /> Hidden Features
                </button>
            </div>

            <div className="flex gap-2 items-center">
                {/* Admin Unlock Toggle - Accessible in both views for now */}
                {setIsAdminUnlockEnabled && (
                    <button 
                        onClick={() => setIsAdminUnlockEnabled(!isAdminUnlockEnabled)}
                        className={`px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm border-2 transition-all font-extrabold uppercase text-xs ${
                            isAdminUnlockEnabled 
                            ? 'bg-duo-red text-white border-duo-red shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse' 
                            : 'bg-white border-duo-gray-200 text-duo-gray-400 hover:border-duo-gray-300'
                        }`}
                    >
                        {isAdminUnlockEnabled ? <Unlock size={14} /> : <Lock size={14} />}
                        <span className="hidden md:inline">{isAdminUnlockEnabled ? 'Global Unlock: ON' : 'Global Unlock: OFF'}</span>
                    </button>
                )}
            </div>
        </div>

        {/* View Content */}
        {activeView === 'feedback' ? (
            <div className="flex-1 flex gap-6 overflow-hidden relative bg-duo-gray-50 rounded-3xl border-2 border-duo-gray-200 p-1">
                
                {/* LEFT PANE: LIST */}
                <div className={`w-full lg:w-1/3 flex flex-col bg-white rounded-2xl border border-duo-gray-200 shadow-sm overflow-hidden transition-transform absolute inset-0 lg:static z-10 ${mobileView === 'detail' ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}`}>
                    
                    {/* Toolbar */}
                    <div className="p-4 border-b border-duo-gray-100 space-y-3 bg-white z-10">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-duo-gray-400" size={16} />
                            <input 
                                type="text" 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search intel..."
                                className="w-full bg-duo-gray-100 text-duo-gray-800 pl-9 pr-4 py-2 rounded-xl border border-transparent focus:border-duo-blue focus:bg-white outline-none text-sm font-bold transition-all"
                            />
                        </div>
                        <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-1">
                            {[
                                { id: 'all', label: 'All', icon: Inbox },
                                { id: 'pending', label: 'New', icon: AlertTriangle },
                                { id: 'positive', label: '', icon: ThumbsUp },
                                { id: 'negative', label: '', icon: ThumbsDown },
                                { id: 'starred', label: '', icon: Star },
                                { id: 'archived', label: '', icon: Archive },
                            ].map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setFilter(f.id as any)}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-all whitespace-nowrap ${
                                        filter === f.id 
                                        ? 'bg-duo-blue text-white shadow-sm' 
                                        : 'bg-duo-gray-50 text-duo-gray-400 hover:bg-duo-gray-100 hover:text-duo-blue'
                                    }`}
                                >
                                    <f.icon size={14} /> {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                        {filteredItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-center opacity-50">
                                <Filter size={32} className="mb-2" />
                                <p className="text-xs font-bold">No items found</p>
                            </div>
                        ) : (
                            filteredItems.map(item => (
                                <div 
                                    key={item.id}
                                    onClick={() => handleSelect(item.id)}
                                    className={`p-3 rounded-xl cursor-pointer border-2 transition-all relative group hover:shadow-md ${
                                        selectedId === item.id 
                                        ? 'bg-duo-blue/5 border-duo-blue z-10' 
                                        : 'bg-white border-transparent hover:border-duo-gray-200'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex items-center gap-2">
                                            {item.rating === 'positive' 
                                                ? <ThumbsUp size={14} className="text-duo-green" /> 
                                                : <ThumbsDown size={14} className="text-duo-red" />
                                            }
                                            <span className="text-[10px] font-mono text-duo-gray-400">
                                                {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                        {item.status === 'starred' && <Star size={12} className="text-duo-yellow fill-current" />}
                                        {item.status === 'new' && <div className="w-2 h-2 bg-duo-blue rounded-full"></div>}
                                    </div>
                                    <div className={`text-xs font-bold line-clamp-2 mb-1 ${selectedId === item.id ? 'text-duo-blue' : 'text-duo-gray-800'}`}>
                                        {item.userPrompt}
                                    </div>
                                    {item.comment && (
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-duo-gray-500 bg-duo-gray-100 px-1.5 py-0.5 rounded w-fit max-w-full truncate">
                                            <AlertTriangle size={10} /> "{item.comment}"
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT PANE: DETAIL */}
                <div className={`absolute inset-0 lg:static lg:flex-1 bg-white lg:rounded-2xl lg:border border-duo-gray-200 shadow-sm flex flex-col overflow-hidden transition-transform z-20 ${mobileView === 'list' ? 'translate-x-full lg:translate-x-0' : 'translate-x-0'}`}>
                    
                    {selectedItem ? (
                        <>
                            {/* Detail Header */}
                            <div className="p-4 border-b border-duo-gray-100 flex justify-between items-center bg-white">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => setMobileView('list')}
                                        className="lg:hidden p-2 hover:bg-duo-gray-100 rounded-full text-duo-gray-500"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-sm font-extrabold text-duo-gray-800 uppercase tracking-wide">Intel Analysis</h2>
                                            <span className="text-[10px] font-mono text-duo-gray-400 px-2 py-0.5 bg-duo-gray-100 rounded-md">
                                                {selectedItem.id}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button 
                                        onClick={() => handleAction(selectedItem.id, 'star')}
                                        className={`p-2 rounded-lg transition-colors ${selectedItem.status === 'starred' ? 'bg-duo-yellow text-white' : 'text-duo-gray-400 hover:bg-duo-gray-100 hover:text-duo-yellow'}`}
                                        title="Toggle Priority"
                                    >
                                        <Star size={18} fill={selectedItem.status === 'starred' ? "currentColor" : "none"} />
                                    </button>
                                    <button 
                                        onClick={() => handleAction(selectedItem.id, 'archive')}
                                        className={`p-2 rounded-lg transition-colors ${selectedItem.status === 'archived' ? 'bg-duo-gray-800 text-white' : 'text-duo-gray-400 hover:bg-duo-gray-100 hover:text-duo-gray-800'}`}
                                        title={selectedItem.status === 'archived' ? 'Unarchive' : 'Archive'}
                                    >
                                        <Archive size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleAction(selectedItem.id, 'delete')}
                                        className="p-2 rounded-lg text-duo-gray-400 hover:bg-duo-red/10 hover:text-duo-red transition-colors"
                                        title="Delete Record"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Detail Body */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-8">
                                
                                {/* Conversation Log */}
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center gap-1 shrink-0">
                                            <div className="w-10 h-10 rounded-xl bg-duo-gray-100 flex items-center justify-center text-duo-gray-500 shadow-sm">
                                                <User size={20} />
                                            </div>
                                        </div>
                                        <div className="bg-duo-gray-50 p-4 rounded-2xl rounded-tl-none border border-duo-gray-200 text-duo-gray-800 text-sm font-medium leading-relaxed">
                                            {selectedItem.userPrompt}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center gap-1 shrink-0">
                                            <div className="w-10 h-10 rounded-xl bg-duo-gray-800 flex items-center justify-center text-white shadow-sm">
                                                <Bot size={20} />
                                            </div>
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl rounded-tl-none border-2 border-duo-gray-100 text-duo-gray-600 text-sm leading-relaxed shadow-sm">
                                            {selectedItem.modelResponse}
                                        </div>
                                    </div>
                                </div>

                                {/* Feedback Section */}
                                <div className={`mt-8 rounded-2xl p-6 border-2 ${selectedItem.rating === 'positive' ? 'bg-duo-green/5 border-duo-green/20' : 'bg-duo-red/5 border-duo-red/20'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedItem.rating === 'positive' ? 'bg-duo-green text-white' : 'bg-duo-red text-white'}`}>
                                            {selectedItem.rating === 'positive' ? <ThumbsUp size={24} /> : <ThumbsDown size={24} />}
                                        </div>
                                        <div>
                                            <h3 className={`font-extrabold text-lg ${selectedItem.rating === 'positive' ? 'text-duo-green' : 'text-duo-red'}`}>
                                                {selectedItem.rating === 'positive' ? 'Positive Feedback' : 'Negative Feedback'}
                                            </h3>
                                            <p className="text-xs font-bold text-duo-gray-400 uppercase">Recorded {new Date(selectedItem.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    
                                    {selectedItem.comment ? (
                                        <div className="bg-white p-4 rounded-xl border border-duo-gray-200">
                                            <div className="flex items-center gap-2 mb-2 text-xs font-extrabold text-duo-gray-400 uppercase">
                                                <MessageSquare size={12} /> User Comment
                                            </div>
                                            <p className="text-sm font-medium text-duo-gray-800 italic">"{selectedItem.comment}"</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-duo-gray-400 italic">No additional comments provided.</p>
                                    )}
                                </div>
                                
                                {/* Meta Info */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-duo-gray-100">
                                    <div>
                                        <div className="text-xs font-extrabold text-duo-gray-400 uppercase mb-1">Session ID</div>
                                        <div className="text-xs font-mono bg-duo-gray-100 p-2 rounded-lg truncate">{selectedItem.sessionId}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-extrabold text-duo-gray-400 uppercase mb-1">Model Version</div>
                                        <div className="text-xs font-mono bg-duo-gray-100 p-2 rounded-lg">Gemini 1.5 Pro</div>
                                    </div>
                                </div>

                            </div>
                        </>
                    ) : (
                        /* Empty State Dashboard */
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-duo-gray-50/50">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border-4 border-duo-gray-100">
                                <ShieldAlert size={48} className="text-duo-gray-300" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-duo-gray-400 uppercase mb-2">Awaiting Selection</h2>
                            <p className="text-sm text-duo-gray-400 font-medium max-w-xs">
                                Select an intel report from the list to view detailed analysis and tactical feedback.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        ) : (
            /* HIDDEN FEATURES VIEW - COMMAND DECK */
            <div className="flex-1 bg-[#111827] rounded-3xl border-4 border-duo-gray-800 p-8 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                {/* Background Tech Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-duo-gray-900/50 to-transparent pointer-events-none"></div>

                <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
                    <div className="mb-8 text-center">
                        <div className="w-20 h-20 bg-duo-gray-800 rounded-2xl flex items-center justify-center mb-4 border-2 border-duo-gray-700 mx-auto shadow-lg">
                            <Key size={40} className="text-duo-red" />
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-1">Classified Modules</h2>
                        <p className="text-duo-gray-400 font-bold text-sm uppercase tracking-wide">Restricted Access // Admin Clearance Only</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                        
                        {/* Bobby Bank Shortcut */}
                        <button 
                            onClick={() => setCurrentView?.('bobby-bank')}
                            className="bg-duo-gray-800 border-2 border-duo-gray-700 hover:border-duo-green group rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                        >
                            <div className="w-12 h-12 rounded-full bg-duo-green/10 flex items-center justify-center mb-4 group-hover:bg-duo-green group-hover:text-white transition-colors text-duo-green">
                                <Wallet size={24} />
                            </div>
                            <h3 className="text-white font-extrabold uppercase text-sm mb-1">Bobby Bank</h3>
                            <p className="text-xs text-duo-gray-400 font-medium">Economy Management</p>
                        </button>

                        {/* Play Shortcut */}
                        <button 
                            onClick={() => setCurrentView?.('play')}
                            className="bg-duo-gray-800 border-2 border-duo-gray-700 hover:border-duo-blue group rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                        >
                            <div className="w-12 h-12 rounded-full bg-duo-blue/10 flex items-center justify-center mb-4 group-hover:bg-duo-blue group-hover:text-white transition-colors text-duo-blue">
                                <Gamepad2 size={24} />
                            </div>
                            <h3 className="text-white font-extrabold uppercase text-sm mb-1">The Arcade</h3>
                            <p className="text-xs text-duo-gray-400 font-medium">Simulation & Games</p>
                        </button>

                        {/* Squad Shortcut */}
                        <button 
                            onClick={() => setCurrentView?.('my-squad')}
                            className="bg-duo-gray-800 border-2 border-duo-gray-700 hover:border-duo-yellow group rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]"
                        >
                            <div className="w-12 h-12 rounded-full bg-duo-yellow/10 flex items-center justify-center mb-4 group-hover:bg-duo-yellow group-hover:text-white transition-colors text-duo-yellow">
                                <Users size={24} />
                            </div>
                            <h3 className="text-white font-extrabold uppercase text-sm mb-1">Squad Roster</h3>
                            <p className="text-xs text-duo-gray-400 font-medium">Personnel Files</p>
                        </button>

                        {/* Global Unlock Toggle */}
                        <button 
                            onClick={() => setIsAdminUnlockEnabled?.(!isAdminUnlockEnabled)}
                            className={`bg-duo-gray-800 border-2 group rounded-2xl p-6 flex flex-col items-center text-center transition-all hover:-translate-y-1 ${
                                isAdminUnlockEnabled 
                                ? 'border-duo-red shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                                : 'border-duo-gray-700 hover:border-gray-500'
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors ${
                                isAdminUnlockEnabled 
                                ? 'bg-duo-red text-white animate-pulse' 
                                : 'bg-duo-gray-700 text-duo-gray-400 group-hover:text-white'
                            }`}>
                                {isAdminUnlockEnabled ? <Unlock size={24} /> : <Lock size={24} />}
                            </div>
                            <h3 className={`font-extrabold uppercase text-sm mb-1 ${isAdminUnlockEnabled ? 'text-duo-red' : 'text-white'}`}>
                                {isAdminUnlockEnabled ? 'Global Unlock' : 'System Locked'}
                            </h3>
                            <p className="text-xs text-duo-gray-400 font-medium">Security Override</p>
                        </button>

                    </div>
                </div>
            </div>
        )}
    </div>
  );
};