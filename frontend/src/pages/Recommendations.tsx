import React from 'react';

const Recommendations: React.FC = () => (
  <div style={{
    padding: '2.5rem',
    maxWidth: 700,
    margin: '2rem auto',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(25, 118, 210, 0.10)',
    textAlign: 'center',
  }}>
    <h2 style={{ fontSize: '2.2rem', color: '#1976d2', marginBottom: '1rem' }}>🌐 Recommendations</h2>
    <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '1.5rem' }}>Here are some top destinations for this season:</p>
    <ul style={{
      margin: '1.5rem 0',
      fontSize: '1.1rem',
      color: '#444',
      textAlign: 'left',
      display: 'inline-block',
      lineHeight: 2,
    }}>
      <li>🏖️ <b>Maldives</b> – Best for winter escapes and beach lovers</li>
      <li>⛰️ <b>Swiss Alps</b> – Perfect for skiing and winter sports</li>
      <li>🌸 <b>Kyoto, Japan</b> – Stunning cherry blossoms in spring</li>
      <li>🏜️ <b>Marrakech, Morocco</b> – Warm and vibrant in autumn</li>
    </ul>
    <p style={{ marginTop: '2rem', color: '#1976d2', fontWeight: 'bold' }}>
      Tell us your preferences to get even more personalized recommendations!
    </p>
  </div>
);

export default Recommendations;
