import React, { useEffect, useState } from 'react';
import { getRecommendations } from '../api';


const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [season, setSeason] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [formLoading, setFormLoading] = useState(false);


  useEffect(() => {
    getRecommendations()
      .then(data => {
        setRecommendations(data.recommendations);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load recommendations.');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '2.5rem', maxWidth: 700, margin: '2rem auto', background: 'white', borderRadius: '16px', boxShadow: '0 4px 24px rgba(25, 118, 210, 0.10)', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.2rem', color: '#1976d2', marginBottom: '1rem' }}>🌐 Recommendations</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <label>
          Season:
          <select value={season} onChange={e => setSeason(e.target.value)} required style={{ marginLeft: 8 }}>
            <option value="">Select</option>
            <option value="Winter">Winter</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Autumn">Autumn</option>
          </select>
        </label>
        <br /><br />
        <label>
          Interests:
          <input type="text" value={interests} onChange={e => setInterests(e.target.value)} placeholder="e.g. beaches, skiing" style={{ marginLeft: 8 }} required />
        </label>
        <br /><br />
        <label>
          Budget:
          <select value={budget} onChange={e => setBudget(e.target.value)} required style={{ marginLeft: 8 }}>
            <option value="">Select</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>
        <br /><br />
        <button type="submit" style={{ background: '#1976d2', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem' }}>
          Get Recommendations
        </button>
      </form>
      {loading ? (
        <p>Loading recommendations...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '1.5rem' }}>Here are some top destinations for this season:</p>
          <ul style={{
            margin: '1.5rem 0',
            fontSize: '1.1rem',
            color: '#444',
            textAlign: 'left',
            display: 'inline-block',
            lineHeight: 2,
          }}>
            {recommendations.map((rec, idx) => (
              <li key={idx}>
                <b>{rec.destination}</b> ({rec.season}) – {rec.description}
              </li>
            ))}
          </ul>
          <p style={{ marginTop: '2rem', color: '#1976d2', fontWeight: 'bold' }}>
            Tell us your preferences to get even more personalized recommendations!
          </p>
        </>
      )}
    </div>
  );
};

export default Recommendations;