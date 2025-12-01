
import React, { useState } from 'react';
import { Search, Clock, BarChart, Play, Lock } from 'lucide-react';
import { DRILLS } from '../../constants';
import { TacticalButton } from '../ui/TacticalButton';
import { DrillDetail } from './DrillDetail';
import { Drill } from '../../types';

export const Armory: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);

  const categories = [
    'All', 
    'Pitching', 
    'Catching', 
    'Hitting', 
    'Infield', 
    'Outfield', 
    'Base-running', 
    'Mental Game', 
    'Baseball IQ'
  ];

  const filteredDrills = DRILLS.filter(drill => {
    const matchesCategory = filter === 'All' || drill.category === filter;
    const matchesSearch = drill.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 relative pb-20">
      {selectedDrill && (
        <DrillDetail drill={selectedDrill} onClose={() => setSelectedDrill(null)} />
      )}

      <header className="flex flex-col md:flex-row justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-duo-gray-800 mb-2">Drill DataBase</h1>
          <p className="text-duo-gray-500 font-bold">Master these skills to level up your squad.</p>
        </div>
      </header>

      {/* Controls */}
      <div className="flex flex-col gap-6 bg-white p-6 rounded-2xl border-2 border-duo-gray-200">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-duo-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for drills..."
            className="w-full bg-duo-gray-100 rounded-xl text-duo-gray-800 pl-12 pr-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-duo-blue/50 placeholder-duo-gray-400 border-2 border-transparent focus:border-duo-blue transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 text-sm font-extrabold rounded-xl border-b-4 active:border-b-0 active:translate-y-1 transition-all ${
                        filter === cat 
                        ? 'bg-duo-blue border-duo-blueDark text-white' 
                        : 'bg-white border-duo-gray-200 text-duo-gray-400 hover:bg-duo-gray-100'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDrills.map((drill) => (
          <div 
            key={drill.id} 
            onClick={() => setSelectedDrill(drill)}
            className="group bg-white rounded-2xl border-2 border-duo-gray-200 hover:border-duo-gray-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col overflow-hidden transform hover:-translate-y-1"
          >
            {/* Thumbnail Area */}
            <div className="relative aspect-video bg-duo-gray-200">
                <img 
                    src={drill.thumbnail} 
                    alt={drill.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-extrabold text-duo-gray-800 uppercase shadow-sm">
                    {drill.category}
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform">
                        <Play fill="#58CC02" className="text-duo-green ml-1" size={24} />
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-extrabold text-lg text-duo-gray-800 leading-tight">
                        {drill.title}
                    </h3>
                    {drill.completed && (
                         <div className="bg-duo-green text-white p-1 rounded-full">
                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                         </div>
                    )}
                </div>
                {drill.subcategory && (
                  <p className="text-xs font-bold text-duo-gray-400 uppercase mb-4">{drill.subcategory}</p>
                )}

                <div className="flex items-center gap-4 text-xs font-bold text-duo-gray-400 mb-6 mt-auto">
                    <div className="flex items-center gap-1.5 bg-duo-gray-100 px-2 py-1 rounded-md">
                        <Clock size={14} />
                        {drill.duration}
                    </div>
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
                        drill.difficulty === 'Elite' ? 'bg-duo-red/10 text-duo-red' : 
                        drill.difficulty === 'Veteran' ? 'bg-duo-yellow/10 text-duo-yellowDark' : 'bg-duo-green/10 text-duo-green'
                    }`}>
                        <BarChart size={14} />
                        {drill.difficulty}
                    </div>
                </div>

                <TacticalButton variant="secondary" fullWidth className="text-xs py-3 pointer-events-none">
                    Start Drill
                </TacticalButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
