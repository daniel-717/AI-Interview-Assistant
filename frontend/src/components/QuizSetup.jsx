import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Zap, Sparkles } from 'lucide-react';
import axios from 'axios';

const BASE_URL = 'https://ai-interview-assistant-r0ww.onrender.com/api';
const QuizSetup = () => {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const trendingTopics = ["React", "JavaScript", "Node.js", "Python", "System Design", "SQL"];

  const handleStartQuiz = async () => {
        setLoading(true);
        try {
        const response = await axios.post(`${BASE_URL}/quiz/generate-quiz`, {
            topic,
            count
        });

        // Axios puts the response body inside a 'data' property
        const { questions, quizId } = response.data;
        
        navigate('/quiz-room', { 
            state: { 
            questions, 
            quizId, 
            topic 
            } 
        });

        } catch (error) {
        console.error("Quiz Gen Error:", error);
        
        // Axios error handling: check if it's a 429 quota error
        const message = error.response?.status === 429 
            ? "Daily AI quota exceeded. Please try again tomorrow!" 
            : "Error generating quiz. Please check your connection.";
            
        alert(message);
        } finally {
        setLoading(false);
        }
    };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        
        {/* Header Decor */}
        <div className="h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />

        <div className="p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <Settings size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Quiz Configuration</h1>
              <p className="text-slate-500 text-sm">Customize your testing experience</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Topic Input */}
            <div>
              <label className="block text-lg font-semibold text-slate-700 mb-3">What topic do you want to test?</label>
              <input 
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Advanced CSS, Docker, Golang..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
              />
              
              {/* Trending Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {trendingTopics.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTopic(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      topic === t ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count Slider */}
            <div>
              <div className="flex justify-between mb-3">
                <label className="text-base font-semibold text-slate-700">Number of Questions</label>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full text-xs">{count} Questions</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold px-1">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartQuiz}
              disabled={!topic || loading}
              className="w-full py-5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all group"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Generate AI Quiz
                  <Sparkles size={20} className="text-emerald-400 group-hover:rotate-12 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 p-6 flex items-center gap-3 border-t border-slate-100">
          <div className="p-2 bg-white rounded-lg border border-slate-200">
            <Zap size={16} className="text-amber-500" />
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Questions are unique and generated in real-time. Results will be saved to your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizSetup;