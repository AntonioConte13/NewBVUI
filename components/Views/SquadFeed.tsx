
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, X, Bot, ImageIcon, Video, Trophy, Zap } from 'lucide-react';
import { SocialPost, Drill, SavedCollection } from '../../types';
import { MOCK_SOCIAL_FEED, DRILLS } from '../../constants';
import { TacticalButton } from '../ui/TacticalButton';

interface SquadFeedProps {
  onSavePost: (postId: string) => void;
  savedCollections: SavedCollection[];
}

export const SquadFeed: React.FC<SquadFeedProps> = ({ onSavePost, savedCollections }) => {
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(MOCK_SOCIAL_FEED);
  const [postInput, setPostInput] = useState('');
  const [showDrillPicker, setShowDrillPicker] = useState(false);
  const [selectedDrillForPost, setSelectedDrillForPost] = useState<Drill | null>(null);

  const handlePostSubmit = () => {
    if (!postInput.trim() && !selectedDrillForPost) return;

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      authorId: 'me',
      authorName: 'Coach Prime',
      authorAvatar: 'ME',
      authorRole: 'Coach',
      content: postInput,
      timestamp: 'Just now',
      drillId: selectedDrillForPost?.id,
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      xpEarned: 50 // Immediate reward
    };

    setSocialPosts([newPost, ...socialPosts]);
    setPostInput('');
    setSelectedDrillForPost(null);
    setShowDrillPicker(false);
  };

  const toggleLike = (postId: string) => {
    setSocialPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const isSaved = (postId: string) => {
    return savedCollections.some(c => c.postIds.includes(postId));
  };

  return (
    <div className="flex flex-1 bg-duo-gray-50 overflow-hidden h-full rounded-2xl border-2 border-duo-gray-200">
        
        {/* Feed Stream */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="max-w-3xl mx-auto p-6 space-y-6">
                
                {/* Composer */}
                <div className="bg-white border-2 border-duo-gray-200 rounded-3xl p-4 shadow-sm">
                    <div className="flex gap-3 mb-4">
                        <div className="w-10 h-10 bg-duo-green text-white rounded-xl flex items-center justify-center font-extrabold text-sm border-2 border-duo-greenDark shrink-0">
                            ME
                        </div>
                        <textarea
                            value={postInput}
                            onChange={(e) => setPostInput(e.target.value)}
                            placeholder="Deploy intel, drill updates, or shoutouts..."
                            className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl p-3 font-bold placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-duo-green/50 resize-none h-24"
                        />
                    </div>
                    
                    {selectedDrillForPost && (
                        <div className="flex items-center gap-3 bg-duo-blue/5 p-3 rounded-xl mb-4 border border-duo-blue/20 relative group">
                            <img src={selectedDrillForPost.thumbnail} className="w-12 h-12 rounded-lg object-cover" alt=""/>
                            <div>
                                <div className="font-extrabold text-sm text-duo-gray-800">{selectedDrillForPost.title}</div>
                                <div className="text-xs font-bold text-duo-blue uppercase">Drill Attachment</div>
                            </div>
                            <button 
                                onClick={() => setSelectedDrillForPost(null)}
                                className="absolute top-2 right-2 p-1 bg-white rounded-full text-duo-red hover:bg-duo-red hover:text-white transition-colors shadow-sm"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between items-center border-t-2 border-duo-gray-100 pt-3">
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setShowDrillPicker(!showDrillPicker)}
                                className="p-2 text-duo-gray-400 hover:bg-duo-gray-100 hover:text-duo-blue rounded-xl transition-colors flex items-center gap-1"
                                title="Attach Drill"
                            >
                                <Bot size={20} /> <span className="text-xs font-extrabold uppercase hidden sm:inline">Drill</span>
                            </button>
                            <button className="p-2 text-duo-gray-400 hover:bg-duo-gray-100 hover:text-duo-green rounded-xl transition-colors">
                                <ImageIcon size={20} />
                            </button>
                            <button className="p-2 text-duo-gray-400 hover:bg-duo-gray-100 hover:text-duo-red rounded-xl transition-colors">
                                <Video size={20} />
                            </button>
                        </div>
                        <TacticalButton 
                            onClick={handlePostSubmit} 
                            disabled={!postInput.trim() && !selectedDrillForPost}
                            className="text-xs py-2 px-4"
                        >
                            Deploy
                        </TacticalButton>
                    </div>

                    {/* Mini Drill Picker Drawer */}
                    <AnimatePresence>
                        {showDrillPicker && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-2 gap-2 pt-4 max-h-48 overflow-y-auto custom-scrollbar">
                                    {DRILLS.map(drill => (
                                        <button
                                            key={drill.id}
                                            onClick={() => { setSelectedDrillForPost(drill); setShowDrillPicker(false); }}
                                            className="flex items-center gap-2 p-2 rounded-xl hover:bg-duo-gray-100 text-left border-2 border-transparent hover:border-duo-gray-200"
                                        >
                                            <img src={drill.thumbnail} className="w-8 h-8 rounded-lg object-cover" alt=""/>
                                            <div className="truncate">
                                                <div className="text-xs font-extrabold text-duo-gray-800 truncate">{drill.title}</div>
                                                <div className="text-[10px] text-duo-gray-400 uppercase">{drill.category}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Posts Feed */}
                <div className="space-y-4 pb-8">
                    {socialPosts.map(post => {
                        const attachedDrill = post.drillId ? DRILLS.find(d => d.id === post.drillId) : null;
                        const isPostSaved = isSaved(post.id);

                        return (
                            <motion.div 
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white border-2 border-duo-gray-200 rounded-3xl p-5 shadow-sm hover:border-duo-gray-300 transition-colors relative"
                            >
                                {/* Post Header */}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-extrabold border-2 ${
                                            post.authorRole === 'Coach' 
                                            ? 'bg-duo-green text-white border-duo-greenDark' 
                                            : 'bg-duo-blue text-white border-duo-blueDark'
                                        }`}>
                                            {post.authorAvatar}
                                        </div>
                                        <div>
                                            <div className="font-extrabold text-duo-gray-800 flex items-center gap-1">
                                                {post.authorName}
                                                {post.authorRole === 'Coach' && <Bot size={14} className="text-duo-green" />}
                                            </div>
                                            <div className="text-xs font-bold text-duo-gray-400">{post.authorRole} • {post.timestamp}</div>
                                        </div>
                                    </div>
                                    <button className="text-duo-gray-300 hover:text-duo-gray-500 p-1">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

                                {/* Content */}
                                <p className="text-duo-gray-800 font-bold text-sm leading-relaxed mb-4">
                                    {post.content}
                                </p>

                                {/* Drill Attachment Card */}
                                {attachedDrill && (
                                    <div className="bg-duo-gray-50 border-2 border-duo-gray-200 rounded-2xl p-3 mb-4 flex gap-4 items-center group cursor-pointer hover:border-duo-blue transition-colors">
                                        <div className="w-20 h-14 rounded-lg overflow-hidden relative shrink-0">
                                            <img src={attachedDrill.thumbnail} className="w-full h-full object-cover" alt="" />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                    <Bot size={12} className="text-duo-blue" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-extrabold text-duo-gray-800 text-sm truncate">{attachedDrill.title}</div>
                                            <div className="text-xs font-bold text-duo-gray-400 uppercase">{attachedDrill.category} • {attachedDrill.difficulty}</div>
                                        </div>
                                        <button className="bg-duo-blue text-white px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase hover:bg-duo-blueDark transition-colors">
                                            View
                                        </button>
                                    </div>
                                )}

                                {/* Post Stats / Actions */}
                                <div className="flex items-center justify-between pt-2 border-t-2 border-duo-gray-100">
                                    <div className="flex items-center gap-1">
                                            <button 
                                            onClick={() => toggleLike(post.id)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                                                post.isLiked ? 'bg-duo-red/10 text-duo-red' : 'hover:bg-duo-gray-100 text-duo-gray-400'
                                            }`}
                                            >
                                            <Heart size={18} fill={post.isLiked ? "currentColor" : "none"} />
                                            <span className="text-xs font-extrabold">{post.likes}</span>
                                            </button>
                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-duo-gray-100 text-duo-gray-400 transition-all">
                                            <MessageSquare size={18} />
                                            <span className="text-xs font-extrabold">{post.comments}</span>
                                            </button>
                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-duo-gray-100 text-duo-gray-400 transition-all">
                                            <Share2 size={18} />
                                            <span className="text-xs font-extrabold">{post.shares}</span>
                                            </button>
                                    </div>
                                    <button 
                                        onClick={() => onSavePost(post.id)}
                                        className={`p-2 rounded-xl transition-all ${isPostSaved ? 'text-duo-green bg-duo-green/10' : 'text-duo-gray-400 hover:bg-duo-gray-100'}`}
                                        title={isPostSaved ? "Saved to Intel" : "Save to Intel"}
                                    >
                                        <Bookmark size={18} fill={isPostSaved ? "currentColor" : "none"} />
                                    </button>
                                </div>

                                {/* Gamification Badge if applicable */}
                                {post.xpEarned && (
                                    <div className="absolute -top-3 -right-2 bg-duo-yellow text-white px-2 py-1 rounded-lg text-[10px] font-extrabold uppercase shadow-sm border-2 border-white flex items-center gap-1 transform rotate-6">
                                        <Trophy size={12} /> +{post.xpEarned} XP
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </div>

        {/* Right Sidebar - Community Highlights (Hidden on mobile) */}
        <div className="hidden xl:block w-80 border-l-2 border-duo-gray-200 bg-white p-6 space-y-6 overflow-y-auto custom-scrollbar">
            
            {/* Trending Drills Widget */}
            <div className="bg-white border-2 border-duo-gray-200 rounded-2xl p-4">
                <h3 className="text-sm font-extrabold text-duo-gray-400 uppercase mb-4 flex items-center gap-2">
                    <Zap size={16} className="text-duo-yellowDark" /> Trending Drills
                </h3>
                <div className="space-y-3">
                    {DRILLS.slice(0, 3).map((d, i) => (
                        <div key={d.id} className="flex items-center gap-3 cursor-pointer hover:bg-duo-gray-50 p-1 rounded-lg transition-colors">
                            <div className="font-extrabold text-duo-gray-300 w-4">{i+1}</div>
                            <img src={d.thumbnail} className="w-10 h-10 rounded-lg object-cover" alt="" />
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-extrabold text-duo-gray-800 truncate">{d.title}</div>
                                <div className="text-[10px] font-bold text-duo-gray-400">{d.category}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Coach Earnings Widget */}
            <div className="bg-duo-green/5 border-2 border-duo-green/20 rounded-2xl p-4">
                    <h3 className="text-sm font-extrabold text-duo-green uppercase mb-2 flex items-center gap-2">
                    <Trophy size={16} /> Coach Earnings
                </h3>
                <p className="text-xs font-bold text-duo-gray-500 mb-4">
                    Earn XP and Badges when players engage with your content.
                </p>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-duo-gray-400">This Week</span>
                    <span className="text-sm font-extrabold text-duo-green">+850 XP</span>
                </div>
                <div className="w-full bg-white rounded-full h-2 mb-1">
                    <div className="bg-duo-green h-full rounded-full w-[75%]"></div>
                </div>
                <div className="text-[10px] text-right text-duo-gray-400 font-bold">150 XP to next level</div>
            </div>

        </div>

    </div>
  );
};
