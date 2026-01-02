import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Recommendations from './pages/Recommendations';
import Itinerary from './pages/Itinerary';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{ background: '#1976d2', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '2px' }}>🌍 Travelingo</span>
          <div>
            <Link to="/" style={{ color: 'white', marginRight: '1.5rem', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
            <Link to="/recommendations" style={{ color: 'white', marginRight: '1.5rem', textDecoration: 'none', fontWeight: '500' }}>Recommendations</Link>
            <Link to="/itinerary" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Itinerary</Link>
          </div>
        </nav>
        <div style={{ marginTop: '2rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/itinerary" element={<Itinerary />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
