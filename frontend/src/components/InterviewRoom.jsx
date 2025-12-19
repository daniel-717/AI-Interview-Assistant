import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Loader2, Send, FastForward, CheckCircle, RefreshCcw, Star } from 'lucide-react';

const BASE_URL = 'https://ai-interview-assistant-r0ww.onrender.com/api';

const InterviewRoom = () => {
    const [setup, setSetup] = useState({ role: '', count: 5 });
    const [questions, setQuestions] = useState([]);
    const [interviewId, setInterviewId] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Logic: Start Interview
    const handleStart = async () => {
        if (!setup.role) return toast.error("Please enter a job role!");
        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/interviews/generate`, setup);
            setQuestions(res.data.questions);
            setInterviewId(res.data._id);
            toast.success("Interview Prepared!");
        } catch (err) {
            toast.error("Could not generate questions. Check connection.");
        } finally {
            setLoading(false);
        }
    };

    // Logic: Submit or Skip
    const handleSubmit = async (isSkipped = false) => {
        if (!userAnswer && !isSkipped) return toast.warning("Answer or Skip to continue.");
        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/interviews/submit-answer`, {
                interviewId,
                questionIndex: currentIndex,
                userAnswer: isSkipped ? "" : userAnswer,
                isSkipped
            });
            
            // Store feedback and update local question state for the final summary
            const aiFeedback = res.data.feedback;
            setFeedback(aiFeedback);
            setQuestions(prev => {
                const updated = [...prev];
                updated[currentIndex].feedback = aiFeedback;
                updated[currentIndex].userAnswer = isSkipped ? "SKIPPED" : userAnswer;
                return updated;
            });

            toast.info(isSkipped ? "Question Skipped" : "Answer Evaluated");
        } catch (err) {
            toast.error("Gemini failed to evaluate.");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(c => c + 1);
            setFeedback(null);
            setUserAnswer('');
        } else {
            setIsFinished(true);
        }
    };

    // --- VIEW 1: SETUP ---
    if (questions.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50">
                <div className="w-full max-w-4xl p-8 bg-white rounded-3xl shadow-2xl border border-indigo-50">
                    <div className="mb-8 text-center">
                        <div className="inline-flex p-3 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
                            <Star className="text-white" size={28} />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800">AI Interviewer</h1>
                        <p className="text-slate-500 mt-2">Get ready for your next big role</p>
                    </div>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="text-sm font-semibold text-slate-700 ml-1">Job Role</label>
                            <input 
                                type="text" 
                                className="w-full mt-1 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                                placeholder="e.g. Frontend Engineer" 
                                onChange={e => setSetup({...setup, role: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700 ml-1">Total Questions</label>
                            <input 
                                type="number" 
                                className="w-full mt-1 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                                min="1" max="10" 
                                value={setup.count} 
                                onChange={e => setSetup({...setup, count: e.target.value})} 
                            />
                        </div>
                        <button 
                            onClick={handleStart} 
                            disabled={loading}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Start Mock Interview"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW 2: FINAL RESULTS ---
    if (isFinished) {
        const avgScore = (questions.reduce((s, q) => s + (q.feedback?.score || 0), 0) / questions.length).toFixed(1);
        return (
            <div className="max-w-6xl mx-auto mt-16 p-4">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-indigo-600 p-8 text-center text-white">
                        <CheckCircle className="mx-auto mb-4 opacity-90" size={56} />
                        <h2 className="text-4xl font-bold">Session Complete</h2>
                        <div className="mt-4 text-indigo-100 font-medium">Average Performance: {avgScore} / 10</div>
                    </div>
                    <div className="p-8 space-y-8">
                        {questions.map((q, i) => (
                            <div key={i} className="border-b border-slate-100 pb-6 last:border-0">
                                <h4 className="text-lg font-bold text-slate-800 leading-tight mb-2">Q{i+1}: {q.questionText}</h4>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${q.feedback?.score >= 7 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        Score: {q.feedback?.score || 0}/10
                                    </span>
                                </div>
                                <p className="text-slate-600 text-sm italic bg-slate-50 p-3 rounded-lg border-l-4 border-slate-200 mb-3">"{q.userAnswer}"</p>
                                <p className="text-slate-700 text-sm leading-relaxed"><span className="font-bold text-indigo-600">Feedback: </span>{q.feedback?.improvement}</p>
                            </div>
                        ))}
                        <button 
                            onClick={() => window.location.reload()}
                            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition flex items-center justify-center gap-2"
                        >
                            <RefreshCcw size={20} /> Try Another Role
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW 3: ACTIVE INTERVIEW ---
    return (
        <div className="max-w-6xl mx-auto mt-16 p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                {/* Header Progress */}
                <div className="px-8 pt-8 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Question {currentIndex + 1} of {questions.length}</span>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full">
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{width: `${((currentIndex+1)/questions.length)*100}%`}}></div>
                    </div>
                </div>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-slate-800 leading-snug mb-8">
                        {questions[currentIndex].questionText}
                    </h2>

                    {!feedback ? (
                        <div className="space-y-6">
                            <textarea 
                                className="w-full p-6 h-48 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-indigo-300 outline-none resize-none text-slate-700 placeholder:text-slate-400 text-lg transition-all"
                                placeholder="Explain your answer in detail..."
                                value={userAnswer}
                                onChange={e => setUserAnswer(e.target.value)}
                            />
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => handleSubmit(false)} 
                                    disabled={loading}
                                    className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />} Submit Answer
                                </button>
                                <button 
                                    onClick={() => handleSubmit(true)} 
                                    disabled={loading}
                                    className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200 transition flex items-center justify-center gap-2"
                                >
                                    <FastForward size={18} /> Skip
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className={`p-6 rounded-3xl border-l-[10px] mb-6 ${feedback.score >= 7 ? 'bg-green-50 border-green-500' : 'bg-amber-50 border-amber-500'}`}>
                                <h3 className="text-xl font-bold mb-2">Score: {feedback.score}/10</h3>
                                <p className="text-slate-700 text-sm leading-relaxed">{feedback.improvement}</p>
                            </div>
                            
                            <div className="bg-indigo-50 p-6 rounded-3xl mb-8">
                                <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">Recommended Answer</h4>
                                <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap break-words">{feedback.suggestedAnswer}</p>
                            </div>

                            <button onClick={handleNext} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:shadow-xl transition-all">
                                {currentIndex < questions.length - 1 ? "Next Question" : "View Final Report"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InterviewRoom;