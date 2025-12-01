
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, UserPlus, Trash2, Users } from 'lucide-react';
import { SquadMember } from '../../types';
import { TacticalButton } from '../ui/TacticalButton';

interface ManageRosterModalProps {
  members: SquadMember[];
  onAdd: (member: SquadMember) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

export const ManageRosterModal: React.FC<ManageRosterModalProps> = ({ members, onAdd, onRemove, onClose }) => {
  const [view, setView] = useState<'list' | 'add'>('list');
  
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [role, setRole] = useState('Utility');

  const handleDeployRecruit = () => {
    if (!name || !number) return;

    const newMember: SquadMember = {
      id: `s-${Date.now()}`,
      name: name.toUpperCase(),
      number,
      role,
      secondaryRole: 'Recruit',
      status: 'Active',
      readiness: 100,
      avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      height: 'TBD',
      weight: 'TBD',
      bats: 'R',
      throws: 'R',
      age: 16,
      stats: [{ label: 'Status', value: 'New' }],
      attributes: [{ name: 'Potential', value: 50 }],
      bio: 'New athlete added to the roster.',
      assignments: []
    };

    onAdd(newMember);
    setName('');
    setNumber('');
    setView('list');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-2xl bg-white border-2 border-duo-gray-200 rounded-3xl shadow-2xl flex flex-col h-[600px] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b-2 border-duo-gray-100 flex justify-between items-center bg-white">
            <div>
                <h2 className="text-xl font-extrabold text-duo-gray-800 flex items-center gap-2">
                    Manage Roster
                </h2>
            </div>
            <button onClick={onClose} className="text-duo-gray-400 hover:bg-duo-gray-100 p-2 rounded-full transition-colors">
                <X size={24} />
            </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-48 border-r-2 border-duo-gray-100 bg-duo-gray-50 p-4 space-y-2 shrink-0">
                <button 
                    onClick={() => setView('list')}
                    className={`w-full text-left px-4 py-3 text-sm font-extrabold uppercase rounded-xl transition-all ${
                        view === 'list' 
                        ? 'bg-white border-2 border-duo-blue text-duo-blue shadow-sm' 
                        : 'text-duo-gray-400 hover:bg-duo-gray-200'
                    }`}
                >
                    Current Roster
                </button>
                <button 
                    onClick={() => setView('add')}
                    className={`w-full text-left px-4 py-3 text-sm font-extrabold uppercase rounded-xl transition-all ${
                        view === 'add' 
                        ? 'bg-white border-2 border-duo-blue text-duo-blue shadow-sm' 
                        : 'text-duo-gray-400 hover:bg-duo-gray-200'
                    }`}
                >
                    Add Athlete
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-white overflow-y-auto custom-scrollbar p-6">
                {view === 'list' ? (
                    <div className="space-y-3">
                        {members.map(member => (
                            <div key={member.id} className="flex items-center justify-between p-3 bg-white border-2 border-duo-gray-200 rounded-2xl hover:border-duo-blue transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-duo-gray-100 rounded-xl flex items-center justify-center text-sm font-extrabold text-duo-gray-400">
                                        {member.avatar}
                                    </div>
                                    <div>
                                        <div className="font-extrabold text-duo-gray-800 text-sm">{member.name}</div>
                                        <div className="text-xs text-duo-gray-400 font-bold">#{member.number} • {member.role}</div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onRemove(member.id)}
                                    className="p-2 text-duo-gray-400 hover:text-duo-red hover:bg-duo-red/10 rounded-xl transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                        {members.length === 0 && (
                             <div className="text-center p-8 border-2 border-dashed border-duo-gray-200 rounded-2xl text-duo-gray-400 text-sm font-bold">
                                Your roster is empty.
                             </div>
                        )}
                    </div>
                ) : (
                    <div className="max-w-md mx-auto space-y-6">
                        <h3 className="text-lg font-extrabold text-duo-gray-800">New Recruit</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase font-extrabold text-duo-gray-500 mb-2">Full Name</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-duo-gray-50 border-2 border-duo-gray-200 rounded-xl p-3 text-sm focus:border-duo-blue focus:bg-white focus:outline-none font-bold placeholder-duo-gray-300 transition-all"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase font-extrabold text-duo-gray-500 mb-2">Jersey #</label>
                                    <input 
                                        type="text" 
                                        value={number}
                                        onChange={(e) => setNumber(e.target.value)}
                                        className="w-full bg-duo-gray-50 border-2 border-duo-gray-200 rounded-xl p-3 text-sm focus:border-duo-blue focus:bg-white focus:outline-none font-bold transition-all"
                                        placeholder="00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-extrabold text-duo-gray-500 mb-2">Position</label>
                                    <select 
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="w-full bg-duo-gray-50 border-2 border-duo-gray-200 rounded-xl p-3 text-sm focus:border-duo-blue focus:bg-white focus:outline-none font-bold transition-all"
                                    >
                                        <option value="Pitcher">Pitcher</option>
                                        <option value="Catcher">Catcher</option>
                                        <option value="Infield">Infield</option>
                                        <option value="Outfield">Outfield</option>
                                        <option value="Utility">Utility</option>
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4">
                                <TacticalButton fullWidth onClick={handleDeployRecruit} icon={<UserPlus size={20}/>}>
                                    Add to Roster
                                </TacticalButton>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </motion.div>
    </div>
  );
};