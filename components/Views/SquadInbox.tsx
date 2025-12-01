
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Inbox, CheckCircle, Search, Mail, ChevronRight, ChevronLeft, User, Archive, Reply, Clock, AlertCircle, Video } from 'lucide-react';
import { TacticalButton } from '../ui/TacticalButton';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  subject: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'general' | 'video' | 'injury';
}

const MOCK_INBOX: Message[] = [
  {
    id: 'm1',
    senderId: 's1',
    senderName: 'M. Rodriguez',
    senderAvatar: 'MR',
    subject: 'Bullpen Session Uploaded',
    content: 'Coach, I just uploaded the video from today\'s bullpen. I think my release point is drifting. Can you take a look when you have a moment?',
    timestamp: '20 min ago',
    read: false,
    type: 'video'
  },
  {
    id: 'm2',
    senderId: 's4',
    senderName: 'A. Petrov',
    senderAvatar: 'AP',
    subject: 'Ankle Rehab Update',
    content: 'Trainer says I can start light jogging tomorrow. Should I come in early for treatment before practice?',
    timestamp: '2 hours ago',
    read: true,
    type: 'injury'
  },
  {
    id: 'm3',
    senderId: 's2',
    senderName: 'J. Chen',
    senderAvatar: 'JC',
    subject: 'Drill Clarification',
    content: 'For the "Short Hop Series", are we doing barehand or glove work this week? I want to make sure I prep the right gear.',
    timestamp: 'Yesterday',
    read: true,
    type: 'general'
  }
];

const MOCK_COMPLETED: Message[] = [
    {
    id: 'm4',
    senderId: 's3',
    senderName: 'D. Washington',
    senderAvatar: 'DW',
    subject: 'Swing Analysis Feedback',
    content: 'Thanks for the feedback on the load phase. It feels much smoother now. I\'ll keep working on the drill you assigned.',
    timestamp: '3 days ago',
    read: true,
    type: 'video'
  }
];

interface SquadInboxProps {
  onClose: () => void;
}

export const SquadInbox: React.FC<SquadInboxProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'completed'>('inbox');
  const [inboxMessages, setInboxMessages] = useState<Message[]>(MOCK_INBOX);
  const [completedMessages, setCompletedMessages] = useState<Message[]>(MOCK_COMPLETED);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleMarkComplete = (msg: Message) => {
    setInboxMessages(prev => prev.filter(m => m.id !== msg.id));
    setCompletedMessages(prev => [{ ...msg, read: true }, ...prev]);
    if (selectedMessage?.id === msg.id) setSelectedMessage(null);
  };

  const handleMarkIncomplete = (msg: Message) => {
    setCompletedMessages(prev => prev.filter(m => m.id !== msg.id));
    setInboxMessages(prev => [{ ...msg, read: true }, ...prev]);
    if (selectedMessage?.id === msg.id) setSelectedMessage(null);
  };

  const currentList = activeTab === 'inbox' ? inboxMessages : completedMessages;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-5xl bg-white border-2 border-duo-gray-200 rounded-3xl shadow-2xl flex flex-col h-[85vh] md:h-[700px] overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 md:p-6 border-b-2 border-duo-gray-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-duo-gray-800 flex items-center gap-3">
               <Mail className="text-duo-blue" size={28} />
               Squad Comms
            </h2>
            <p className="text-[10px] md:text-xs font-bold text-duo-gray-400 uppercase mt-1">Direct Line to Athletes</p>
          </div>
          <button onClick={onClose} className="text-duo-gray-400 hover:bg-duo-gray-100 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden relative">
            
            {/* Sidebar List */}
            <div className={`w-full md:w-2/5 border-r-2 border-duo-gray-100 flex-col bg-duo-gray-50 ${selectedMessage ? 'hidden md:flex' : 'flex'}`}>
                
                {/* Tabs */}
                <div className="flex p-4 gap-2 shrink-0">
                    <button 
                        onClick={() => { setActiveTab('inbox'); setSelectedMessage(null); }}
                        className={`flex-1 py-2 rounded-xl text-sm font-extrabold uppercase transition-all flex items-center justify-center gap-2 ${
                            activeTab === 'inbox' 
                            ? 'bg-white text-duo-blue shadow-sm border border-duo-gray-200' 
                            : 'text-duo-gray-400 hover:bg-duo-gray-200'
                        }`}
                    >
                        <Inbox size={16} /> Inbox <span className="bg-duo-blue text-white px-1.5 rounded-md text-[10px]">{inboxMessages.length}</span>
                    </button>
                    <button 
                        onClick={() => { setActiveTab('completed'); setSelectedMessage(null); }}
                        className={`flex-1 py-2 rounded-xl text-sm font-extrabold uppercase transition-all flex items-center justify-center gap-2 ${
                            activeTab === 'completed' 
                            ? 'bg-white text-duo-green shadow-sm border border-duo-gray-200' 
                            : 'text-duo-gray-400 hover:bg-duo-gray-200'
                        }`}
                    >
                        <CheckCircle size={16} /> Done
                    </button>
                </div>

                {/* Message List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 pt-0 space-y-2">
                    {currentList.length === 0 ? (
                         <div className="flex flex-col items-center justify-center h-48 text-center px-6">
                            <div className="w-12 h-12 bg-duo-gray-200 rounded-full flex items-center justify-center text-duo-gray-400 mb-3">
                                <Inbox size={24} />
                            </div>
                            <p className="text-duo-gray-400 font-bold text-sm">No messages here.</p>
                         </div>
                    ) : (
                        currentList.map(msg => (
                            <div 
                                key={msg.id}
                                onClick={() => setSelectedMessage(msg)}
                                className={`p-4 rounded-2xl cursor-pointer border-2 transition-all hover:-translate-y-0.5 relative group ${
                                    selectedMessage?.id === msg.id 
                                    ? 'bg-white border-duo-blue shadow-md z-10' 
                                    : msg.read 
                                        ? 'bg-white border-duo-gray-200 opacity-80 hover:opacity-100 hover:border-duo-blue/30' 
                                        : 'bg-white border-l-4 border-l-duo-red border-y-duo-gray-200 border-r-duo-gray-200 shadow-sm'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-duo-gray-100 rounded-lg flex items-center justify-center text-xs font-extrabold text-duo-gray-500">
                                            {msg.senderAvatar}
                                        </div>
                                        <div>
                                            <div className={`text-sm font-extrabold leading-none ${msg.read ? 'text-duo-gray-600' : 'text-duo-gray-800'}`}>{msg.senderName}</div>
                                            <div className="text-[10px] text-duo-gray-400 font-bold mt-0.5">{msg.timestamp}</div>
                                        </div>
                                    </div>
                                    {msg.type === 'video' && <Video size={14} className="text-duo-red" />}
                                    {msg.type === 'injury' && <AlertCircle size={14} className="text-duo-yellowDark" />}
                                </div>
                                <div className={`text-sm font-bold truncate mb-1 ${msg.read ? 'text-duo-gray-500' : 'text-duo-gray-800'}`}>{msg.subject}</div>
                                <div className="text-xs text-duo-gray-400 line-clamp-2 leading-relaxed">
                                    {msg.content}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Message Detail View */}
            <div className={`w-full md:flex-1 flex-col bg-white ${selectedMessage ? 'flex' : 'hidden md:flex'}`}>
                {selectedMessage ? (
                    <>
                        {/* Scrollable Content Area */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                            
                            {/* Mobile Back Button */}
                            <div className="md:hidden p-4 pb-0">
                                <button 
                                    onClick={() => setSelectedMessage(null)}
                                    className="flex items-center gap-2 text-duo-gray-500 font-extrabold text-sm hover:text-duo-blue transition-colors"
                                >
                                    <ChevronLeft size={20} /> Back to Inbox
                                </button>
                            </div>

                            <div className="p-6 md:p-8">
                                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                                    <div className="flex items-center gap-4">
                                         <div className="w-12 h-12 md:w-16 md:h-16 bg-duo-gray-100 rounded-2xl flex items-center justify-center text-xl font-extrabold text-duo-gray-400 border-4 border-white shadow-sm shrink-0">
                                            {selectedMessage.senderAvatar}
                                         </div>
                                         <div className="min-w-0">
                                             <h3 className="text-xl md:text-2xl font-extrabold text-duo-gray-800 break-words">{selectedMessage.subject}</h3>
                                             <div className="flex flex-wrap items-center gap-2 mt-1">
                                                 <span className="text-xs md:text-sm font-bold text-duo-blue">{selectedMessage.senderName}</span>
                                                 <span className="text-duo-gray-300">•</span>
                                                 <span className="text-xs text-duo-gray-400 font-mono flex items-center gap-1">
                                                     <Clock size={12} /> {selectedMessage.timestamp}
                                                 </span>
                                             </div>
                                         </div>
                                    </div>
                                    <div className="flex gap-2 self-end md:self-start shrink-0">
                                         {activeTab === 'inbox' ? (
                                            <button 
                                                onClick={() => handleMarkComplete(selectedMessage)}
                                                className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-duo-green/10 text-duo-green hover:bg-duo-green hover:text-white rounded-xl text-[10px] md:text-xs font-extrabold uppercase transition-all whitespace-nowrap"
                                            >
                                                <CheckCircle size={16} /> <span className="hidden sm:inline">Mark</span> Complete
                                            </button>
                                         ) : (
                                            <button 
                                                onClick={() => handleMarkIncomplete(selectedMessage)}
                                                className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-duo-gray-100 text-duo-gray-500 hover:bg-duo-gray-200 rounded-xl text-[10px] md:text-xs font-extrabold uppercase transition-all whitespace-nowrap"
                                            >
                                                <Archive size={16} /> <span className="hidden sm:inline">Move to</span> Inbox
                                            </button>
                                         )}
                                    </div>
                                </div>
                                
                                <div className="bg-duo-gray-50 p-4 md:p-6 rounded-2xl border-2 border-duo-gray-100 text-sm md:text-base text-duo-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
                                    {selectedMessage.content}
                                </div>
                            </div>
                        </div>

                        {/* Fixed Footer: Reply Area */}
                        <div className="p-4 md:p-8 mt-auto bg-white border-t-2 border-duo-gray-100 shrink-0 z-10">
                            <label className="text-xs font-extrabold text-duo-gray-400 uppercase mb-3 block">Quick Reply</label>
                            <div className="flex gap-3">
                                <textarea 
                                    className="flex-1 bg-duo-gray-50 border-2 border-duo-gray-200 rounded-xl p-3 text-sm font-bold text-duo-gray-800 focus:outline-none focus:border-duo-blue resize-none h-20 md:h-24"
                                    placeholder="Type your response..."
                                />
                                <div className="flex flex-col gap-2">
                                    <TacticalButton className="h-full px-4 flex items-center justify-center">
                                        <Reply size={20} />
                                    </TacticalButton>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-duo-gray-300 p-8 text-center">
                        <Mail size={64} className="mb-4 opacity-20" />
                        <h3 className="text-xl font-extrabold text-duo-gray-400">Select a Message</h3>
                        <p className="text-sm font-bold opacity-60">Choose a message from the list to view details and respond.</p>
                    </div>
                )}
            </div>
        </div>
      </motion.div>
    </div>
  );
};
