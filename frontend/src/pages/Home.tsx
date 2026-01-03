import React, { useEffect, useState } from 'react';
import { getHealth } from '../api';

const Home: React.FC = () => {
  const [health, setHealth] = useState<string | null>(null);

  useEffect(() => {
    getHealth()
      .then(data => setHealth(data.status))
      .catch(() => setHealth("API unavailable"));
  }, []);

  return (
    <div style={{
      padding: '2.5rem',
      maxWidth: 700,
      margin: '2rem auto',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 24px rgba(25, 118, 210, 0.10)',
      textAlign: 'center',
    }}>
      <h2 style={{ fontSize: '2.2rem', color: '#1976d2', marginBottom: '1rem' }}>🏠 Welcome to Travelingo</h2>
      <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '1.5rem' }}>
        Your smart travel companion! Discover the best destinations for any season, get personalized recommendations, and plan your perfect trip with ease.
      </p>
      <ul style={{
        margin: '1.5rem 0',
        fontSize: '1.1rem',
        color: '#444',
        textAlign: 'left',
        display: 'inline-block',
        lineHeight: 2,
      }}>
        <li>🌤️ Season-aware destination suggestions</li>
        <li>🧭 Personalized recommendations based on your preferences</li>
        <li>🗺️ Easy itinerary planning and management</li>
        <li>🔒 Secure and user-friendly experience</li>
      </ul>
      <p style={{ marginTop: '2rem', fontWeight: 'bold', color: '#1976d2' }}>
        Start your journey by exploring recommendations or building your itinerary!
      </p>
      <p style={{ marginTop: '2rem', color: '#388e3c', fontWeight: 'bold' }}>
        Backend status: {health ? health : "Loading..."}
      </p>
    </div>
  );
};

export default Home;