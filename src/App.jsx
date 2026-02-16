import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreatePoll from './components/CreatePoll';
import PollVoting from './components/PollVoting';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <Navbar />
        <Routes>
          <Route path="/" element={<CreatePoll />} />
          <Route path="/poll/:pollId" element={<PollVoting />} />
        </Routes>
      </div>
    </Router>
  );
}
