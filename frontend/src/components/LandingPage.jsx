import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, ClipboardCheck, GraduationCap, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <header className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-6">
          <Bot size={16} />
          <span>Powered by Groq AI</span>
        </div>
        <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Master Your Next <span className="text-indigo-600">Tech Interview.</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          The all-in-one AI platform to practice coding interviews and test your 
          technical knowledge with smart, adaptive quizzes.
        </p>
      </header>

      {/* 2. FEATURE CARDS SECTION */}
      <main className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* MOCK INTERVIEW CARD */}
          <div className="group p-8 rounded-[2rem] border-2 border-slate-100 bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-200">
              <ClipboardCheck size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Mock Interview</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Experience a realistic technical interview. Receive specific questions for your role and get instant AI-powered feedback on your answers.
            </p>
            <Link 
              to="/interview-room" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Start Interview <ChevronRight size={18} />
            </Link>
          </div>

          {/* QUIZ TEST CARD */}
          <div className="group p-8 rounded-[2rem] border-2 border-slate-100 bg-white hover:border-emerald-100 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-200">
              <GraduationCap size={28} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Quiz Test</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Quickly test your knowledge on specific topics. Generate 1-10 MCQs and get a detailed score report with correct answers.
            </p>
            <Link 
              to="/quiz-setup" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
            >
              Take a Quiz <ChevronRight size={18} />
            </Link>
          </div>

        </div>
      </main>

      {/* 3. TRUST FOOTER */}
      <footer className="border-t border-slate-100 py-12 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-6 text-center text-slate-500 text-sm">
          Built for developers by developers. Practice safely and improve daily.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;