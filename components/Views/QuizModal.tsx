
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Trophy, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import { QuizQuestion } from '../../types';
import { TacticalButton } from '../ui/TacticalButton';

interface QuizModalProps {
  onClose: () => void;
  title: string;
  questions: QuizQuestion[];
  onPass?: (xp: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ onClose, title, questions, onPass }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Animation State
  const [showCorrectAnim, setShowCorrectAnim] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleConfirm = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
      setShowCorrectAnim(true);
      // Auto hide animation overlay
      setTimeout(() => setShowCorrectAnim(false), 1200);
    }
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleFinish = () => {
      const xpEarned = 500; // Base XP for passing
      if (onPass) onPass(xpEarned);
      else onClose();
  };

  const passThreshold = Math.ceil(questions.length * 0.8);
  const passed = score >= passThreshold;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Correct Answer Celebration Overlay */}
      <AnimatePresence>
          {showCorrectAnim && (
              <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="absolute z-[110] pointer-events-none"
              >
                  <div className="bg-white p-6 rounded-full shadow-[0_0_50px_rgba(34,197,94,0.6)] flex flex-col items-center">
                      <div className="w-24 h-24 bg-duo-green rounded-full flex items-center justify-center text-white mb-2 animate-bounce">
                          <CheckCircle size={48} strokeWidth={4} />
                      </div>
                      <div className="text-3xl font-extrabold text-duo-green uppercase tracking-wider">Correct!</div>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-[105]"
      >
        {/* Header */}
        <div className="p-6 border-b-2 border-duo-gray-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl font-extrabold text-duo-gray-800">Knowledge Check</h2>
            <p className="text-xs font-bold text-duo-gray-400 uppercase">{title}</p>
          </div>
          <button onClick={onClose} className="text-duo-gray-400 hover:bg-duo-gray-100 rounded-full p-2 transition-colors">
            <X size={24} />
          </button>
        </div>

        {!showResult && (
          <div className="w-full h-4 bg-duo-gray-100">
            <motion.div 
              className="h-full bg-duo-green rounded-r-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        )}

        <div className="p-8 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
          {!showResult ? (
            <>
              <div className="mb-8">
                <h3 className="text-2xl font-extrabold text-duo-gray-800 leading-tight mb-6">
                  {currentQuestion.question}
                </h3>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQuestion.correctAnswer;
                    
                    let borderClass = "border-duo-gray-200 hover:bg-duo-gray-50";
                    let bgClass = "bg-white";
                    let textClass = "text-duo-gray-700";
                    
                    if (isAnswered) {
                      if (isCorrect) {
                        borderClass = "border-duo-green bg-duo-green/10";
                        textClass = "text-duo-green";
                      } else if (isSelected && !isCorrect) {
                        borderClass = "border-duo-red bg-duo-red/10";
                        textClass = "text-duo-red";
                      } else {
                        textClass = "text-duo-gray-400";
                      }
                    } else if (isSelected) {
                      borderClass = "border-duo-blue bg-duo-blue/10";
                      textClass = "text-duo-blue";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 border-2 rounded-2xl ${borderClass} ${bgClass} ${textClass} font-bold transition-all flex items-center justify-between group shadow-sm`}
                      >
                        <span className="flex items-center gap-4">
                          <span className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center text-sm font-extrabold ${
                              isAnswered && isCorrect ? 'border-duo-green text-duo-green bg-white' :
                              isAnswered && isSelected && !isCorrect ? 'border-duo-red text-duo-red bg-white' :
                              isSelected ? 'border-duo-blue bg-duo-blue text-white' : 'border-duo-gray-200 text-duo-gray-400'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {option}
                        </span>
                        
                        {isAnswered && isCorrect && <CheckCircle size={24} className="text-duo-green" />}
                        {isAnswered && isSelected && !isCorrect && <AlertCircle size={24} className="text-duo-red" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-auto pt-6 border-t-2 border-duo-gray-100 flex justify-end">
                {!isAnswered ? (
                  <TacticalButton 
                    fullWidth
                    disabled={selectedOption === null}
                    onClick={handleConfirm}
                    className={selectedOption === null ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    Check Answer
                  </TacticalButton>
                ) : (
                  <TacticalButton fullWidth variant={selectedOption === currentQuestion.correctAnswer ? 'primary' : 'danger'} onClick={handleNext}>
                    {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ChevronRight size={20} />
                  </TacticalButton>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 border-4 relative ${passed ? 'border-duo-green bg-duo-green/10' : 'border-duo-red bg-duo-red/10'}`}>
                <Trophy size={64} className={passed ? 'text-duo-green' : 'text-duo-red'} />
                
                {passed && (
                     <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="absolute -top-2 -right-2 bg-duo-yellow text-white p-2 rounded-full border-4 border-white"
                     >
                         <Sparkles size={24} fill="currentColor" />
                     </motion.div>
                )}
              </div>
              
              <h3 className={`text-3xl font-extrabold mb-2 ${passed ? 'text-duo-green' : 'text-duo-red'}`}>
                {passed ? 'Quiz Passed!' : 'Keep Trying!'}
              </h3>
              
              <p className="text-duo-gray-500 font-bold mb-8 max-w-md">
                {passed 
                  ? `Excellent work, Coach! You've demonstrated mastery of this module.` 
                  : `You need ${passThreshold} correct answers to pass. Review the materials and try again.`}
              </p>
              
              {passed && (
                  <div className="bg-duo-yellow/10 border-2 border-duo-yellow/30 px-6 py-4 rounded-2xl mb-8 flex flex-col items-center">
                      <div className="text-xs font-extrabold text-duo-yellowDark uppercase mb-1">Rewards Earned</div>
                      <div className="text-3xl font-extrabold text-duo-gray-800 flex items-center gap-2">
                          <Trophy size={28} className="text-duo-yellow" /> +500 XP
                      </div>
                  </div>
              )}

              <div className="flex gap-4 w-full">
                {!passed && (
                    <TacticalButton fullWidth variant="secondary" onClick={resetQuiz}>
                    Try Again
                    </TacticalButton>
                )}
                <TacticalButton fullWidth onClick={passed ? handleFinish : onClose}>
                  {passed ? 'Claim Reward' : 'Close'}
                </TacticalButton>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
