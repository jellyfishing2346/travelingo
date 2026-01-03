from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///travelingo.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db = SQLAlchemy(app)

# Destination model for travel recommendations
class Destination(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    destination = db.Column(db.String(100), nullable=False)
    season = db.Column(db.String(20), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    interests = db.Column(db.String(255), nullable=False)  # Comma-separated string
    budget = db.Column(db.String(20), nullable=False)
CORS(app)

@app.route('/api/health')
def health_check():
    return jsonify(status='ok', message='Travelingo backend is running!')



# Database-driven recommendations endpoint
@app.route('/api/recommendations', methods=['GET', 'POST'])
def recommendations():
    if request.method == 'POST':
        data = request.get_json()
        season = data.get('season')
        interests = data.get('interests', [])
        budget = data.get('budget')

        query = Destination.query
        if season:
            query = query.filter(Destination.season.ilike(season))
        if interests:
            # Filter if any interest matches
            interest_filters = [Destination.interests.ilike(f'%{i}%') for i in interests]
            query = query.filter(db.or_(*interest_filters))
        if budget:
            query = query.filter(Destination.budget.ilike(budget))

        results = query.all()
        recs = [
            {
                "destination": r.destination,
                "season": r.season,
                "description": r.description
            } for r in results
        ]
        return jsonify(recommendations=recs)
    else:
        # GET: return all recommendations
        results = Destination.query.all()
        recs = [
            {
                "destination": r.destination,
                "season": r.season,
                "description": r.description
            } for r in results
        ]
        return jsonify(recommendations=recs)

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
