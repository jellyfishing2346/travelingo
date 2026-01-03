import React, { useEffect, useState } from 'react';
import { getItinerary } from '../api';


const Itinerary: React.FC = () => {
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getItinerary()
      .then(data => {
        setItinerary(data.itinerary);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load itinerary.');
        setLoading(false);
      });
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
      <h2 style={{ fontSize: '2.2rem', color: '#1976d2', marginBottom: '1rem' }}>🗺️ Your Itinerary</h2>
      {loading ? (
        <p>Loading itinerary...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '1.5rem' }}>Here’s your itinerary for your next adventure:</p>
          <ol style={{
            margin: '1.5rem 0',
            fontSize: '1.1rem',
            color: '#444',
            textAlign: 'left',
            display: 'inline-block',
            lineHeight: 2,
          }}>
            {itinerary.map((item, idx) => (
              <li key={idx}><b>Day {item.day}:</b> {item.activity}</li>
            ))}
          </ol>
          <p style={{ marginTop: '2rem', color: '#1976d2', fontWeight: 'bold' }}>
            (Personalized itinerary editing coming soon!)
          </p>
        </>
      )}
    </div>
  );
};

export default Itinerary;
