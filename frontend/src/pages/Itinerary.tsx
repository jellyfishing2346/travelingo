import React from 'react';

const Itinerary: React.FC = () => (
  <div style={{
    padding: '2.5rem',
    maxWidth: 700,
    margin: '2rem auto',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(25, 118, 210, 0.10)',
    textAlign: 'center',
  }}>
    <h2 style={{ fontSize: '2.2rem', color: '#1976d2', marginBottom: '1rem' }}>🗺️ Your Itinerary</h2>
    <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '1.5rem' }}>Here’s a sample itinerary for your next adventure:</p>
    <ol style={{
      margin: '1.5rem 0',
      fontSize: '1.1rem',
      color: '#444',
      textAlign: 'left',
      display: 'inline-block',
      lineHeight: 2,
    }}>
      <li><b>Day 1:</b> Arrive and explore the city center</li>
      <li><b>Day 2:</b> Guided tour of local attractions</li>
      <li><b>Day 3:</b> Outdoor adventure or cultural experience</li>
      <li><b>Day 4:</b> Relax, shop, and enjoy local cuisine</li>
      <li><b>Day 5:</b> Departure</li>
    </ol>
    <p style={{ marginTop: '2rem', color: '#1976d2', fontWeight: 'bold' }}>
      (Personalized itinerary editing coming soon!)
    </p>
  </div>
);

export default Itinerary;
