import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ClubLogin from './pages/clubMember/ClubLogin';
import ClubDashboard from './pages/clubMember/ClubDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/club-login" element={<ClubLogin />} />
        <Route path="/club-dashboard/:clubName" element={<ClubDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
