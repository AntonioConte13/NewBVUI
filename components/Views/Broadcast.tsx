
import React from 'react';
import { SquadFeed } from './SquadFeed';
import { SavedCollection } from '../../types';
import { Globe } from 'lucide-react';
import { isFeatureEnabled } from '../../config/featureFlags';
import { ComingSoon } from '../ComingSoon';

interface BroadcastProps {
  onSavePost: (postId: string) => void;
  savedCollections: SavedCollection[];
}

export const Broadcast: React.FC<BroadcastProps> = ({ onSavePost, savedCollections }) => {
  if (!isFeatureEnabled('SOCIAL_FEED')) {
    return (
      <ComingSoon 
        featureName="Global Broadcast"
        description="Connect with fellow coaches! Share drills, discuss strategies, and learn from the BVSA community. Get feedback from Bobby V and certified instructors."
        icon="🌍"
        estimatedLaunch="Q3 2026"
      />
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-end">
        <div>
            <h1 className="text-3xl font-extrabold text-duo-gray-800 mb-2 flex items-center gap-3">
                <Globe size={32} className="text-duo-blue" />
                Global Broadcast
            </h1>
            <p className="text-duo-gray-500 font-bold">Community intel and squad updates.</p>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
         <SquadFeed onSavePost={onSavePost} savedCollections={savedCollections} />
      </div>
    </div>
  );
};
