
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Check, Search } from 'lucide-react';
import { Drill, SquadMember } from '../../types';
import { SQUAD_MEMBERS, DRILLS } from '../../constants';
import { TacticalButton } from '../ui/TacticalButton';

interface AssignToSquadModalProps {
  drill: Drill;
  onClose: () => void;
}

export const AssignToSquadModal: React.FC<AssignToSquadModalProps> = ({ drill, onClose }) => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const toggleMember = (id: string) => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(m => m !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const handleAssign = () => {
    // Mock API call / assignment logic
    setConfirmed(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-lg bg-tactical-card border border-tactical-border shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[80vh]"
      >
        <div className="p-6 border-b border-tactical-border flex justify-between items-center bg-tactical-surface">
          <div>
            <h2 className="text-lg font-display font-bold uppercase text-white">Deploy Protocol</h2>
            <p className="text-xs text-gray-500 font-mono">ASSIGN: {drill.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          {!confirmed ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-400 mb-4">Select squad members to receive this drill assignment:</p>
              {SQUAD_MEMBERS.map(member => {
                const isSelected = selectedMembers.includes(member.id);
                return (
                  <div 
                    key={member.id}
                    onClick={() => toggleMember(member.id)}
                    className={`flex items-center justify-between p-3 border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-tactical-surface border-tactical-red text-white' 
                        : 'bg-tactical-black border-tactical-border text-gray-500 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono border ${
                        isSelected ? 'border-tactical-red text-tactical-red bg-black' : 'border-gray-700 bg-gray-900'
                      }`}>
                        {member.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-sm uppercase">{member.name}</div>
                        <div className="text-[10px] opacity-70">{member.role}</div>
                      </div>
                    </div>
                    <div className={`w-5 h-5 border flex items-center justify-center ${
                      isSelected ? 'bg-tactical-red border-tactical-red' : 'border-gray-600'
                    }`}>
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
               <div className="w-16 h-16 border-2 border-green-500 rounded-full flex items-center justify-center mb-4 bg-green-900/20 text-green-500">
                 <Check size={32} />
               </div>
               <h3 className="text-xl font-display font-bold uppercase text-white">Orders Transmitted</h3>
               <p className="text-gray-400 text-sm mt-2">Drill protocol assigned to {selectedMembers.length} personnel.</p>
            </div>
          )}
        </div>

        {!confirmed && (
          <div className="p-6 border-t border-tactical-border bg-tactical-surface">
            <TacticalButton 
              fullWidth 
              onClick={handleAssign} 
              disabled={selectedMembers.length === 0}
              className={selectedMembers.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Confirm Assignment ({selectedMembers.length})
            </TacticalButton>
          </div>
        )}
      </motion.div>
    </div>
  );
};

interface AssignDrillToPlayerModalProps {
  member: SquadMember;
  onClose: () => void;
}

export const AssignDrillToPlayerModal: React.FC<AssignDrillToPlayerModalProps> = ({ member, onClose }) => {
  const [search, setSearch] = useState('');
  const [selectedDrillId, setSelectedDrillId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const filteredDrills = DRILLS.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) || 
    d.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssign = () => {
    setConfirmed(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-lg bg-tactical-card border border-tactical-border shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[80vh]"
      >
         <div className="p-6 border-b border-tactical-border flex justify-between items-center bg-tactical-surface">
          <div>
            <h2 className="text-lg font-display font-bold uppercase text-white">Assign Protocol</h2>
            <p className="text-xs text-gray-500 font-mono">TARGET: {member.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
           {!confirmed ? (
             <>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                  <input
                    type="text"
                    placeholder="SEARCH DATABASE..."
                    className="w-full bg-tactical-black border border-tactical-border text-white pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-tactical-red font-mono"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  {filteredDrills.map(drill => {
                    const isSelected = selectedDrillId === drill.id;
                    return (
                      <div 
                        key={drill.id}
                        onClick={() => setSelectedDrillId(drill.id)}
                        className={`flex items-center gap-3 p-3 border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-tactical-surface border-tactical-red text-white' 
                            : 'bg-tactical-black border-tactical-border text-gray-500 hover:border-gray-600'
                        }`}
                      >
                         <img src={drill.thumbnail} alt="" className="w-12 h-8 object-cover opacity-70" />
                         <div className="flex-1">
                            <div className="font-bold text-sm uppercase leading-none mb-1">{drill.title}</div>
                            <div className="text-[10px] font-mono">{drill.category} // {drill.difficulty}</div>
                         </div>
                         {isSelected && <Check size={16} className="text-tactical-red" />}
                      </div>
                    );
                  })}
                </div>
             </>
           ) : (
             <div className="flex flex-col items-center justify-center py-10 h-full">
               <div className="w-16 h-16 border-2 border-green-500 rounded-full flex items-center justify-center mb-4 bg-green-900/20 text-green-500">
                 <Check size={32} />
               </div>
               <h3 className="text-xl font-display font-bold uppercase text-white">Assignment Confirmed</h3>
               <p className="text-gray-400 text-sm mt-2">Protocol added to {member.name}'s directives.</p>
            </div>
           )}
        </div>

        {!confirmed && (
          <div className="p-6 border-t border-tactical-border bg-tactical-surface">
            <TacticalButton 
              fullWidth 
              onClick={handleAssign} 
              disabled={!selectedDrillId}
              className={!selectedDrillId ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Confirm Assignment
            </TacticalButton>
          </div>
        )}
      </motion.div>
    </div>
  );
};
