
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Save, X, CheckCircle, Calendar, Link as LinkIcon, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { INITIAL_CUSTOM_QUIZZES } from '../../constants';
import { CustomQuiz, QuizQuestion } from '../../types';
import { TacticalButton } from '../ui/TacticalButton';

export const QuizBuilder: React.FC = () => {
  const [mode, setMode] = useState<'list' | 'editor'>('list');
  const [quizzes, setQuizzes] = useState<CustomQuiz[]>(INITIAL_CUSTOM_QUIZZES);
  
  // Editor State
  const [currentQuiz, setCurrentQuiz] = useState<Partial<CustomQuiz>>({});
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateNew = () => {
    setCurrentQuiz({
      id: Date.now().toString(),
      title: '',
      description: '',
      questions: [],
      status: 'Draft',
      linkedToCert: false,
      assignedCount: 0,
      scheduledDate: ''
    });
    setMode('editor');
  };

  const handleEdit = (quiz: CustomQuiz) => {
    setCurrentQuiz(JSON.parse(JSON.stringify(quiz))); // Deep copy
    setMode('editor');
  };

  const handleDelete = (id: string) => {
    setQuizzes(quizzes.filter(q => q.id !== id));
  };

  const handleSaveQuiz = () => {
    if (!currentQuiz.title) return;
    
    setIsSaving(true);

    // Simulate network request
    setTimeout(() => {
        const savedQuiz = {
          ...currentQuiz,
          status: currentQuiz.status || 'Draft',
          questions: currentQuiz.questions || [],
          assignedCount: currentQuiz.assignedCount || 0,
          linkedToCert: currentQuiz.linkedToCert || false,
        } as CustomQuiz;

        const exists = quizzes.find(q => q.id === savedQuiz.id);
        if (exists) {
          setQuizzes(quizzes.map(q => q.id === savedQuiz.id ? savedQuiz : q));
        } else {
          setQuizzes([...quizzes, savedQuiz]);
        }
        setMode('list');
        setIsSaving(false);
    }, 800);
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `nq-${Date.now()}`,
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    };
    setCurrentQuiz(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion]
    }));
    setEditingQuestionId(newQuestion.id);
  };

  const updateQuestion = (qId: string, field: keyof QuizQuestion, value: any) => {
    setCurrentQuiz(prev => ({
      ...prev,
      questions: prev.questions?.map(q => q.id === qId ? { ...q, [field]: value } : q)
    }));
  };

  const updateOption = (qId: string, optIndex: number, value: string) => {
    setCurrentQuiz(prev => ({
      ...prev,
      questions: prev.questions?.map(q => {
        if (q.id === qId) {
          const newOptions = [...q.options];
          newOptions[optIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    }));
  };

  const removeQuestion = (qId: string) => {
    setCurrentQuiz(prev => ({
      ...prev,
      questions: prev.questions?.filter(q => q.id !== qId)
    }));
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-duo-gray-800 mb-2">Quiz Builder</h1>
          <p className="text-duo-gray-500 font-bold">Create challenges for your team.</p>
        </div>
        {mode === 'list' && (
          <TacticalButton onClick={handleCreateNew} icon={<Plus size={16} />}>
            New Quiz
          </TacticalButton>
        )}
      </header>

      {mode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map(quiz => (
            <motion.div 
              key={quiz.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-duo-gray-200 rounded-2xl p-6 hover:border-duo-blue transition-all group relative shadow-sm hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                 <div className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
                    quiz.status === 'Active' ? 'bg-duo-green/10 text-duo-green' : 'bg-duo-gray-100 text-duo-gray-500'
                 }`}>
                    {quiz.status}
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => handleEdit(quiz)} className="p-2 hover:bg-duo-gray-100 rounded-lg text-duo-gray-400 hover:text-duo-blue transition-colors">
                        <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(quiz.id)} className="p-2 hover:bg-duo-red/10 rounded-lg text-duo-gray-400 hover:text-duo-red transition-colors">
                        <Trash2 size={18} />
                    </button>
                 </div>
              </div>

              <h3 className="text-xl font-extrabold text-duo-gray-800 mb-2">{quiz.title}</h3>
              <p className="text-sm text-duo-gray-500 font-medium mb-6 line-clamp-2">{quiz.description}</p>

              <div className="flex items-center gap-4 text-xs font-bold text-duo-gray-400 border-t-2 border-duo-gray-100 pt-4">
                 <div className="flex items-center gap-1">
                    <AlertCircle size={14} />
                    {quiz.questions.length} Questions
                 </div>
                 <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {quiz.scheduledDate || 'Unscheduled'}
                 </div>
                 {quiz.linkedToCert && (
                    <div className="flex items-center gap-1 text-duo-yellowDark">
                        <LinkIcon size={14} />
                        Cert Linked
                    </div>
                 )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setMode('list')} className="flex items-center gap-2 text-duo-gray-500 hover:text-duo-blue text-sm font-extrabold">
                    <ChevronRight className="rotate-180" size={20} /> Back to List
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left: Meta Data */}
                <div className="space-y-6">
                    <div className="bg-white border-2 border-duo-gray-200 rounded-2xl p-6">
                        <h3 className="text-sm font-extrabold uppercase text-duo-gray-400 mb-4">Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase font-extrabold text-duo-gray-500 mb-1">Title</label>
                                <input 
                                    type="text" 
                                    value={currentQuiz.title}
                                    onChange={(e) => setCurrentQuiz({...currentQuiz, title: e.target.value})}
                                    className="w-full bg-duo-gray-100 border-2 border-transparent text-duo-gray-800 rounded-xl p-3 text-sm focus:border-duo-blue focus:bg-white focus:outline-none font-bold transition-all"
                                    placeholder="Quiz Title"
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase font-extrabold text-duo-gray-500 mb-1">Description</label>
                                <textarea 
                                    value={currentQuiz.description}
                                    onChange={(e) => setCurrentQuiz({...currentQuiz, description: e.target.value})}
                                    className="w-full bg-duo-gray-100 border-2 border-transparent text-duo-gray-800 rounded-xl p-3 text-sm focus:border-duo-blue focus:bg-white focus:outline-none h-24 resize-none font-medium transition-all"
                                    placeholder="Describe the quiz..."
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase font-extrabold text-duo-gray-500 mb-1">Status</label>
                                    <select 
                                        value={currentQuiz.status}
                                        onChange={(e) => setCurrentQuiz({...currentQuiz, status: e.target.value as any})}
                                        className="w-full bg-duo-gray-100 border-2 border-transparent text-duo-gray-800 rounded-xl p-3 text-xs focus:border-duo-blue focus:bg-white focus:outline-none font-bold transition-all"
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Active">Active</option>
                                        <option value="Archived">Archived</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-extrabold text-duo-gray-500 mb-1">Date</label>
                                    <input 
                                        type="date"
                                        value={currentQuiz.scheduledDate}
                                        onChange={(e) => setCurrentQuiz({...currentQuiz, scheduledDate: e.target.value})}
                                        className="w-full bg-duo-gray-100 border-2 border-transparent text-duo-gray-800 rounded-xl p-3 text-xs focus:border-duo-blue focus:bg-white focus:outline-none font-bold transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 border-t-2 border-duo-gray-100">
                                <input 
                                    type="checkbox" 
                                    id="certLink"
                                    checked={currentQuiz.linkedToCert}
                                    onChange={(e) => setCurrentQuiz({...currentQuiz, linkedToCert: e.target.checked})}
                                    className="w-5 h-5 text-duo-blue rounded border-duo-gray-300 focus:ring-duo-blue"
                                />
                                <label htmlFor="certLink" className="text-sm text-duo-gray-700 font-bold cursor-pointer">Link to Certification</label>
                            </div>
                        </div>
                    </div>
                    
                    <TacticalButton 
                        fullWidth 
                        onClick={handleSaveQuiz} 
                        disabled={isSaving}
                        icon={isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    >
                        {isSaving ? 'Saving...' : 'Save Quiz'}
                    </TacticalButton>
                </div>

                {/* Right: Questions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-extrabold uppercase text-duo-gray-400">Questions ({currentQuiz.questions?.length || 0})</h3>
                        <button onClick={addQuestion} className="text-sm text-duo-blue font-extrabold hover:text-duo-blueDark transition-colors flex items-center gap-1">
                            <Plus size={18} /> Add Question
                        </button>
                    </div>

                    <div className="space-y-4">
                        {currentQuiz.questions?.length === 0 && (
                            <div className="p-8 border-2 border-dashed border-duo-gray-200 rounded-2xl text-center text-duo-gray-400 text-sm font-bold">
                                No questions yet. Add one to get started!
                            </div>
                        )}

                        {currentQuiz.questions?.map((q, idx) => (
                            <div key={q.id} className="bg-white border-2 border-duo-gray-200 rounded-2xl p-6 relative shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3 flex-1">
                                        <span className="w-8 h-8 bg-duo-blue text-white rounded-lg flex items-center justify-center text-sm font-extrabold shadow-sm border-b-4 border-duo-blueDark">
                                            {idx + 1}
                                        </span>
                                        {editingQuestionId === q.id ? (
                                            <input 
                                                type="text"
                                                value={q.question}
                                                onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                                                className="flex-1 bg-duo-gray-50 border-b-2 border-duo-blue text-duo-gray-800 p-2 focus:outline-none font-bold text-lg"
                                                placeholder="Enter question text..."
                                                autoFocus
                                            />
                                        ) : (
                                            <h4 className="font-bold text-duo-gray-800 text-lg">{q.question || 'New Question'}</h4>
                                        )}
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <button 
                                            onClick={() => setEditingQuestionId(editingQuestionId === q.id ? null : q.id)}
                                            className={`p-2 rounded-lg hover:bg-duo-gray-100 ${editingQuestionId === q.id ? 'text-duo-blue' : 'text-duo-gray-400'}`}
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button 
                                            onClick={() => removeQuestion(q.id)}
                                            className="p-2 rounded-lg hover:bg-duo-red/10 text-duo-gray-400 hover:text-duo-red"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>

                                {editingQuestionId === q.id && (
                                    <div className="pl-11 space-y-3 mt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {q.options.map((opt, optIdx) => (
                                                <div key={optIdx} className="flex items-center gap-3 group">
                                                    <button 
                                                        onClick={() => updateQuestion(q.id, 'correctAnswer', optIdx)}
                                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                                            q.correctAnswer === optIdx ? 'border-duo-green bg-duo-green' : 'border-duo-gray-300 hover:border-duo-green'
                                                        }`}
                                                    >
                                                        {q.correctAnswer === optIdx && <CheckCircle size={16} className="text-white" />}
                                                    </button>
                                                    <input 
                                                        type="text"
                                                        value={opt}
                                                        onChange={(e) => updateOption(q.id, optIdx, e.target.value)}
                                                        className={`flex-1 bg-duo-gray-50 border-2 border-duo-gray-200 rounded-xl p-2 text-sm text-duo-gray-700 focus:outline-none focus:border-duo-blue transition-all ${
                                                            q.correctAnswer === optIdx ? 'border-duo-green/50 bg-duo-green/5' : ''
                                                        }`}
                                                        placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
      )}
    </div>
  );
};
