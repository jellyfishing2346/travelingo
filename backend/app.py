from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/health')
def health_check():
    return jsonify(status='ok', message='Travelingo backend is running!')


# Mock recommendations endpoint
@app.route('/api/recommendations', methods=['GET', 'POST'])
def get_recommendations():
    recommendations = [
        {"destination": "Maldives", "season": "Winter", "description": "Best for winter escapes and beach lovers."},
        {"destination": "Swiss Alps", "season": "Winter", "description": "Perfect for skiing and winter sports."},
        {"destination": "Kyoto, Japan", "season": "Spring", "description": "Stunning cherry blossoms in spring."},
        {"destination": "Marrakech, Morocco", "season": "Autumn", "description": "Warm and vibrant in autumn."}
    ]
    if request.method == 'POST':
        data = request.get_json()
        season = data.get('season')
        filtered_recommendations = [rec for rec in recommendations if rec['season'].lower() == season.lower()]
        return jsonify(recommendations=filtered_recommendations)
    return jsonify(recommendations=recommendations)

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
