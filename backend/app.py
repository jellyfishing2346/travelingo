from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/health')
def health_check():
    return jsonify(status='ok', message='Travelingo backend is running!')



# Enhanced recommendations data with interests and budget
recommendations_data = [
    {
        "destination": "Maldives",
        "season": "Winter",
        "description": "Best for winter escapes and beach lovers.",
        "interests": ["beach", "relaxation"],
        "budget": "high"
    },
    {
        "destination": "Swiss Alps",
        "season": "Winter",
        "description": "Perfect for skiing and winter sports.",
        "interests": ["adventure", "skiing"],
        "budget": "medium"
    },
    {
        "destination": "Kyoto, Japan",
        "season": "Spring",
        "description": "Stunning cherry blossoms in spring.",
        "interests": ["culture", "nature"],
        "budget": "medium"
    },
    {
        "destination": "Marrakech, Morocco",
        "season": "Autumn",
        "description": "Warm and vibrant in autumn.",
        "interests": ["culture", "adventure"],
        "budget": "low"
    }
]

@app.route('/api/recommendations', methods=['GET', 'POST'])
def recommendations():
    if request.method == 'POST':
        data = request.get_json()
        season = data.get('season')
        interests = data.get('interests', [])
        budget = data.get('budget')

        filtered = recommendations_data

        if season:
            filtered = [r for r in filtered if r['season'].lower() == season.lower()]
        if interests:
            filtered = [r for r in filtered if any(i in r['interests'] for i in interests)]
        if budget:
            filtered = [r for r in filtered if r['budget'] == budget]

        return jsonify(recommendations=filtered)
    else:
        return jsonify(recommendations=recommendations_data)

# Mock itinerary endpoint
@app.route('/api/itinerary')
def get_itinerary():
    return jsonify(
        itinerary=[
            {"day": 1, "activity": "Arrive and explore the city center"},
            {"day": 2, "activity": "Guided tour of local attractions"},
            {"day": 3, "activity": "Outdoor adventure or cultural experience"},
            {"day": 4, "activity": "Relax, shop, and enjoy local cuisine"},
            {"day": 5, "activity": "Departure"}
        ]
    )

if __name__ == '__main__':
    app.run(debug=True)
