

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Activity, Target, FileText, CheckCircle, Clock, Circle, Calendar, Brain, TrendingUp, TrendingDown, Plus, AlertTriangle, Video, PlayCircle, Camera, Image as ImageIcon } from 'lucide-react';
import { SquadMember, Drill, VideoSubmission } from '../../types';
import { DRILLS } from '../../constants';
import { TacticalButton } from '../ui/TacticalButton';
import { motion, AnimatePresence } from 'framer-motion';
import { AssignDrillToPlayerModal } from './AssignmentModals';
import { VideoAnalysisModal } from './VideoAnalysisModal';

interface SquadMemberProfileProps {
  member: SquadMember;
  onBack: () => void;
}

export const SquadMemberProfile: React.FC<SquadMemberProfileProps> = ({ member, onBack }) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoSubmission | null>(null);
  const [assignments, setAssignments] = useState(member.assignments || []);
  
  // Profile Images State
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(member.avatarUrl);
  const [coverUrl, setCoverUrl] = useState<string | undefined>(member.coverUrl);

  const VISIBLE_LIMIT = 3;

  const getDrillDetails = (drillId: string): Drill | undefined => {
    return DRILLS.find(d => d.id === drillId);
  };

  const toggleAssignmentStatus = (assignmentId: string) => {
    setAssignments(prev => prev.map(a => {
        if (a.id === assignmentId) {
            return { ...a, status: a.status === 'Pending' ? 'Completed' : 'Pending' };
        }
        return a;
    }));
  };

  // Image Upload Handlers
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setAvatarUrl(url);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setCoverUrl(url);
    }
  };

  const { strengths, weaknesses, recommendations } = useMemo(() => {
    const sortedAttrs = [...member.attributes].sort((a, b) => b.value - a.value);
    const strengths = sortedAttrs.filter(a => a.value >= 85);
    const weaknesses = sortedAttrs.filter(a => a.value <= 78);
    
    const existingIds = assignments.map(a => a.drillId);
    const recs = DRILLS
        .filter(d => !existingIds.includes(d.id))
        .slice(0, 2);

    return { strengths, weaknesses, recommendations: recs };
  }, [member, assignments]);

  return (
    <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6 pb-20"
    >
      {showAssignModal && (
        <AssignDrillToPlayerModal member={member} onClose={() => setShowAssignModal(false)} />
      )}

      {selectedVideo && (
        <VideoAnalysisModal 
            video={selectedVideo} 
            player={member} 
            onClose={() => setSelectedVideo(null)} 
        />
      )}

      <div className="flex items-center gap-4 mb-6">
        <button 
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-duo-gray-200 text-duo-gray-500 transition-colors"
        >
            <ArrowLeft size={24} />
        </button>
        <div>
            <h1 className="text-3xl font-extrabold text-duo-gray-800">{member.name}</h1>
            <p className="text-duo-gray-500 font-bold">#{member.number} • {member.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Bio & Attributes */}
        <div className="space-y-6">
            <div className="bg-white border-2 border-duo-gray-200 rounded-3xl overflow-hidden shadow-sm group relative">
                {/* Cover Image Area */}
                <div className="h-32 bg-duo-gray-100 relative group/cover">
                    {coverUrl ? (
                        <img src={coverUrl} className="w-full h-full object-cover" alt="Cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-duo-blue to-duo-blueDark opacity-80" />
                    )}
                    <div className="absolute inset-0 bg-black/10 group-hover/cover:bg-black/20 transition-colors"></div>
                    <label className="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 text-white rounded-xl cursor-pointer backdrop-blur-sm transition-all opacity-0 group-hover/cover:opacity-100 flex items-center gap-2">
                        <Camera size={16} />
                        <span className="text-xs font-bold hidden sm:inline">Edit Cover</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                    </label>
                </div>

                {/* Profile Content Wrapper */}
                <div className="px-6 pb-6 flex flex-col items-center text-center relative">
                    
                    {/* Avatar - Negative Margin to pull it up */}
                    <div className="-mt-16 mb-4 relative group/avatar"> 
                         <div className="w-32 h-32 rounded-3xl border-[6px] border-white shadow-md bg-duo-gray-100 overflow-hidden flex items-center justify-center text-4xl font-extrabold text-duo-gray-400">
                            {avatarUrl ? (
                                <img src={avatarUrl} className="w-full h-full object-cover" alt={member.name} />
                            ) : (
                                member.avatar
                            )}
                         </div>
                         <label className="absolute bottom-[-8px] right-[-8px] p-2.5 bg-duo-gray-800 text-white rounded-xl border-4 border-white cursor-pointer shadow-sm hover:scale-105 transition-transform">
                            <Camera size={16} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                         </label>
                    </div>

                    {/* Basic Info Below Avatar */}
                    <div className="w-full space-y-4">
                        <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-duo-gray-50 p-2 rounded-xl">
                                <div className="text-xs font-bold text-duo-gray-400 uppercase">Height</div>
                                <div className="font-extrabold text-duo-gray-800">{member.height}</div>
                            </div>
                            <div className="bg-duo-gray-50 p-2 rounded-xl">
                                <div className="text-xs font-bold text-duo-gray-400 uppercase">Weight</div>
                                <div className="font-extrabold text-duo-gray-800">{member.weight}</div>
                            </div>
                            <div className="bg-duo-gray-50 p-2 rounded-xl">
                                <div className="text-xs font-bold text-duo-gray-400 uppercase">Age</div>
                                <div className="font-extrabold text-duo-gray-800">{member.age}</div>
                            </div>
                        </div>

                        <div className="text-left bg-duo-blue/5 p-4 rounded-2xl border-2 border-duo-blue/10">
                            <h4 className="text-xs font-extrabold text-duo-blue uppercase mb-1">Coach's Notes</h4>
                            <p className="text-sm font-bold text-duo-gray-600 italic">"{member.bio}"</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border-2 border-duo-gray-200 rounded-3xl p-6 shadow-sm">
                <h3 className="text-lg font-extrabold text-duo-gray-800 mb-4 flex items-center gap-2">
                    <Brain className="text-duo-purple" size={24} />
                    Attributes
                </h3>
                <div className="space-y-4">
                    {member.attributes.map((attr, idx) => (
                    <div key={idx}>
                        <div className="flex justify-between text-sm font-bold mb-1">
                            <span className="text-duo-gray-500">{attr.name}</span>
                            <span className="text-duo-gray-800">{attr.value}</span>
                        </div>
                        <div className="w-full h-3 bg-duo-gray-100 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${attr.value}%` }}
                                className={`h-full rounded-full ${attr.value >= 85 ? 'bg-duo-green' : attr.value <= 70 ? 'bg-duo-red' : 'bg-duo-yellow'}`}
                            />
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Center/Right: Performance Data */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {member.stats.map((stat, i) => (
                     <div key={i} className="bg-white border-2 border-duo-gray-200 rounded-2xl p-4 text-center shadow-sm hover:-translate-y-1 transition-transform">
                         <div className="text-xs font-extrabold text-duo-gray-400 uppercase mb-1">{stat.label}</div>
                         <div className="text-xl font-extrabold text-duo-blue">{stat.value}</div>
                     </div>
                 ))}
            </div>

             {/* Video / Media Section - NEW */}
             <div className="bg-white border-2 border-duo-gray-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-extrabold text-duo-gray-800 flex items-center gap-2">
                        <Video size={24} className="text-duo-red" />
                        Media Analysis
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {member.videos && member.videos.length > 0 ? (
                        member.videos.map(video => (
                            <div 
                                key={video.id}
                                onClick={() => setSelectedVideo(video)} 
                                className="group relative bg-black rounded-xl overflow-hidden aspect-video cursor-pointer border-2 border-transparent hover:border-duo-red transition-all"
                            >
                                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                                
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <PlayCircle size={48} className="text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" fill="rgba(0,0,0,0.5)" />
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                                    <div className="text-white text-sm font-extrabold truncate">{video.title}</div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-[10px] text-gray-300 font-mono uppercase">{video.date}</span>
                                        {video.status === 'New' && (
                                            <span className="px-2 py-0.5 bg-duo-red text-white text-[10px] font-extrabold uppercase rounded-full">New</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 p-6 text-center border-2 border-dashed border-duo-gray-200 rounded-2xl text-duo-gray-400 text-sm font-bold">
                            No video submissions yet.
                        </div>
                    )}
                </div>
             </div>

            {/* Assignments */}
            <div className="bg-white border-2 border-duo-gray-200 rounded-3xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-extrabold text-duo-gray-800 flex items-center gap-2">
                        <Clock size={24} className="text-duo-gray-400" />
                        Active Assignments
                    </h3>
                    <TacticalButton 
                        variant="secondary" 
                        className="text-xs py-2 px-4"
                        onClick={() => setShowAssignModal(true)}
                    >
                        + Assign Drill
                    </TacticalButton>
                </div>

                <div className="space-y-3">
                    {assignments.length > 0 ? (
                        assignments.slice(0, VISIBLE_LIMIT).map((assignment) => {
                            const drill = getDrillDetails(assignment.drillId);
                            if (!drill) return null;
                            const isCompleted = assignment.status === 'Completed';

                            return (
                                <div 
                                    key={assignment.id}
                                    className={`flex items-center justify-between p-4 border-2 rounded-2xl transition-all ${
                                        isCompleted 
                                        ? 'bg-duo-gray-100 border-duo-gray-200 opacity-75' 
                                        : 'bg-white border-duo-gray-200 hover:border-duo-blue'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-duo-gray-200">
                                            <img src={drill.thumbnail} alt="" className="w-full h-full object-cover" />
                                        </div>
                                        
                                        <div>
                                            <h4 className={`font-extrabold text-sm text-duo-gray-800 ${isCompleted ? 'line-through text-duo-gray-500' : ''}`}>
                                                {drill.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs font-bold text-duo-gray-400 mt-1">
                                                <Calendar size={12} />
                                                {new Date(assignment.assignedDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => toggleAssignmentStatus(assignment.id)}
                                        className={`p-2 rounded-full transition-all ${
                                            isCompleted ? 'text-duo-green' : 'text-duo-gray-300 hover:text-duo-blue'
                                        }`}
                                    >
                                        {isCompleted ? <CheckCircle size={28} fill="currentColor" className="text-white" /> : <Circle size={28} />}
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                         <div className="p-8 text-center border-2 border-dashed border-duo-gray-200 rounded-2xl text-duo-gray-400 text-sm font-bold">
                            No active drills assigned. Good time to rest!
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
};