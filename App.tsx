import React, { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Views/Dashboard';
import { Certification } from './components/Views/Certification';
import { Pathway2 } from './components/Views/Pathway2';
import { Armory } from './components/Views/Armory';
import { MySquad } from './components/Views/MySquad';
import { TacticalOps } from './components/Views/TacticalOps';
import { Broadcast } from './components/Views/Broadcast';
import { QuizBuilder } from './components/Views/QuizBuilder';
import { Play } from './components/Views/Play';
import { Overwatch } from './components/Views/Overwatch';
import { Leaderboards } from './components/Views/Leaderboards';
import { BobbyBank } from './components/Views/BobbyBank';
import { ViewState, SavedCollection } from './types';
import { INITIAL_SAVED_COLLECTIONS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('profile');
  const [savedCollections, setSavedCollections] = useState<SavedCollection[]>(INITIAL_SAVED_COLLECTIONS);
  
  // Global XP State to synchronize Dashboard, Pathway, and League
  const [userXP, setUserXP] = useState(2450);

  // Admin Override State
  const [isAdminUnlockEnabled, setIsAdminUnlockEnabled] = useState(false);

  const addXP = (amount: number) => {
    setUserXP(prev => prev + amount);
  };

  const handleSavePost = (postId: string) => {
    setSavedCollections(prev => {
      // Find Intel folder
      const intelIndex = prev.findIndex(c => c.title === 'Intel');
      
      if (intelIndex >= 0) {
        const newCollections = [...prev];
        const collection = {...newCollections[intelIndex]};

        // Toggle post ID in the Intel folder
        if (collection.postIds.includes(postId)) {
           collection.postIds = collection.postIds.filter(id => id !== postId);
        } else {
           collection.postIds = [...collection.postIds, postId];
        }
        newCollections[intelIndex] = collection;
        return newCollections;
      } else {
          // Create Intel folder if missing and add post
          return [...prev, {
              id: `col-${Date.now()}`,
              title: 'Intel',
              color: '#10B981', // Green
              postIds: [postId]
          }];
      }
    });
  };

  const renderView = () => {
    switch (currentView) {
      case 'certification':
        return <Certification userXP={userXP} addXP={addXP} />;
      case 'pathway2':
        return <Pathway2 userXP={userXP} addXP={addXP} isAdminUnlockEnabled={isAdminUnlockEnabled} />;
      case 'armory':
        return <Armory />;
      case 'my-squad':
        return <MySquad onSavePost={handleSavePost} savedCollections={savedCollections} />;
      case 'video-inbox':
        return <MySquad initialShowInbox={true} onSavePost={handleSavePost} savedCollections={savedCollections} />;
      case 'tactical':
        return <TacticalOps onSavePost={handleSavePost} savedCollections={savedCollections} />;
      case 'broadcast':
        return <Broadcast onSavePost={handleSavePost} savedCollections={savedCollections} />;
      case 'quiz-builder':
        return <QuizBuilder />;
      case 'play':
        return <Play />;
      case 'overwatch':
        return (
          <Overwatch 
            isAdminUnlockEnabled={isAdminUnlockEnabled} 
            setIsAdminUnlockEnabled={setIsAdminUnlockEnabled} 
            setCurrentView={setCurrentView}
          />
        );
      case 'leaderboards':
        return <Leaderboards userXP={userXP} />;
      case 'bobby-bank':
        return <BobbyBank />;
      case 'profile':
        return (
          <Dashboard 
            savedCollections={savedCollections} 
            setSavedCollections={setSavedCollections} 
            setCurrentView={setCurrentView} 
            userXP={userXP}
          />
        );
      default:
        return (
          <Dashboard 
            savedCollections={savedCollections} 
            setSavedCollections={setSavedCollections} 
            setCurrentView={setCurrentView} 
            userXP={userXP}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-duo-gray-800 font-sans selection:bg-duo-green selection:text-white overflow-hidden">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 md:ml-64 min-h-screen relative overflow-y-auto custom-scrollbar pt-16 md:pt-0 transition-all duration-300">
        <div className="p-4 md:p-8 max-w-7xl mx-auto pt-6 md:pt-10 pb-20">
            {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;