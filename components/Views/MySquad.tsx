
import React, { useState } from 'react';
import { Users, LayoutGrid, List, Mail, Globe } from 'lucide-react';
import { SQUAD_MEMBERS } from '../../constants';
import { TacticalButton } from '../ui/TacticalButton';
import { SquadMemberProfile } from './SquadMemberProfile';
import { ManageRosterModal } from './RosterManagement';
import { SquadInbox } from './SquadInbox';
import { SquadFeed } from './SquadFeed';
import { SquadMember, SavedCollection } from '../../types';
import { isFeatureEnabled } from '../../config/featureFlags';
import { ComingSoon } from '../ComingSoon';

interface MySquadProps {
  initialShowInbox?: boolean;
  onSavePost: (postId: string) => void;
  savedCollections: SavedCollection[];
}

export const MySquad: React.FC<MySquadProps> = ({ initialShowInbox = false, onSavePost, savedCollections }) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'feed'>('roster');
  const [squadList, setSquadList] = useState<SquadMember[]>(SQUAD_MEMBERS);
  const [selectedMember, setSelectedMember] = useState<SquadMember | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [showInbox, setShowInbox] = useState(initialShowInbox);

  if (!isFeatureEnabled('SQUAD_MANAGEMENT')) {
    return (
      <ComingSoon 
        featureName="Squad Management"
        description="Track your team roster, assign drills and modules to players, and monitor individual player progress through the BVSA curriculum."
        icon="👥"
        estimatedLaunch="Q2 2026"
      />
    );
  }

  const handleAddMember = (newMember: SquadMember) => {
    setSquadList([...squadList, newMember]);
  };

  const handleRemoveMember = (id: string) => {
    setSquadList(squadList.filter(m => m.id !== id));
    if (selectedMember?.id === id) {
        setSelectedMember(null);
    }
  };

  if (selectedMember) {
      return <SquadMemberProfile member={selectedMember} onBack={() => setSelectedMember(null)} />;
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      {isManageModalOpen && (
          <ManageRosterModal 
            members={squadList}
            onAdd={handleAddMember}
            onRemove={handleRemoveMember}
            onClose={() => setIsManageModalOpen(false)}
          />
      )}

      {showInbox && (
        <SquadInbox onClose={() => setShowInbox(false)} />
      )}

      {/* Top Header & Navigation */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-duo-gray-800 mb-2">My Squad</h1>
          <p className="text-duo-gray-500 font-bold">Manage your roster and team communications.</p>
        </div>
        
        {/* Main Tab Toggle */}
        <div className="flex bg-duo-gray-100 p-1 rounded-xl border-2 border-duo-gray-200">
             <button
                onClick={() => setActiveTab('roster')}
                className={`px-6 py-2 rounded-lg font-extrabold uppercase text-sm transition-all flex items-center gap-2 ${
                    activeTab === 'roster' 
                    ? 'bg-white text-duo-blue shadow-sm' 
                    : 'text-duo-gray-400 hover:text-duo-gray-800'
                }`}
             >
                <Users size={18} />
                Roster
             </button>
             <button
                onClick={() => setActiveTab('feed')}
                className={`px-6 py-2 rounded-lg font-extrabold uppercase text-sm transition-all flex items-center gap-2 ${
                    activeTab === 'feed' 
                    ? 'bg-white text-duo-green shadow-sm' 
                    : 'text-duo-gray-400 hover:text-duo-gray-800'
                }`}
             >
                <Globe size={18} />
                Squad Feed
             </button>
        </div>
      </header>

      {/* Tab Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'roster' ? (
              <>
                {/* Roster Controls */}
                <div className="flex justify-end items-center gap-4 mb-6 shrink-0">
                    <div className="flex bg-duo-gray-200 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-duo-blue shadow-sm' : 'text-duo-gray-500 hover:text-duo-gray-800'}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-duo-blue shadow-sm' : 'text-duo-gray-500 hover:text-duo-gray-800'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>

                    <TacticalButton 
                        variant="secondary"
                        icon={<Mail size={20} />}
                        onClick={() => setShowInbox(true)}
                    >
                        Inbox
                    </TacticalButton>

                    <TacticalButton 
                        variant="primary" 
                        icon={<Users size={20} />}
                        onClick={() => setIsManageModalOpen(true)}
                    >
                        Manage Roster
                    </TacticalButton>
                </div>

                {/* Roster Grid/List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pb-8">
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {squadList.map((member) => (
                            <div 
                                key={member.id} 
                                onClick={() => setSelectedMember(member)}
                                className={`bg-white border-2 border-duo-gray-200 rounded-2xl p-6 relative overflow-hidden hover:border-duo-blue transition-all cursor-pointer shadow-sm hover:-translate-y-1 hover:shadow-md group`}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-duo-gray-100 rounded-2xl border-2 border-duo-gray-200 flex items-center justify-center text-lg font-extrabold text-duo-gray-400 overflow-hidden">
                                            {member.avatarUrl ? (
                                                <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                member.avatar
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-extrabold text-xl text-duo-gray-800 group-hover:text-duo-blue transition-colors">{member.name}</h3>
                                            <span className="text-xs font-bold text-duo-gray-400 uppercase">{member.role}</span>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                                        member.status === 'Active' ? 'bg-duo-green/10 text-duo-green' : 
                                        member.status === 'Injured' ? 'bg-duo-red/10 text-duo-red' : 'bg-duo-yellow/10 text-duo-yellowDark'
                                    }`}>
                                        {member.status}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1.5">
                                            <span className="text-duo-gray-400 uppercase">Readiness</span>
                                            <span className={`${member.readiness < 70 ? 'text-duo-red' : 'text-duo-green'}`}>{member.readiness}%</span>
                                        </div>
                                        <div className="w-full h-3 bg-duo-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${member.readiness < 70 ? 'bg-duo-red' : 'bg-duo-green'}`} 
                                                style={{ width: `${member.readiness}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2 pt-4 border-t-2 border-duo-gray-100">
                                        {member.stats.slice(0, 2).map((stat, i) => (
                                            <div key={i} className="text-center bg-duo-gray-50 rounded-xl p-2">
                                                <div className="text-[10px] font-bold text-duo-gray-400 uppercase">{stat.label}</div>
                                                <div className="text-sm font-extrabold text-duo-gray-800">{stat.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border-2 border-duo-gray-200 rounded-2xl overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-duo-gray-100 text-xs font-extrabold text-duo-gray-500 uppercase tracking-wider border-b-2 border-duo-gray-200">
                                        <th className="p-4">Athlete</th>
                                        <th className="p-4">Position</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 w-1/4">Readiness</th>
                                        <th className="p-4">Key Stats</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {squadList.map((member, index) => (
                                        <tr 
                                            key={member.id}
                                            onClick={() => setSelectedMember(member)}
                                            className={`border-b border-duo-gray-100 hover:bg-duo-blue/5 transition-colors cursor-pointer group ${
                                                index === squadList.length - 1 ? 'border-b-0' : ''
                                            }`}
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-duo-gray-100 rounded-xl flex items-center justify-center text-xs font-extrabold text-duo-gray-400 group-hover:bg-white group-hover:text-duo-blue group-hover:border-2 group-hover:border-duo-blue transition-all overflow-hidden">
                                                        {member.avatarUrl ? (
                                                            <img src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            member.avatar
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-extrabold text-duo-gray-800 text-sm group-hover:text-duo-blue">{member.name}</div>
                                                        <div className="text-xs text-duo-gray-400">#{member.number}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="text-sm font-bold text-duo-gray-700">{member.role}</div>
                                                <div className="text-xs text-duo-gray-400">{member.secondaryRole || '-'}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase inline-flex items-center gap-1 ${
                                                    member.status === 'Active' ? 'bg-duo-green/10 text-duo-green' : 
                                                    member.status === 'Injured' ? 'bg-duo-red/10 text-duo-red' : 'bg-duo-yellow/10 text-duo-yellowDark'
                                                }`}>
                                                    {member.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-3 bg-duo-gray-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full ${member.readiness < 70 ? 'bg-duo-red' : 'bg-duo-green'}`} 
                                                            style={{ width: `${member.readiness}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`text-xs font-extrabold ${member.readiness < 70 ? 'text-duo-red' : 'text-duo-green'}`}>
                                                        {member.readiness}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-4">
                                                    {member.stats.slice(0, 2).map((stat, i) => (
                                                        <div key={i}>
                                                            <div className="text-[10px] font-bold text-duo-gray-400 uppercase">{stat.label}</div>
                                                            <div className="text-xs font-bold text-duo-gray-700">{stat.value}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
              </>
          ) : (
              <SquadFeed onSavePost={onSavePost} savedCollections={savedCollections} />
          )}
      </div>
    </div>
  );
};
