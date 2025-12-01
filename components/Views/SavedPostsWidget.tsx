
import React, { useState } from 'react';
import { Folder, Plus, ChevronRight, ArrowLeft, Bookmark, Trash2, FolderPlus, MoreVertical, X, Edit2, Check } from 'lucide-react';
import { SavedCollection, SocialPost } from '../../types';
import { MOCK_SOCIAL_FEED } from '../../constants';
import { TacticalButton } from '../ui/TacticalButton';

interface SavedPostsWidgetProps {
  collections: SavedCollection[];
  setCollections: React.Dispatch<React.SetStateAction<SavedCollection[]>>;
}

export const SavedPostsWidget: React.FC<SavedPostsWidgetProps> = ({ collections, setCollections }) => {
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  // Renaming State
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Helper to get posts for the active collection
  const getActivePosts = (): SocialPost[] => {
    if (!activeCollectionId) return [];
    const collection = collections.find(c => c.id === activeCollectionId);
    if (!collection) return [];
    return MOCK_SOCIAL_FEED.filter(p => collection.postIds.includes(p.id));
  };

  const activeCollection = collections.find(c => c.id === activeCollectionId);

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const newCollection: SavedCollection = {
      id: `col-${Date.now()}`,
      title: newFolderName,
      color: '#4B5563',
      postIds: []
    };
    setCollections([...collections, newCollection]);
    setNewFolderName('');
    setIsCreating(false);
  };

  const handleDeleteFolder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollections(collections.filter(c => c.id !== id));
    if (activeCollectionId === id) setActiveCollectionId(null);
  };

  // Renaming Handlers
  const handleStartRename = (id: string, currentTitle: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setRenamingFolderId(id);
      setRenameValue(currentTitle);
  };

  const handleSaveRename = (e?: React.MouseEvent | React.KeyboardEvent) => {
      e?.stopPropagation();
      if (renamingFolderId && renameValue.trim()) {
          setCollections(prev => prev.map(c => 
              c.id === renamingFolderId ? { ...c, title: renameValue } : c
          ));
      }
      setRenamingFolderId(null);
      setRenameValue('');
  };

  const handleCancelRename = (e: React.MouseEvent) => {
      e.stopPropagation();
      setRenamingFolderId(null);
      setRenameValue('');
  };

  return (
    <div className="bg-white border-2 border-duo-gray-200 rounded-3xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-extrabold text-duo-gray-800 uppercase flex items-center gap-2">
          <Bookmark className="text-duo-blue" size={24} />
          Saved Posts
        </h3>
        
        {!activeCollectionId && (
            <button 
                onClick={() => setIsCreating(true)}
                className="text-duo-blue hover:bg-duo-blue/10 p-2 rounded-xl transition-colors"
                title="New Folder"
            >
                <FolderPlus size={20} />
            </button>
        )}
      </div>

      {/* Create Folder Inline Input */}
      {isCreating && (
          <div className="mb-4 flex gap-2 animate-in fade-in slide-in-from-top-2">
              <input 
                type="text" 
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                placeholder="Folder Name..."
                className="flex-1 bg-duo-gray-50 border-2 border-duo-blue rounded-xl px-3 py-2 text-sm font-bold outline-none"
              />
              <button 
                onClick={handleCreateFolder} 
                className="bg-duo-blue text-white p-2 rounded-xl hover:bg-duo-blueDark"
              >
                  <Plus size={20} />
              </button>
              <button 
                onClick={() => setIsCreating(false)} 
                className="bg-duo-gray-200 text-duo-gray-500 p-2 rounded-xl hover:bg-duo-gray-300"
              >
                  <X size={20} />
              </button>
          </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {!activeCollectionId ? (
          /* Folders Grid */
          <div className="grid grid-cols-2 gap-4">
            {collections.map(collection => (
              <div 
                key={collection.id}
                onClick={() => {
                    if (renamingFolderId !== collection.id) {
                        setActiveCollectionId(collection.id);
                    }
                }}
                className={`bg-duo-gray-50 border-2 rounded-2xl p-4 cursor-pointer transition-all hover:-translate-y-1 group relative ${
                    renamingFolderId === collection.id 
                    ? 'border-duo-blue ring-2 ring-duo-blue/20 bg-white z-10' 
                    : 'border-duo-gray-200 hover:border-duo-blue'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                    <Folder size={28} className="text-duo-blue" fill="currentColor" fillOpacity={0.2} />
                    <div className="bg-white px-2 py-0.5 rounded-md text-[10px] font-extrabold text-duo-gray-400 border border-duo-gray-200">
                        {collection.postIds.length}
                    </div>
                </div>
                
                {renamingFolderId === collection.id ? (
                    <div onClick={(e) => e.stopPropagation()} className="mt-1 relative">
                        <input 
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename();
                                if (e.key === 'Escape') handleCancelRename(e as any);
                            }}
                            className="w-full bg-duo-gray-100 border border-duo-blue rounded px-2 py-1 text-sm font-extrabold text-duo-gray-800 outline-none"
                            autoFocus
                        />
                        <div className="flex justify-end gap-1 mt-2">
                            <button onClick={handleCancelRename} className="p-1 bg-duo-gray-200 rounded text-duo-gray-500 hover:bg-duo-gray-300"><X size={12}/></button>
                            <button onClick={(e) => handleSaveRename(e)} className="p-1 bg-duo-green text-white rounded hover:bg-duo-greenDark"><Check size={12}/></button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h4 className="font-extrabold text-duo-gray-800 text-sm truncate pr-6" title={collection.title}>
                            {collection.title}
                        </h4>
                        <div className="text-[10px] font-bold text-duo-gray-400 uppercase mt-1">Collection</div>
                    </>
                )}

                {/* Action Buttons (Hidden while renaming) */}
                {renamingFolderId !== collection.id && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={(e) => handleStartRename(collection.id, collection.title, e)}
                            className="p-1.5 bg-white text-duo-gray-400 rounded-lg hover:bg-duo-gray-100 hover:text-duo-blue transition-all shadow-sm border border-duo-gray-100"
                            title="Rename"
                        >
                            <Edit2 size={12} />
                        </button>
                        <button 
                            onClick={(e) => handleDeleteFolder(collection.id, e)}
                            className="p-1.5 bg-white text-duo-gray-400 rounded-lg hover:bg-duo-red/10 hover:text-duo-red transition-all shadow-sm border border-duo-gray-100"
                            title="Delete"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                )}
              </div>
            ))}
            {collections.length === 0 && !isCreating && (
                <div className="col-span-2 text-center py-8 text-duo-gray-400 text-sm font-bold border-2 border-dashed border-duo-gray-200 rounded-2xl">
                    No collections yet.
                </div>
            )}
          </div>
        ) : (
          /* Single Folder View */
          <div className="space-y-4">
            <button 
                onClick={() => setActiveCollectionId(null)}
                className="flex items-center gap-2 text-xs font-extrabold text-duo-gray-500 hover:text-duo-blue transition-colors mb-2"
            >
                <ArrowLeft size={16} /> Back to Collections
            </button>
            
            <div className="flex items-center gap-2 mb-4">
                <Folder size={20} className="text-duo-blue" />
                <h4 className="font-extrabold text-duo-gray-800 text-lg">{activeCollection?.title}</h4>
            </div>

            <div className="space-y-3">
                {getActivePosts().length > 0 ? (
                    getActivePosts().map(post => (
                        <div key={post.id} className="bg-white border-2 border-duo-gray-200 p-3 rounded-xl hover:border-duo-blue transition-colors cursor-pointer">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-duo-blue text-white rounded-lg flex items-center justify-center text-[10px] font-extrabold">
                                    {post.authorAvatar}
                                </div>
                                <div className="text-xs font-bold text-duo-gray-500">{post.authorName}</div>
                            </div>
                            <p className="text-xs font-bold text-duo-gray-800 line-clamp-2 leading-relaxed">
                                {post.content}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-duo-gray-400 text-sm font-bold">
                        Empty folder.
                    </div>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
