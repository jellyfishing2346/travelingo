export async function postRecommendations(preferences: { season: string; interests: string[]; budget: string }) {
    const res = await fetch(`${API_BASE_URL}/api/recommendations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
}
const API_BASE_URL = 'http://127.0.0.1:5000';

export async function getHealth() {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
}


export async function postRecommendations(preferences: { season: string; interests?: string; budget?: string }) {
    const res = await fetch(`${API_BASE_URL}/api/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
    });
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
}

export async function getItinerary() {
    const res = await fetch(`${API_BASE_URL}/api/itinerary`);
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return res.json();
}