import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ClubLogin from './pages/clubMember/ClubLogin';
import ClubDashboard from './pages/clubMember/ClubDashboard';
import ParticipantSignup from './pages/participant/ParticipantSignup';
import ParticipantLogin from './pages/participant/ParticipantLogin';
import ParticipantDashboard from './pages/participant/participantDashboard';
import SelectInterests from './pages/participant/SelectInterests';
import LoadingScreen from './pages/participant/LoadingScreen'; // <- Import the loading screen
import Loading from './pages/participant/Loading';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/club-login" element={<ClubLogin />} />
        <Route path="/club-dashboard/:clubName" element={<ClubDashboard />} />
        <Route path="/participant-signup" element={<ParticipantSignup />} />
        <Route path="/participant-login" element={<ParticipantLogin />} />
        <Route path="/select-interests" element={<SelectInterests />} />
        <Route path="/participant-dashboard" element={<ParticipantDashboard />} />
        <Route path="/loading" element={<Loading />} />
      </Routes>
    </Router>
  );
}

export default App;
