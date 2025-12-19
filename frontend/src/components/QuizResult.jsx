import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, CheckCircle2, XCircle, RotateCcw, Home, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Data passed from QuizRoom.jsx
  const { result, topic } = location.state || { result: null, topic: "" };

  if (!result) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <button onClick={() => navigate('/')} className="text-indigo-600 underline">
          No results found. Return Home.
        </button>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.total) * 100);

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* SCORE SUMMARY CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10 text-center mb-10"
        >
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-6">
            <Trophy size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Quiz Completed!</h1>
          <p className="text-slate-500 mb-8">Topic: <span className="font-semibold text-slate-700">{topic}</span></p>
          
          <div className="flex justify-center gap-12 mb-10">
            <div>
              <p className="text-4xl font-black text-slate-900">{result.score}/{result.total}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Score</p>
            </div>
            <div className="w-px h-12 bg-slate-100" />
            <div>
              <p className="text-4xl font-black text-emerald-500">{percentage}%</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Accuracy</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/quiz-setup')}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
            >
              <RotateCcw size={18} /> Try Another
            </button>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
            >
              <Home size={18} /> Back to Home
            </button>
          </div>
        </motion.div>

        {/* DETAILED REVIEW SECTION */}
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Info size={20} className="text-indigo-500" />
          Detailed Review
        </h2>

        <div className="space-y-6">
          {result.review.map((item, index) => {
            // SAFETY CHECK: Ensure userAnswers exists and has an entry for this index
            const userAnswers = location.state?.result?.userAnswers || [];
            const currentUserAnswer = userAnswers[index];
            
            // A simple check to see if the answer was correct
            const isCorrect = item.correctAnswerIndex === currentUserAnswer;
  
            return (
                <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6"
                >
                    <div className="flex justify-between items-start gap-4 mb-4">
                        <h3 className="font-bold text-slate-800 leading-tight">
                            {index + 1}. {item.questionText}
                            </h3>
                            {/* Only show badge if we actually have an answer to compare */}
                            {currentUserAnswer !== undefined ? (
                            isCorrect ? (
                                <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-full shrink-0">
                                <CheckCircle2 size={14} /> Correct
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-rose-600 font-bold text-xs bg-rose-50 px-3 py-1 rounded-full shrink-0">
                                <XCircle size={14} /> Incorrect
                                </span>
                            )
                            ) : null}
                        </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {item.options.map((option, optIdx) => {
                const isSelected = optIdx === currentUserAnswer;
                const isRightAnswer = optIdx === item.correctAnswerIndex;

                let bgColor = "bg-slate-50 border-slate-100 text-slate-500";
                if (isRightAnswer) bgColor = "bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold";
                if (isSelected && !isRightAnswer) bgColor = "bg-rose-50 border-rose-200 text-rose-700 font-semibold";

                return (
                    <div key={optIdx} className={`p-3 rounded-xl border-2 text-sm ${bgColor}`}>
                    {option}
                    </div>
                );
                })}
            </div>

            {item.explanation && (
                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <p className="text-xs font-bold text-indigo-600 uppercase mb-1 text-left">AI Explanation:</p>
                <p className="text-sm text-slate-600 leading-relaxed text-left">{item.explanation}</p>
                </div>
            )}
            </motion.div>
        );
        })}
        </div>
      </div>
    </div>
  );
};

export default QuizResult;