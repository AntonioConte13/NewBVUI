
import React, { useState, useEffect } from 'react';
import { Map, Database, Users, User, Settings, LogOut, Bot, Gamepad2, Menu, X, ShieldAlert, Sun, Moon, Globe, Compass, Wallet } from 'lucide-react';
import { ViewState } from '../../types';
import { isFeatureEnabled } from '../../config/featureFlags';

interface SidebarProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Sync state with DOM on mount
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const navItems = [
    { id: 'tactical', label: 'BVAI Chat', icon: <Bot size={24} /> },
    { id: 'profile', label: 'Dashboard', icon: <User size={24} /> },
    { id: 'armory', label: 'Drill DataBase', icon: <Database size={24} /> },
    { id: 'certification', label: 'Pathway', icon: <Map size={24} /> },
    { id: 'pathway2', label: 'Pathway 2', icon: <Compass size={24} /> },
    { id: 'broadcast', label: 'Social Feed', icon: <Globe size={24} /> },
    { id: 'overwatch', label: 'Overwatch', icon: <ShieldAlert size={24} /> },
  ];

  const handleNavigation = (id: string) => {
    setCurrentView(id as ViewState);
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    setCurrentView('profile');
    setIsMobileMenuOpen(false);
  };

  // Check if a nav item is disabled by a feature flag
  const isItemSoon = (id: string) => {
    if (id === 'play') return !isFeatureEnabled('GAMES');
    if (id === 'my-squad') return !isFeatureEnabled('SQUAD_MANAGEMENT');
    if (id === 'broadcast') return !isFeatureEnabled('SOCIAL_FEED');
    return false;
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b-2 border-duo-gray-200 z-40 flex items-center justify-between px-4 shadow-sm">
        <button 
          onClick={handleLogoClick}
          className="font-extrabold text-xl tracking-tight flex items-center gap-0.5 hover:opacity-80 transition-opacity"
        >
          <span className="text-duo-gray-800">B</span>
          <span className="text-duo-green text-2xl">V</span>
          <span className="text-duo-gray-800">AI</span>
        </button>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 text-duo-gray-500 hover:bg-duo-gray-100 rounded-xl transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Container - Increased Z-Index to 60 to sit above sticky page headers (z-40/50) */}
      <aside className={`
        w-64 h-screen bg-white border-r-2 border-duo-gray-200 flex flex-col fixed left-0 top-0 z-[60] 
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        md:translate-x-0 md:shadow-none
      `}>
        <div className="h-24 flex flex-col justify-center px-6 border-b-2 border-duo-gray-200 bg-duo-gray-100/50 relative">
          <div className="flex justify-between items-center">
              <button 
                onClick={handleLogoClick}
                className="font-extrabold text-3xl tracking-tight flex items-center gap-0.5 hover:opacity-80 transition-opacity text-left"
              >
                <span className="text-duo-gray-800">B</span>
                <span className="text-duo-green text-4xl">V</span>
                <span className="text-duo-gray-800">AI</span>
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="md:hidden p-2 text-duo-gray-400 hover:text-duo-red transition-colors"
              >
                <X size={24} />
              </button>
          </div>
          <button 
            onClick={handleLogoClick}
            className="text-[0.55rem] font-extrabold uppercase tracking-wider text-duo-gray-400 leading-tight mt-1 text-left hover:text-duo-blue transition-colors"
          >
            Bobby Valentine's<br/>Academy Intelligence
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-extrabold uppercase tracking-wide transition-all duration-200 ${
                (currentView === item.id || (item.id === 'my-squad' && currentView === 'video-inbox'))
                  ? 'bg-duo-blue/10 text-duo-blue border-2 border-duo-blue'
                  : 'text-duo-gray-500 hover:bg-duo-gray-100 border-2 border-transparent'
              }`}
            >
              {item.icon}
              {item.label}
              {isItemSoon(item.id) && (
                <span className="ml-auto px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-500 rounded">
                  Soon
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t-2 border-duo-gray-200 space-y-1">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-duo-gray-400 hover:text-duo-green transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-duo-gray-400 hover:text-duo-gray-800 transition-colors">
            <Settings size={20} /> Settings
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-duo-gray-400 hover:text-duo-red transition-colors">
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
