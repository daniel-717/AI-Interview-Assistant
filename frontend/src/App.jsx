import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import QuizSetup from './components/QuizSetup';          
import QuizRoom from './components/QuizRoom';        
import InterviewRoom from './components/InterviewRoom';
import QuizResult from './components/QuizResult';

const App = () => {
  return (
    <Router>
      <div className="bg-white min-h-screen font-sans antialiased text-slate-900">
        <Routes>
          <Route path="/" element={<LandingPage />} />

          {/* Interview Feature Routes */}
          <Route path="/interview-room" element={<InterviewRoom />} />

          {/* Quiz Feature Routes */}
          <Route path="/quiz-setup" element={<QuizSetup />} />
          <Route path="/quiz-room" element={<QuizRoom />} />
          <Route path="/quiz-result" element={<QuizResult />} />

          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-4xl font-bold">404</h1>
              <p>Page not found</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;