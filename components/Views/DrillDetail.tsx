
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Play, Users, CheckCircle, ChevronDown, Brain, TrendingUp, TrendingDown, ClipboardCheck, Calendar } from 'lucide-react';
import { Drill } from '../../types';
import { TacticalButton } from '../ui/TacticalButton';
import { AssignToSquadModal } from './AssignmentModals';

interface DrillDetailProps {
  drill: Drill;
  onClose: () => void;
}

export const DrillDetail: React.FC<DrillDetailProps> = ({ drill, onClose }) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>('why');

  if (!drill) return null;

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {showAssignModal && (
        <AssignToSquadModal drill={drill} onClose={() => setShowAssignModal(false)} />
      )}

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden"
      >
        {/* Header Image */}
        <div className="relative h-48 w-full overflow-hidden shrink-0">
            <img src={drill.thumbnail} alt={drill.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/40 backdrop-blur rounded-full text-white transition-colors z-10"
            >
                <X size={24} />
            </button>
            
            <div className="absolute bottom-4 left-6 right-6 text-white flex justify-between items-end">
                <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                        <span className="px-3 py-1 bg-duo-green text-white text-xs font-extrabold uppercase rounded-lg shadow-sm">
                            {drill.category}
                        </span>
                        <span className="px-3 py-1 bg-white/20 text-white backdrop-blur text-xs font-extrabold uppercase rounded-lg">
                            {drill.difficulty}
                        </span>
                        <span className="px-3 py-1 bg-white/20 text-white backdrop-blur text-xs font-extrabold uppercase rounded-lg flex items-center gap-1">
                             <TrendingUp size={12} /> {drill.duration}
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold leading-none">{drill.title}</h2>
                </div>
                <div className="hidden sm:flex gap-2">
                    <TacticalButton onClick={() => {}} icon={<Play size={20} />}>
                        Start
                    </TacticalButton>
                     <TacticalButton variant="secondary" onClick={() => setShowAssignModal(true)} icon={<Users size={20} />}>
                        Assign
                    </TacticalButton>
                </div>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-[#111827]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Basic Info Card */}
                    <div className="bg-white p-6 rounded-2xl border-2 border-duo-gray-200 shadow-sm">
                        <h3 className="text-sm font-extrabold text-duo-gray-400 uppercase mb-3">Objective</h3>
                        <p className="text-duo-gray-300 text-lg font-medium leading-relaxed mb-6">
                            {drill.description}
                        </p>
                        
                        <h3 className="text-sm font-extrabold text-duo-gray-400 uppercase mb-3">Protocol (Steps)</h3>
                        <div className="space-y-2">
                            {drill.steps && drill.steps.length > 0 ? (
                                drill.steps.map((step, index) => (
                                    <div key={index} className="flex gap-3 items-start">
                                        <div className="w-6 h-6 shrink-0 bg-duo-gray-200 text-duo-gray-500 font-extrabold flex items-center justify-center rounded-lg text-sm mt-0.5">
                                            {index + 1}
                                        </div>
                                        <p className="text-duo-gray-300 font-bold text-sm leading-relaxed">{step}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-duo-gray-400 italic">No steps available.</p>
                            )}
                        </div>
                    </div>

                    {/* TACTICAL BRIEF ACCORDION */}
                    <div>
                        <h3 className="text-lg font-extrabold text-duo-gray-800 uppercase mb-4 flex items-center gap-2">
                            <Brain className="text-duo-blue" /> Coach's Tactical Brief
                        </h3>
                        
                        <div className="space-y-3">
                            
                            {/* 1. Why It Matters */}
                            {drill.whyItMatters && (
                                <AccordionItem 
                                    title="Why It Matters" 
                                    icon={<Brain size={20} className="text-duo-blue" />}
                                    isOpen={openSection === 'why'}
                                    onToggle={() => toggleSection('why')}
                                    colorClass="bg-duo-blue/5 border-duo-blue/20"
                                >
                                    <p className="text-duo-gray-300 font-medium leading-relaxed flex-1 min-w-0">
                                        {drill.whyItMatters}
                                    </p>
                                </AccordionItem>
                            )}

                            {/* 2. Mistakes & Corrections */}
                            {drill.commonMistakes && drill.commonMistakes.length > 0 && (
                                <AccordionItem 
                                    title="Common Mistakes & Fixes" 
                                    icon={<AlertTriangle size={20} className="text-duo-red" />}
                                    isOpen={openSection === 'mistakes'}
                                    onToggle={() => toggleSection('mistakes')}
                                    colorClass="bg-duo-red/5 border-duo-red/20"
                                >
                                    <div className="space-y-4">
                                        {drill.commonMistakes.map((item, idx) => (
                                            <div key={idx} className="bg-white border-l-4 border-duo-red p-3 rounded-r-xl shadow-sm flex flex-col">
                                                <div className="text-duo-red font-extrabold text-sm mb-1 flex items-start gap-2">
                                                    <TrendingDown size={16} className="shrink-0 mt-0.5" /> 
                                                    <div className="flex-1 text-wrap break-words w-0">Error: {item.mistake}</div>
                                                </div>
                                                <div className="text-duo-gray-300 text-sm font-medium pl-6 text-wrap break-words">
                                                    <span className="font-bold text-duo-green">Fix:</span> {item.correction}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionItem>
                            )}

                            {/* 3. Variations */}
                            {drill.variations && (
                                <AccordionItem 
                                    title="Progressive Variations" 
                                    icon={<TrendingUp size={20} className="text-duo-green" />}
                                    isOpen={openSection === 'variations'}
                                    onToggle={() => toggleSection('variations')}
                                    colorClass="bg-duo-green/5 border-duo-green/20"
                                >
                                    <div className="space-y-3">
                                        <div className="flex gap-3 items-start">
                                            <div className="bg-duo-yellow/20 text-duo-yellowDark px-2 py-0.5 rounded text-xs font-extrabold uppercase mt-1 shrink-0">Regression</div>
                                            <p className="text-duo-gray-300 text-sm flex-1 min-w-0">{drill.variations.regression}</p>
                                        </div>
                                        <div className="h-px bg-duo-gray-200 w-full"></div>
                                        <div className="flex gap-3 items-start">
                                            <div className="bg-duo-green/20 text-duo-green px-2 py-0.5 rounded text-xs font-extrabold uppercase mt-1 shrink-0">Progression</div>
                                            <p className="text-duo-gray-300 text-sm flex-1 min-w-0">{drill.variations.progression}</p>
                                        </div>
                                    </div>
                                </AccordionItem>
                            )}

                            {/* 4. Assessment */}
                            {drill.assessment && (
                                <AccordionItem 
                                    title="Assessment Criteria" 
                                    icon={<ClipboardCheck size={20} className="text-duo-purple" />}
                                    isOpen={openSection === 'assessment'}
                                    onToggle={() => toggleSection('assessment')}
                                    colorClass="bg-purple-50 border-purple-200"
                                >
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-xs font-extrabold text-duo-gray-400 uppercase mb-2">Visual Checkpoints</h4>
                                            <ul className="space-y-2">
                                                {drill.assessment.checkpoints.map((cp, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-sm text-duo-gray-300 font-bold">
                                                        <CheckCircle size={14} className="text-duo-green shrink-0 mt-1" /> 
                                                        <span className="flex-1 leading-tight min-w-0">{cp}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl border-2 border-purple-100">
                                            <h4 className="text-xs font-extrabold text-purple-600 uppercase mb-1">Ready to Progress When:</h4>
                                            <p className="text-sm text-duo-gray-300">{drill.assessment.readyToProgress}</p>
                                        </div>
                                    </div>
                                </AccordionItem>
                            )}

                            {/* 5. Context */}
                            {drill.context && (
                                <AccordionItem 
                                    title="Context & Application" 
                                    icon={<Calendar size={20} className="text-duo-yellowDark" />}
                                    isOpen={openSection === 'context'}
                                    onToggle={() => toggleSection('context')}
                                    colorClass="bg-duo-yellow/5 border-duo-yellow/20"
                                >
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <div className="text-xs font-extrabold text-duo-gray-400 uppercase">Season Phase</div>
                                            <div className="font-bold text-duo-gray-300">{drill.context.season}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-extrabold text-duo-gray-400 uppercase">Placement</div>
                                            <div className="font-bold text-duo-gray-300">{drill.context.placement}</div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-xs font-extrabold text-duo-gray-400 uppercase mb-1">Apply When:</div>
                                            <div className="flex flex-wrap gap-2">
                                                {drill.context.gameSituations.map((sit, idx) => (
                                                    <span key={idx} className="bg-white border border-duo-gray-200 px-2 py-1 rounded-lg text-xs font-bold text-duo-gray-400 whitespace-normal">
                                                        {sit}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </AccordionItem>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar Info */}
                <div className="space-y-6">
                    {drill.coachingPoints && drill.coachingPoints.length > 0 && (
                        <div className="bg-duo-yellow/10 border-2 border-duo-yellow/30 p-6 rounded-2xl">
                            <h3 className="flex items-center gap-2 text-duo-yellowDark font-extrabold uppercase text-sm mb-4">
                                <AlertTriangle size={18} />
                                Quick Cues
                            </h3>
                            <ul className="space-y-3">
                                {drill.coachingPoints.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-duo-gray-300 font-bold">
                                        <CheckCircle size={16} className="text-duo-yellowDark mt-0.5 shrink-0" />
                                        <span className="flex-1 leading-tight min-w-0">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="bg-white p-6 border-2 border-duo-gray-200 rounded-2xl shadow-sm">
                        <div className="mb-6">
                            <h4 className="text-xs font-extrabold text-duo-gray-400 uppercase mb-2">Duration</h4>
                            <p className="text-3xl font-extrabold text-duo-gray-800">{drill.duration}</p>
                        </div>

                        <div className="space-y-3 sm:hidden">
                          {/* Mobile Buttons appear here too if needed, currently in header */}
                          <TacticalButton fullWidth icon={<Play size={20} />}>
                              Start Drill
                          </TacticalButton>
                          <TacticalButton 
                            fullWidth 
                            variant="secondary" 
                            icon={<Users size={20} />}
                            onClick={() => setShowAssignModal(true)}
                          >
                              Assign to Squad
                          </TacticalButton>
                        </div>
                        
                        <div className="text-xs text-duo-gray-400 font-medium text-center mt-4">
                            Drill ID: {drill.id.toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

// Helper Accordion Component
const AccordionItem: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    colorClass?: string;
}> = ({ title, icon, children, isOpen, onToggle, colorClass = "bg-white" }) => {
    return (
        <div className={`rounded-2xl overflow-hidden border-2 transition-all ${isOpen ? colorClass : 'bg-white border-duo-gray-200 hover:border-duo-gray-300'}`}>
            <button 
                onClick={onToggle}
                className="w-full p-4 flex items-center justify-between text-left"
            >
                <div className="flex items-center gap-3">
                    <div className="shrink-0">{icon}</div>
                    <span className="font-extrabold text-duo-gray-800 text-sm uppercase">{title}</span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={20} className="text-duo-gray-400 shrink-0" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 border-t-2 border-black/5">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
