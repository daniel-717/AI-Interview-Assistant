import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, HelpCircle, Loader2 } from 'lucide-react';

const BASE_URL = 'http://localhost:5000/api';

const QuizRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Data passed from QuizSetup.jsx
  const { questions, quizId, topic } = location.state || { questions: [], quizId: null, topic: "" };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!questions.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <button onClick={() => navigate('/')} className="text-indigo-600 underline">
          No quiz data found. Return Home.
        </button>
      </div>
    );
  }

  const handleOptionClick = (index) => {
    setCurrentSelection(index);
  };

  const handleNext = async () => {
    const updatedAnswers = [...selectedAnswers, currentSelection];
    setSelectedAnswers(updatedAnswers);
    setCurrentSelection(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Final Question - Submit to Backend
      submitQuiz(updatedAnswers);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${BASE_URL}/quiz/submit`, {
        quizId,
        answers: finalAnswers
      });
      
      // Navigate to Dashboard with results
      navigate('/quiz-result', { state: { result: response.data, topic } });
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* PROGRESS HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{topic} Quiz</h2>
            <p className="text-slate-900 font-semibold">Question {currentIndex + 1} of {questions.length}</p>
          </div>
          <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-emerald-500"
            />
          </div>
        </div>

        {/* QUESTION CARD */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 lg:p-12"
          >
            <div className="flex items-start gap-4 mb-8">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <HelpCircle size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                {currentQuestion.questionText}
              </h1>
            </div>

            {/* OPTIONS GRID */}
            <div className="grid gap-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(index)}
                  className={`group flex items-center justify-between p-5 rounded-2xl border-2 transition-all text-left ${
                    currentSelection === index 
                    ? 'border-emerald-500 bg-emerald-50/50 ring-4 ring-emerald-500/5' 
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                  }`}
                >
                  <span className={`font-medium ${currentSelection === index ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {option}
                  </span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    currentSelection === index ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200'
                  }`}>
                    {currentSelection === index && <CheckCircle2 size={14} className="text-white" />}
                  </div>
                </button>
              ))}
            </div>

            {/* ACTION BUTTON */}
            <div className="mt-10 flex justify-end">
              <button
                onClick={handleNext}
                disabled={currentSelection === null || isSubmitting}
                className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizRoom;