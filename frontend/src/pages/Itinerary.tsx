import React, { useEffect, useState } from 'react';
import { getItinerary } from '../api';

// Helper for copying shareable link
const copyShareLink = () => {
  navigator.clipboard.writeText(window.location.href);
  alert('Shareable link copied to clipboard!');
};

// Helper for printing itinerary
const printItinerary = () => {
  window.print();
};


const Itinerary: React.FC = () => {
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [newActivity, setNewActivity] = useState('');
  const [newDay, setNewDay] = useState('');
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
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={copyShareLink} style={{ marginRight: 12, background: '#1976d2', color: 'white', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 500, cursor: 'pointer' }}>Share</button>
        <button onClick={printItinerary} style={{ background: '#1976d2', color: 'white', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 500, cursor: 'pointer' }}>Print / PDF</button>
      </div>
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
              <li key={idx}>
                <b>Day {item.day}:</b> {item.activity}
                <button style={{ marginLeft: 10, color: '#d32f2f', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => {
                  setItinerary(itinerary.filter((_, i) => i !== idx));
                }}>Remove</button>
              </li>
            ))}
          </ol>
          <form style={{ marginTop: 20, textAlign: 'left', display: 'inline-block' }} onSubmit={e => {
            e.preventDefault();
            if (!newDay || !newActivity) return;
            setItinerary([...itinerary, { day: newDay, activity: newActivity }]);
            setNewDay('');
            setNewActivity('');
          }}>
            <label style={{ marginRight: 8 }}>
              Day:
              <input type="number" value={newDay} onChange={e => setNewDay(e.target.value)} style={{ marginLeft: 4, marginRight: 12, width: 60 }} min={1} required />
            </label>
            <label style={{ marginRight: 8 }}>
              Activity:
              <input type="text" value={newActivity} onChange={e => setNewActivity(e.target.value)} style={{ marginLeft: 4, marginRight: 12, width: 180 }} required />
            </label>
            <button type="submit" style={{ background: '#1976d2', color: 'white', border: 'none', borderRadius: 6, padding: '5px 14px', fontWeight: 500, cursor: 'pointer' }}>Add</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Itinerary;
