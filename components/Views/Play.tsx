
import React, { useState } from 'react';
import { Gamepad2, Edit3, Play as PlayIcon, Lock, LayoutGrid, Shield, Eye, Target } from 'lucide-react';
import { TacticalButton } from '../ui/TacticalButton';
import { CrosswordGame } from './Games/CrosswordGame';
import { SolitaireGame } from './Games/SolitaireGame';
import { TowerDefenseGame } from './Games/TowerDefenseGame';
import { PitchRecognitionGame } from './Games/PitchRecognitionGame';
import { HittingDrillGame } from './Games/HittingDrillGame';
import { isFeatureEnabled } from '../../config/featureFlags';
import { ComingSoon } from '../ComingSoon';

type GameType = 'none' | 'crossword' | 'solitaire' | 'tower' | 'pitch' | 'hitting';

export const Play: React.FC = () => {
  const [activeGame, setActiveGame] = useState<GameType>('none');

  // Feature Flag Check
  if (!isFeatureEnabled('GAMES')) {
    return (
      <ComingSoon 
        featureName="Tactical Training Games"
        description="Master baseball concepts through interactive games like Tower Defense, Crossword Puzzles, and Diamond Solitaire. Learn strategy while having fun!"
        icon="🎮"
        estimatedLaunch="Q2 2026"
      />
    );
  }

  if (activeGame === 'crossword') {
      return <CrosswordGame onBack={() => setActiveGame('none')} />;
  }

  if (activeGame === 'solitaire') {
      return <SolitaireGame onBack={() => setActiveGame('none')} />;
  }

  if (activeGame === 'tower') {
      return <TowerDefenseGame onBack={() => setActiveGame('none')} />;
  }

  if (activeGame === 'pitch') {
      return <PitchRecognitionGame onBack={() => setActiveGame('none')} />;
  }

  if (activeGame === 'hitting') {
      return <HittingDrillGame onBack={() => setActiveGame('none')} />;
  }

  return (
    <div className="space-y-8 pb-20">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-duo-gray-800 mb-2 flex items-center gap-3">
            <Gamepad2 size={32} className="text-duo-red" />
            The Arcade
        </h1>
        <p className="text-duo-gray-500 font-bold">Sharpen your baseball IQ with tactical mini-games.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Hitting Game Card (NEW) */}
        <div className="bg-white border-2 border-duo-gray-200 rounded-3xl overflow-hidden hover:border-duo-red transition-all shadow-sm hover:shadow-lg group flex flex-col">
            <div className="h-48 relative flex items-center justify-center overflow-hidden bg-gray-900">
                <img 
                    src="https://images.unsplash.com/photo-1516731415730-0c607149933a?w=800&auto=format&fit=crop&q=60" 
                    alt="Cage Commander"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                
                <div className="text-center z-10 relative">
                    <div className="w-16 h-16 bg-duo-red/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mx-auto mb-2 shadow-lg border border-white/30 transform group-hover:scale-110 transition-transform">
                        <Target size={32} />
                    </div>
                </div>
                <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-duo-yellow text-white text-[10px] font-extrabold uppercase rounded-lg shadow-sm border border-white/20">
                        Featured
                    </span>
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-xl font-extrabold text-duo-gray-800">Cage Commander</h3>
                    <p className="text-sm text-duo-gray-500 font-medium mt-1 line-clamp-2">
                        Step into the box and perfect your timing. Swing for the fences in this batting simulator.
                    </p>
                </div>
                <div className="mt-auto">
                    <TacticalButton fullWidth onClick={() => setActiveGame('hitting')} icon={<PlayIcon size={18} />}>
                        Play Now
                    </TacticalButton>
                </div>
            </div>
        </div>

        {/* Pitch Recognition Card */}
        <div className="bg-white border-2 border-duo-gray-200 rounded-3xl overflow-hidden hover:border-purple-500 transition-all shadow-sm hover:shadow-lg group flex flex-col">
            <div className="h-48 relative flex items-center justify-center overflow-hidden bg-purple-900">
                 <img 
                    src="https://images.unsplash.com/photo-1593787406536-326a260db99a?q=80&w=2000&auto=format&fit=crop" 
                    alt="Pitch Recognition"
                    className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-purple-900/40 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                 <div className="text-center z-10 relative">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mx-auto mb-2 shadow-lg border border-white/30 transform group-hover:scale-110 transition-transform">
                        <Eye size={32} />
                    </div>
                 </div>
                 <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-white/20 backdrop-blur text-white text-[10px] font-extrabold uppercase rounded-lg shadow-sm border border-white/20">
                        Drill
                    </span>
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
                 <div className="mb-4">
                    <h3 className="text-xl font-extrabold text-duo-gray-800">Pitch Recognition</h3>
                    <p className="text-sm text-duo-gray-500 font-medium mt-1 line-clamp-2">
                        Identify spin and velocity in real-time scenarios. Train your eye at the plate.
                    </p>
                 </div>
                <div className="mt-auto">
                    <TacticalButton fullWidth onClick={() => setActiveGame('pitch')} icon={<PlayIcon size={18} />}>
                        Play Now
                    </TacticalButton>
                </div>
            </div>
        </div>

        {/* Crossword Card */}
        <div className="bg-white border-2 border-duo-gray-200 rounded-3xl overflow-hidden hover:border-duo-blue transition-all shadow-sm hover:shadow-lg group flex flex-col">
            <div className="h-48 relative flex items-center justify-center overflow-hidden bg-duo-gray-800">
                <img 
                    src="https://images.unsplash.com/photo-1587385789097-0197a7fbd179?w=800&auto=format&fit=crop&q=60" 
                    alt="Tactical Crossword"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-duo-blue/60 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <div className="text-center z-10 relative">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mx-auto mb-2 shadow-lg border border-white/30 transform group-hover:scale-110 transition-transform">
                        <Edit3 size={32} />
                    </div>
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-xl font-extrabold text-duo-gray-800">Tactical Crossword</h3>
                    <p className="text-sm text-duo-gray-500 font-medium mt-1 line-clamp-2">
                        Test your knowledge of hitting mechanics and terminology in this grid-based challenge.
                    </p>
                </div>
                <div className="mt-auto">
                    <TacticalButton fullWidth onClick={() => setActiveGame('crossword')} icon={<PlayIcon size={18} />}>
                        Play Now
                    </TacticalButton>
                </div>
            </div>
        </div>

        {/* Solitaire Card */}
        <div className="bg-white border-2 border-duo-gray-200 rounded-3xl overflow-hidden hover:border-green-600 transition-all shadow-sm hover:shadow-lg group flex flex-col">
            <div className="h-48 relative flex items-center justify-center overflow-hidden bg-green-900">
                <img 
                    src="https://images.unsplash.com/photo-1589550458041-48f48b7b0277?w=800&auto=format&fit=crop&q=60" 
                    alt="Diamond Solitaire"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-green-800/60 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                <div className="text-center z-10 relative">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mx-auto mb-2 shadow-lg border border-white/30 transform group-hover:scale-110 transition-transform">
                        <LayoutGrid size={32} />
                    </div>
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-xl font-extrabold text-duo-gray-800">Diamond Solitaire</h3>
                    <p className="text-sm text-duo-gray-500 font-medium mt-1 line-clamp-2">
                        Clear the bases in this baseball-themed classic card game designed for quick mental reps.
                    </p>
                </div>
                <div className="mt-auto">
                    <TacticalButton fullWidth onClick={() => setActiveGame('solitaire')} icon={<PlayIcon size={18} />}>
                        Play Now
                    </TacticalButton>
                </div>
            </div>
        </div>

        {/* Tower Defense Card */}
        <div className="bg-white border-2 border-duo-gray-200 rounded-3xl overflow-hidden hover:border-duo-red transition-all shadow-sm hover:shadow-lg group flex flex-col">
            <div className="h-48 relative flex items-center justify-center overflow-hidden bg-duo-red">
                <img 
                    src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop&q=60" 
                    alt="Field General TD"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-duo-red/60 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                <div className="text-center z-10 relative">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mx-auto mb-2 shadow-lg border border-white/30 transform group-hover:scale-110 transition-transform">
                        <Shield size={32} />
                    </div>
                </div>
                <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-duo-blue text-white text-[10px] font-extrabold uppercase rounded-lg shadow-sm border border-white/20">
                        Beta
                    </span>
                </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                    <h3 className="text-xl font-extrabold text-duo-gray-800">Field General TD</h3>
                    <p className="text-sm text-duo-gray-500 font-medium mt-1 line-clamp-2">
                        Deploy defenders strategically to stop base runners from scoring in this tactical defense sim.
                    </p>
                </div>
                <div className="mt-auto">
                    <TacticalButton fullWidth onClick={() => setActiveGame('tower')} icon={<PlayIcon size={18} />}>
                        Play Now
                    </TacticalButton>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};
