import React, { useEffect, useState } from 'react';
import { getRecommendations, postRecommendations } from '../api';


const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [season, setSeason] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const handleInterestChange = (interest: string) => {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);
    try {
      const data = await postRecommendations({ season, interests, budget });
      setRecommendations(data.recommendations);
    } catch (err) {
      setError('Failed to fetch personalized recommendations.');
    } finally {
      setFormLoading(false);
    }
  };


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
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', textAlign: 'left', display: 'inline-block', width: '100%', maxWidth: 400 }}>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Season:
          <select value={season} onChange={e => setSeason(e.target.value)} style={{ marginLeft: 8 }} required>
            <option value="">Select</option>
            <option value="Winter">Winter</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Autumn">Autumn</option>
          </select>
        </label>
        <fieldset style={{ border: 'none', margin: '12px 0' }}>
          <legend>Interests:</legend>
          <label style={{ marginRight: 12 }}>
            <input type="checkbox" value="beach" checked={interests.includes('beach')} onChange={() => handleInterestChange('beach')} /> Beach
          </label>
          <label style={{ marginRight: 12 }}>
            <input type="checkbox" value="relaxation" checked={interests.includes('relaxation')} onChange={() => handleInterestChange('relaxation')} /> Relaxation
          </label>
          <label style={{ marginRight: 12 }}>
            <input type="checkbox" value="adventure" checked={interests.includes('adventure')} onChange={() => handleInterestChange('adventure')} /> Adventure
          </label>
          <label style={{ marginRight: 12 }}>
            <input type="checkbox" value="skiing" checked={interests.includes('skiing')} onChange={() => handleInterestChange('skiing')} /> Skiing
          </label>
          <label style={{ marginRight: 12 }}>
            <input type="checkbox" value="culture" checked={interests.includes('culture')} onChange={() => handleInterestChange('culture')} /> Culture
          </label>
          <label style={{ marginRight: 12 }}>
            <input type="checkbox" value="nature" checked={interests.includes('nature')} onChange={() => handleInterestChange('nature')} /> Nature
          </label>
        </fieldset>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Budget:
          <select value={budget} onChange={e => setBudget(e.target.value)} style={{ marginLeft: 8 }} required>
            <option value="">Select</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <button type="submit" style={{ marginTop: 12, background: '#1976d2', color: 'white', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600 }} disabled={formLoading}>
          {formLoading ? 'Loading...' : 'Get Personalized Recommendations'}
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