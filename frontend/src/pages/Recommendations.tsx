import React, { useEffect, useState } from 'react';
// @ts-ignore: No type declarations for react-error-boundary
import { ErrorBoundary } from 'react-error-boundary';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getRecommendations, postRecommendations } from '../api';

export type Recommendation = {
  destination: string;
  season?: string;
  description?: string;
  country?: string;
  image?: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  itinerary?: Array<{ day: number; activity: string }>;
};



const RecommendationCard: React.FC<{ rec: Recommendation; onClick: () => void }> = ({ rec, onClick }) => (
  <div
    style={{
      border: '1px solid #e0e0e0',
      borderRadius: 12,
      padding: 18,
      marginBottom: 18,
      width: 320,
      boxShadow: '0 2px 12px rgba(25, 118, 210, 0.10)',
      cursor: 'pointer',
      transition: 'box-shadow 0.2s, transform 0.2s',
      background: '#fafcff',
    }}
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-label={`View details for ${rec.destination}`}
    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
  >
    {(rec.image || rec.image_url) && (
      <img
        src={rec.image || rec.image_url}
        alt={rec.destination}
        style={{ width: '100%', borderRadius: 10, marginBottom: 10, objectFit: 'cover', maxHeight: 160 }}
      />
    )}
    <h3 style={{ margin: '8px 0 4px 0', color: '#1976d2' }}>{rec.destination}</h3>
    {rec.country && <p style={{ margin: 0, color: '#666' }}>{rec.country}</p>}
    {rec.season && <p style={{ margin: 0 }}><b>Best season:</b> {rec.season}</p>}
    {rec.description && <p style={{ margin: '8px 0 0 0' }}>{rec.description}</p>}
    <button style={{ marginTop: 10, background: '#1976d2', color: 'white', border: 'none', borderRadius: 6, padding: '7px 16px', fontWeight: 500, cursor: 'pointer' }} onClick={e => { e.stopPropagation(); onClick(); }} aria-label={`View details for ${rec.destination}`}>View Details</button>
  </div>
);

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [season, setSeason] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [country, setCountry] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Modal state
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);

  // Map state
  const [showMap, setShowMap] = useState(false);

  // Error boundary fallback for map
  function MapErrorFallback({ error }: { error: Error }) {
    return <div style={{ color: 'red', marginBottom: 16 }}>Map failed to load: {error.message}</div>;
  }

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
      // If no interests selected, treat as 'All'
      const interestsToSend = interests.length === 0 ? ['all'] : interests;
      const data = await postRecommendations({ season, interests: interestsToSend, budget });
      setRecommendations(data.recommendations);
    } catch (err) {
      setError('Failed to fetch personalized recommendations.');
    } finally {
      setFormLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
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

  // Modal close handler
  const closeModal = () => setSelectedRec(null);

  // Deduplicate recommendations by destination name
  const uniqueRecommendations = recommendations.filter((rec, idx, arr) =>
    arr.findIndex(r => r.destination === rec.destination) === idx
  );

  // Filter by country if selected
  const filteredRecommendations = country
    ? uniqueRecommendations.filter(rec => rec.country && rec.country.toLowerCase().includes(country.toLowerCase()))
    : uniqueRecommendations;

  // Get all countries for filter dropdown
  const allCountries = Array.from(new Set(uniqueRecommendations.map(rec => rec.country).filter(Boolean)));

  return (
    <div style={{
      padding: '2.5rem',
      maxWidth: 900,
      margin: '2rem auto',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 24px rgba(25, 118, 210, 0.10)',
      textAlign: 'center',
      position: 'relative',
    }}>
      <h2 style={{ fontSize: '2.2rem', color: '#1976d2', marginBottom: '1rem' }}>🌐 Recommendations</h2>
      <form onSubmit={handleSubmit} style={{
        marginBottom: '2rem',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem',
        width: '100%',
        maxWidth: 420,
        background: '#f7faff',
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
        padding: '1.5rem 2rem',
        border: '1px solid #e0eafc',
        marginLeft: 'auto',
        marginRight: 'auto'
      }} aria-label="Preferences form">
        <label htmlFor="season-select" style={{ display: 'block', marginBottom: 8 }}>
          <span style={{ fontWeight: 500, color: '#1976d2', marginRight: 8 }}>Season:</span>
          <select id="season-select" value={season} onChange={e => setSeason(e.target.value)} style={{ marginLeft: 0, padding: '6px 12px', borderRadius: 6, border: '1px solid #bcdffb', fontSize: '1rem', background: '#fff', color: '#1976d2', fontWeight: 500 }} required>
            <option value="">Select</option>
            <option value="All">All</option>
            <option value="Winter">Winter</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Autumn">Autumn</option>
          </select>
        </label>
        <fieldset style={{ border: 'none', margin: '12px 0' }}>
          <legend style={{ fontWeight: 500, color: '#1976d2', marginBottom: 8 }}>Interests:</legend>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
            {['beach', 'relaxation', 'adventure', 'skiing', 'culture', 'nature'].map(interest => (
              <label key={interest} style={{ display: 'flex', alignItems: 'center', background: '#eaf6fb', borderRadius: 6, padding: '4px 10px', fontWeight: 500, color: '#1976d2', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  value={interest}
                  checked={interests.includes(interest)}
                  onChange={() => handleInterestChange(interest)}
                  style={{ marginRight: 6 }}
                /> {interest.charAt(0).toUpperCase() + interest.slice(1)}
              </label>
            ))}
          </div>
        </fieldset>
        <label htmlFor="budget-select" style={{ display: 'block', marginBottom: 8 }}>
          <span style={{ fontWeight: 500, color: '#1976d2', marginRight: 8 }}>Budget:</span>
          <select id="budget-select" value={budget} onChange={e => setBudget(e.target.value)} style={{ marginLeft: 0, padding: '6px 12px', borderRadius: 6, border: '1px solid #bcdffb', fontSize: '1rem', background: '#fff', color: '#1976d2', fontWeight: 500 }} required>
            <option value="">Select</option>
            <option value="All">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        {allCountries.length > 0 && (
          <label htmlFor="country-select" style={{ display: 'block', marginBottom: 8 }}>
            Country:
            <select id="country-select" value={country} onChange={e => setCountry(e.target.value)} style={{ marginLeft: 8 }}>
              <option value="">All</option>
              {allCountries.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        )}
        <button type="submit" style={{
          marginTop: 12,
          background: '#1976d2',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          padding: '8px 18px',
          fontWeight: 600
        }} disabled={formLoading} aria-label="Get Personalized Recommendations">
          {formLoading ? 'Loading...' : 'Get Personalized Recommendations'}
        </button>
      </form>
      <button
        style={{ marginBottom: '1.5rem', background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 6, padding: '6px 14px', fontWeight: 500, cursor: 'pointer' }}
        onClick={() => setShowMap(!showMap)}
        aria-label="Toggle map view"
      >
        {showMap ? 'Hide Map' : 'Show Map'}
      </button>
      {loading || formLoading ? (
        <p>Loading recommendations...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : filteredRecommendations.length === 0 ? (
        <div style={{ margin: '2rem 0', color: '#888', fontSize: '1.1rem' }}>
          <p>No recommendations found. Try adjusting your preferences!</p>
          <span role="img" aria-label="sad">😕</span>
        </div>
      ) : (
        <>
          <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '1.5rem' }}>
            Here are some top destinations for this season:
          </p>
          {showMap && (
            <ErrorBoundary FallbackComponent={MapErrorFallback}>
              <div style={{ marginBottom: '2rem', width: '100%', height: '350px', borderRadius: 12, overflow: 'hidden' }}>
                <MapContainer
                  center={filteredRecommendations.length > 0 && filteredRecommendations[0].latitude && filteredRecommendations[0].longitude ? [filteredRecommendations[0].latitude, filteredRecommendations[0].longitude] : [20, 0]}
                  zoom={filteredRecommendations.length > 0 && filteredRecommendations[0].latitude && filteredRecommendations[0].longitude ? 3 : 2}
                  style={{ width: '100%', height: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filteredRecommendations.map((rec, idx) => {
                    // Fallback coordinates for missing lat/lng
                    let lat = rec.latitude;
                    let lng = rec.longitude;
                    if (lat == null || lng == null) {
                      // Example fallback: center of country or default
                      if (rec.country === 'Switzerland') { lat = 46.8182; lng = 8.2275; }
                      else if (rec.country === 'Japan') { lat = 36.2048; lng = 138.2529; }
                      else if (rec.country === 'Canada') { lat = 56.1304; lng = -106.3468; }
                      else if (rec.country === 'France') { lat = 46.6034; lng = 1.8883; }
                      else if (rec.country === 'United States') { lat = 37.0902; lng = -95.7129; }
                      else if (rec.country === 'Greece') { lat = 39.0742; lng = 21.8243; }
                      else if (rec.country === 'New Zealand') { lat = -40.9006; lng = 174.8860; }
                      else if (rec.country === 'Italy') { lat = 41.8719; lng = 12.5674; }
                      else if (rec.country === 'Indonesia') { lat = -0.7893; lng = 113.9213; }
                      else { lat = 20; lng = 0; }
                    }
                    return (
                      <Marker
                        key={rec.destination + idx}
                        position={[lat, lng]}
                        icon={L.icon({
                          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                          iconSize: [25, 41],
                          iconAnchor: [12, 41],
                          popupAnchor: [1, -34],
                          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                          shadowSize: [41, 41],
                        })}
                      >
                        <Popup>
                          <div style={{ textAlign: 'center', minWidth: 120 }}>
                            <strong>{rec.destination}</strong><br />
                            {rec.country && <span>{rec.country}<br /></span>}
                            {rec.season && <span><b>Best season:</b> {rec.season}<br /></span>}
                            {rec.image_url || rec.image ? <img src={rec.image_url || rec.image} alt={rec.destination} style={{ width: '100%', borderRadius: 6, marginTop: 6, maxHeight: 60, objectFit: 'cover' }} /> : null}
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            </ErrorBoundary>
          )}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            justifyContent: 'center'
          }}>
            {filteredRecommendations.map((rec, idx) => (
              <div key={rec.destination} style={{ width: 340 }}>
                <RecommendationCard rec={rec} onClick={() => setSelectedRec(rec)} />
                {/* Itinerary section for each recommendation */}
                <div style={{ background: '#f5f5f5', borderRadius: 8, marginTop: 8, padding: '10px 14px', textAlign: 'left' }}>
                  <h4 style={{ color: '#1976d2', margin: '0 0 8px 0' }}>Sample Itinerary</h4>
                  <ol style={{ margin: 0, paddingLeft: 18 }}>
                    {(() => {
                      switch (rec.destination) {
                        case 'Swiss Alps':
                          return [
                            { day: 1, activity: 'Arrive in Zurich, transfer to the Alps' },
                            { day: 2, activity: 'Hiking and cable car adventure' },
                            { day: 3, activity: 'Visit alpine villages and lakes' },
                            { day: 4, activity: 'Relax at a mountain spa' },
                            { day: 5, activity: 'Departure' }
                          ];
                        case 'Maldives':
                          return [
                            { day: 1, activity: 'Arrive and check in to your resort' },
                            { day: 2, activity: 'Snorkeling and beach relaxation' },
                            { day: 3, activity: 'Island hopping tour' },
                            { day: 4, activity: 'Spa day and sunset cruise' },
                            { day: 5, activity: 'Departure' }
                          ];
                        case 'Kyoto':
                          return [
                            { day: 1, activity: 'Arrive and visit Kiyomizu-dera Temple' },
                            { day: 2, activity: 'Explore Arashiyama Bamboo Grove' },
                            { day: 3, activity: 'Cultural tour of shrines and gardens' },
                            { day: 4, activity: 'Day trip to Nara' },
                            { day: 5, activity: 'Departure' }
                          ];
                        case 'Banff':
                          return [
                            { day: 1, activity: 'Arrive and explore Banff town' },
                            { day: 2, activity: 'Hiking in Banff National Park' },
                            { day: 3, activity: 'Lake Louise and canoeing' },
                            { day: 4, activity: 'Wildlife tour and hot springs' },
                            { day: 5, activity: 'Departure' }
                          ];
                        case 'Paris':
                          return [
                            { day: 1, activity: 'Arrive and visit the Eiffel Tower' },
                            { day: 2, activity: 'Louvre Museum and Seine river cruise' },
                            { day: 3, activity: 'Montmartre and Sacré-Cœur' },
                            { day: 4, activity: 'Shopping and café culture' },
                            { day: 5, activity: 'Departure' }
                          ];
                        case 'Aspen':
                          return [
                            { day: 1, activity: 'Arrive and explore Aspen town' },
                            { day: 2, activity: 'Skiing or snowboarding' },
                            { day: 3, activity: 'Snowshoeing and winter hiking' },
                            { day: 4, activity: 'Spa and relaxation' },
                            { day: 5, activity: 'Departure' }
                          ];
                        case 'Santorini':
                          return [
                            { day: 1, activity: 'Arrive and explore Fira' },
                            { day: 2, activity: 'Beach day and water sports' },
                            { day: 3, activity: 'Oia sunset and wine tasting' },
                            { day: 4, activity: 'Boat tour of volcanic islands' },
                            { day: 5, activity: 'Departure' }
                          ];
                        case 'Queenstown':
                          return [
                            { day: 1, activity: 'Arrive and explore Queenstown' },
                            { day: 2, activity: 'Adventure sports (bungee, jet boat)' },
                            { day: 3, activity: 'Day trip to Milford Sound' },
                            { day: 4, activity: 'Hiking and lake activities' },
                            { day: 5, activity: 'Departure' }
                          ];
                        case 'Rome':
                          return [
                            { day: 1, activity: 'Arrive and visit the Colosseum' },
                            { day: 2, activity: 'Vatican City and St. Peter’s Basilica' },
                            { day: 3, activity: 'Roman Forum and Pantheon' },
                            { day: 4, activity: 'Trastevere and local cuisine' },
                            { day: 5, activity: 'Departure' }
                          ];
                        case 'Bali':
                          return [
                            { day: 1, activity: 'Arrive and relax at your villa' },
                            { day: 2, activity: 'Beach day and surfing' },
                            { day: 3, activity: 'Ubud rice terraces and monkey forest' },
                            { day: 4, activity: 'Temple tour and spa' },
                            { day: 5, activity: 'Departure' }
                          ];
                        default:
                          return [
                            { day: 1, activity: 'Arrive and explore the city center' },
                            { day: 2, activity: 'Guided tour of local attractions' },
                            { day: 3, activity: 'Outdoor adventure or cultural experience' },
                            { day: 4, activity: 'Relax, shop, and enjoy local cuisine' },
                            { day: 5, activity: 'Departure' }
                          ];
                      }
                    })().map((item, i) => (
                      <li key={i}><b>Day {item.day}:</b> {item.activity}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '2rem', color: '#1976d2', fontWeight: 'bold' }}>
            Tell us your preferences to get even more personalized recommendations!
          </p>
        </>
      )}

      {/* Modal for details */}
      {selectedRec && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(25, 118, 210, 0.18)',
              padding: '2rem',
              maxWidth: 400,
              width: '90vw',
              position: 'relative',
              textAlign: 'center',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'transparent',
                border: 'none',
                fontSize: 22,
                color: '#1976d2',
                cursor: 'pointer',
              }}
              aria-label="Close details"
            >×</button>
            {(selectedRec.image || selectedRec.image_url) && (
              <img
                src={selectedRec.image || selectedRec.image_url}
                alt={selectedRec.destination}
                style={{ width: '100%', borderRadius: 8, marginBottom: 12 }}
              />
            )}
            <h2 style={{ color: '#1976d2', marginBottom: 8 }}>{selectedRec.destination}</h2>
            {selectedRec.country && <p style={{ margin: 0, color: '#666' }}>{selectedRec.country}</p>}
            {selectedRec.season && <p style={{ margin: 0 }}><b>Best season:</b> {selectedRec.season}</p>}
            {selectedRec.description && <p style={{ margin: '12px 0 0 0' }}>{selectedRec.description}</p>}
            {/* Add more details here if available */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;