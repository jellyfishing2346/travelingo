import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Recommendations from './pages/Recommendations';
import Itinerary from './pages/Itinerary';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // Listen for storage changes (e.g., in other tabs)
  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="App">
        <nav style={{ background: '#1976d2', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.5rem', letterSpacing: '2px' }}>🌍 Travelingo</span>
          <div>
            {token ? (
              <>
                <Link to="/" style={{ color: 'white', marginRight: '1.5rem', textDecoration: 'none', fontWeight: '500' }}>Home</Link>
                <Link to="/recommendations" style={{ color: 'white', marginRight: '1.5rem', textDecoration: 'none', fontWeight: '500' }}>Recommendations</Link>
                <Link to="/itinerary" style={{ color: 'white', marginRight: '1.5rem', textDecoration: 'none', fontWeight: '500' }}>Itinerary</Link>
                <button style={{ marginLeft: '1.5rem', background: 'transparent', color: 'white', border: 'none', fontWeight: '500', cursor: 'pointer' }} onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: 'white', marginRight: '1.5rem', textDecoration: 'none', fontWeight: '500' }}>Login</Link>
                <Link to="/signup" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Sign Up</Link>
              </>
            )}
          </div>
        </nav>
        <div style={{ marginTop: '2rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup />} />
            {token && (
              <>
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/itinerary" element={<Itinerary />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
