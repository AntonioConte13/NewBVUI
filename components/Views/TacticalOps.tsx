
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Plus, MessageSquare, Trash2, X, ThumbsUp, ThumbsDown, Zap, Globe, Edit2, Check } from 'lucide-react';
import { ChatMessage, TacticalSession, FeedbackEvent, SavedCollection } from '../../types';
import { sendMessage } from '../../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { SquadFeed } from './SquadFeed';

interface TacticalOpsProps {
  onSavePost: (postId: string) => void;
  savedCollections: SavedCollection[];
}

export const TacticalOps: React.FC<TacticalOpsProps> = ({ onSavePost, savedCollections }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'feed'>('chat');

  // Chat State
  const [sessions, setSessions] = useState<TacticalSession[]>(() => {
    const saved = localStorage.getItem('tactical_sessions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load logs", e);
      }
    }
    // Default empty session - No welcome message
    return [{
      id: 'init-session',
      title: 'New Chat',
      timestamp: Date.now(),
      messages: [],
      preview: ''
    }];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(sessions[0].id);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Renaming State
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Feedback State Tracking
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null);
  const [feedbackComment, setFeedbackComment] = useState('');

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];

  useEffect(() => {
    localStorage.setItem('tactical_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const scrollToBottom = () => {
    if (activeTab === 'chat') {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession.messages, activeTab]);

  const createNewSession = () => {
    const newId = `session-${Date.now()}`;
    const newSession: TacticalSession = {
      id: newId,
      title: `New Chat`,
      timestamp: Date.now(),
      messages: [], // Start empty
      preview: ''
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newId);
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    if (newSessions.length === 0) {
        setSessions([{
            id: `session-${Date.now()}`,
            title: 'New Chat',
            timestamp: Date.now(),
            messages: [], // Start empty
            preview: ''
        }]);
    } else {
        setSessions(newSessions);
        if (currentSessionId === id) {
            setCurrentSessionId(newSessions[0].id);
        }
    }
  };

  // --- Renaming Handlers ---
  const startRenaming = (e: React.MouseEvent, session: TacticalSession) => {
      e.stopPropagation();
      setEditingSessionId(session.id);
      setEditTitle(session.title);
  };

  const cancelRenaming = (e?: React.MouseEvent) => {
      e?.stopPropagation();
      setEditingSessionId(null);
      setEditTitle('');
  };

  const saveRename = (e: React.MouseEvent | React.KeyboardEvent, sessionId: string) => {
      e.stopPropagation();
      if (!editTitle.trim()) {
          cancelRenaming();
          return;
      }
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: editTitle } : s));
      setEditingSessionId(null);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setIsLoading(true);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: userText,
      timestamp: Date.now(),
    };

    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        const newMessages = [...s.messages, userMsg];
        let newTitle = s.title;
        // Update title for new chats based on first user message
        if (s.messages.length === 0 && s.title.startsWith('New')) {
            newTitle = userText.length > 20 ? userText.substring(0, 20) + '...' : userText;
        }
        return {
          ...s,
          messages: newMessages,
          preview: userText.substring(0, 30) + '...',
          timestamp: Date.now(),
          title: newTitle
        };
      }
      return s;
    }));

    try {
      const responseText = await sendMessage(currentSessionId, userText);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
      };
      
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [...s.messages, botMsg],
            preview: responseText.substring(0, 30) + '...'
          };
        }
        return s;
      }));

    } catch (error) {
      console.error("Ops Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Feedback Logic ---
  const handleFeedback = (messageId: string, type: 'positive' | 'negative') => {
      setActiveFeedbackId(messageId);
      setFeedbackComment(''); // Reset comment input

      // Update local session state
      setSessions(prev => prev.map(s => {
          if (s.id === currentSessionId) {
              return {
                  ...s,
                  messages: s.messages.map(m => {
                      if (m.id === messageId) {
                          return { ...m, feedback: { rating: type, timestamp: Date.now() } };
                      }
                      return m;
                  })
              };
          }
          return s;
      }));
  };

  const submitFeedbackComment = (messageId: string) => {
      const session = sessions.find(s => s.id === currentSessionId);
      const messageIndex = session?.messages.findIndex(m => m.id === messageId) ?? -1;
      if (!session || messageIndex === -1) return;

      const message = session.messages[messageIndex];
      const previousMessage = messageIndex > 0 ? session.messages[messageIndex - 1] : null;

      // Update local state with comment
      setSessions(prev => prev.map(s => {
          if (s.id === currentSessionId) {
              return {
                  ...s,
                  messages: s.messages.map(m => {
                      if (m.id === messageId && m.feedback) {
                          return { ...m, feedback: { ...m.feedback, comment: feedbackComment } };
                      }
                      return m;
                  })
              };
          }
          return s;
      }));

      // --- PERSIST TO ADMIN OVERWATCH (Simulated Backend) ---
      const newFeedbackEvent: FeedbackEvent = {
          id: `fb-${Date.now()}`,
          sessionId: currentSessionId,
          userPrompt: previousMessage?.text || "Unknown Context",
          modelResponse: message.text,
          rating: message.feedback?.rating || 'positive', // Should exist by now
          comment: feedbackComment,
          timestamp: Date.now(),
          status: 'new'
      };

      const storedFeedback = localStorage.getItem('bvai_admin_feedback');
      const feedbackList = storedFeedback ? JSON.parse(storedFeedback) : [];
      localStorage.setItem('bvai_admin_feedback', JSON.stringify([newFeedbackEvent, ...feedbackList]));

      setActiveFeedbackId(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white border-2 border-duo-gray-200 rounded-3xl overflow-hidden relative shadow-sm">
       
       {/* Global Header - Cleaned Up */}
       <div className="bg-white border-b-2 border-duo-gray-200 p-4 flex justify-between items-center shrink-0 z-30 h-20">
            
            {/* Left: Toggle Switch */}
            <div className="flex bg-duo-gray-100 p-1.5 rounded-xl border-2 border-duo-gray-200">
                 <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-5 py-2 rounded-lg font-extrabold uppercase text-xs md:text-sm transition-all flex items-center gap-2 ${
                        activeTab === 'chat' 
                        ? 'bg-white text-duo-blue shadow-sm' 
                        : 'text-duo-gray-400 hover:text-duo-gray-800'
                    }`}
                 >
                    <MessageSquare size={18} />
                    Chat
                 </button>
                 <button
                    onClick={() => setActiveTab('feed')}
                    className={`px-5 py-2 rounded-lg font-extrabold uppercase text-xs md:text-sm transition-all flex items-center gap-2 ${
                        activeTab === 'feed' 
                        ? 'bg-white text-duo-green shadow-sm' 
                        : 'text-duo-gray-400 hover:text-duo-gray-800'
                    }`}
                 >
                    <Globe size={18} />
                    Social Feed
                 </button>
            </div>

            {/* Right: Context Label */}
            <div className="hidden md:flex items-center gap-2 text-duo-gray-400">
                <Bot size={20} />
                <span className="text-xs font-extrabold uppercase tracking-wider">AI Command</span>
            </div>
       </div>

       {/* Main Content Area */}
       <div className="flex-1 flex overflow-hidden relative">
            {activeTab === 'chat' ? (
                <>
                    {/* Sidebar - History */}
                    <div 
                        className={`
                        flex-shrink-0 bg-duo-gray-100 border-r-2 border-duo-gray-200 flex flex-col transition-all duration-300 
                        absolute md:relative z-20 h-full
                        ${showSidebar ? 'translate-x-0 w-72 shadow-xl md:shadow-none' : '-translate-x-full w-72 md:translate-x-0 md:w-0 md:overflow-hidden md:border-none'}
                        `}
                    >
                        <div className="p-4 flex items-center justify-between bg-white border-b-2 border-duo-gray-200">
                            <h3 className="font-extrabold text-duo-gray-500 text-sm uppercase tracking-wide">
                                History
                            </h3>
                            <div className="flex items-center gap-2">
                                <button 
                                onClick={createNewSession}
                                className="p-2 bg-duo-green text-white rounded-xl hover:bg-duo-greenDark transition-colors shadow-sm"
                                title="New Chat"
                                >
                                    <Plus size={20} />
                                </button>
                                <button 
                                onClick={() => setShowSidebar(false)}
                                className="p-2 text-duo-gray-400 hover:bg-duo-gray-200 rounded-xl md:hidden"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {sessions.map(session => (
                                <button
                                    key={session.id}
                                    onClick={() => {
                                        if (editingSessionId !== session.id) {
                                            setCurrentSessionId(session.id);
                                            if (window.innerWidth < 768) setShowSidebar(false);
                                        }
                                    }}
                                    className={`w-full text-left p-3 rounded-xl border-2 transition-all group relative ${
                                        currentSessionId === session.id 
                                        ? 'bg-white border-duo-blue text-duo-blue shadow-sm' 
                                        : 'bg-transparent border-transparent hover:bg-white hover:border-duo-gray-200 text-duo-gray-500'
                                    }`}
                                >
                                    {editingSessionId === session.id ? (
                                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                            <input 
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && saveRename(e, session.id)}
                                                autoFocus
                                                className="w-full bg-white border border-duo-blue rounded px-2 py-1 text-sm font-bold text-duo-gray-800 focus:outline-none"
                                            />
                                            <div 
                                                onClick={(e) => saveRename(e, session.id)}
                                                className="p-1.5 bg-duo-green text-white rounded hover:bg-duo-greenDark cursor-pointer"
                                            >
                                                <Check size={12} />
                                            </div>
                                            <div 
                                                onClick={(e) => cancelRenaming(e)}
                                                className="p-1.5 bg-duo-gray-200 text-duo-gray-500 rounded hover:bg-duo-gray-300 cursor-pointer"
                                            >
                                                <X size={12} />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="font-bold text-sm truncate mb-1 pr-14">
                                                {session.title}
                                            </div>
                                            <div className="text-xs opacity-70 truncate pr-8">
                                                {session.preview || "New Chat"}
                                            </div>
                                            
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div 
                                                    onClick={(e) => startRenaming(e, session)}
                                                    className="bg-white p-1.5 rounded-lg shadow-sm text-duo-blue hover:bg-duo-blue/10 border border-duo-gray-100 transition-all"
                                                    title="Rename"
                                                >
                                                    <Edit2 size={14} />
                                                </div>
                                                <div 
                                                    onClick={(e) => deleteSession(e, session.id)}
                                                    className="bg-white p-1.5 rounded-lg shadow-sm text-duo-red hover:bg-duo-red/10 border border-duo-gray-100 transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col min-w-0 relative bg-white">
                            <header className="p-4 border-b-2 border-duo-gray-200 flex justify-between items-center bg-duo-gray-50 z-10">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setShowSidebar(!showSidebar)} className="text-duo-gray-400 hover:text-duo-blue transition-colors p-2 hover:bg-duo-gray-100 rounded-xl">
                                        <MessageSquare size={24} />
                                    </button>
                                    <div className="min-w-0">
                                        <h2 className="font-extrabold text-lg text-duo-gray-800 truncate">
                                            {currentSession.title}
                                        </h2>
                                    </div>
                                </div>
                            </header>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 scroll-smooth">
                                <AnimatePresence mode='wait'>
                                    {currentSession.messages.length === 0 && (
                                        <div className="h-full flex flex-col items-center justify-center opacity-30 pointer-events-none">
                                            <Bot size={64} className="text-duo-gray-300 mb-4" />
                                            <p className="text-lg font-extrabold text-duo-gray-400 uppercase tracking-widest">
                                                BVAI
                                            </p>
                                        </div>
                                    )}
                                    {currentSession.messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                    >
                                        <div className={`max-w-[85%] md:max-w-[70%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            
                                            <div className={`p-5 text-sm leading-7 shadow-sm relative group whitespace-pre-wrap ${
                                                msg.role === 'user'
                                                ? 'bg-duo-blue text-white rounded-2xl rounded-tr-none font-semibold'
                                                : 'bg-white text-gray-700 rounded-2xl rounded-tl-none border border-gray-200 font-medium'
                                            }`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                        
                                        {/* Model Feedback Controls */}
                                        {msg.role === 'model' && (
                                            <div className="mt-2 ml-2 flex items-start gap-2">
                                                {/* If we are editing this specific feedback */}
                                                {activeFeedbackId === msg.id ? (
                                                    <div className="flex flex-col bg-duo-gray-50 border border-duo-gray-200 rounded-xl p-2 shadow-sm animate-in fade-in slide-in-from-top-1 w-64">
                                                        <span className="text-[10px] font-extrabold text-duo-gray-400 uppercase mb-1">Provide Tactical Context</span>
                                                        <textarea 
                                                            value={feedbackComment}
                                                            onChange={(e) => setFeedbackComment(e.target.value)}
                                                            className="text-xs p-2 rounded-lg bg-white border border-duo-gray-200 mb-2 focus:outline-none focus:border-duo-blue"
                                                            placeholder="Why was this helpful/unhelpful?"
                                                            rows={2}
                                                        />
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => setActiveFeedbackId(null)} className="text-xs font-bold text-duo-gray-400 hover:text-duo-gray-600">Cancel</button>
                                                            <button onClick={() => submitFeedbackComment(msg.id)} className="text-xs font-bold bg-duo-blue text-white px-2 py-1 rounded-lg hover:bg-duo-blueDark">Submit</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => handleFeedback(msg.id, 'positive')}
                                                            className={`p-1.5 rounded-lg transition-all ${msg.feedback?.rating === 'positive' ? 'bg-duo-green text-white' : 'text-duo-gray-300 hover:bg-duo-gray-100 hover:text-duo-green'}`}
                                                        >
                                                            <ThumbsUp size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleFeedback(msg.id, 'negative')}
                                                            className={`p-1.5 rounded-lg transition-all ${msg.feedback?.rating === 'negative' ? 'bg-duo-red text-white' : 'text-duo-gray-300 hover:bg-duo-gray-100 hover:text-duo-red'}`}
                                                        >
                                                            <ThumbsDown size={14} />
                                                        </button>
                                                        
                                                        {msg.feedback?.comment && (
                                                            <span className="text-[10px] text-duo-gray-400 bg-duo-gray-50 px-2 py-1 rounded-lg border border-duo-gray-100 max-w-[150px] truncate">
                                                                "{msg.feedback.comment}"
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </motion.div>
                                    ))}
                                </AnimatePresence>
                                
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-duo-gray-200 flex gap-1 ml-12 shadow-sm">
                                            <span className="w-2 h-2 bg-duo-gray-400 rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-duo-gray-400 rounded-full animate-bounce delay-75"></span>
                                            <span className="w-2 h-2 bg-duo-gray-400 rounded-full animate-bounce delay-150"></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 border-t-2 border-duo-gray-100">
                                <div className="flex gap-2 relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-gray-100 dark:bg-gray-800 border-2 border-duo-gray-200 rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-duo-blue focus:bg-white dark:focus:bg-gray-900 transition-all font-bold"
                                    disabled={isLoading}
                                    autoFocus
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isLoading}
                                    className="bg-duo-green border-b-4 border-duo-greenDark active:border-b-0 active:translate-y-1 hover:bg-green-500 text-white px-6 rounded-xl font-extrabold uppercase transition-all flex items-center gap-2 disabled:opacity-50 disabled:active:translate-y-0"
                                >
                                    <span className="hidden md:inline">Send</span>
                                    <Send size={20} />
                                </button>
                                </div>
                            </div>
                    </div>
                </>
            ) : (
                // Social Feed View
                <div className="flex-1 overflow-hidden bg-duo-gray-50 w-full h-full">
                    <SquadFeed onSavePost={onSavePost} savedCollections={savedCollections} />
                </div>
            )}
       </div>
    </div>
  );
};
