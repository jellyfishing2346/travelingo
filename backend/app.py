from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

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

# User model for authentication
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        # Explicitly use pbkdf2:sha256 to avoid scrypt issues
        self.password_hash = generate_password_hash(password, method='pbkdf2:sha256')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
CORS(app)

@app.route('/api/health')
def health_check():
    return jsonify(status='ok', message='Travelingo backend is running!')
import jwt
import datetime
from functools import wraps

SECRET_KEY = 'your_secret_key_here'  # Change this to a secure value in production

# JWT token required decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        if not token:
            return jsonify({'error': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
        except Exception as e:
            return jsonify({'error': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

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

# Registration endpoint (moved outside recommendations)
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400


    # Debug: print all users in the database
    print('DEBUG: Existing users:', [(u.username, u.email) for u in User.query.all()])
    # Check if user already exists
    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'error': 'Username or email already exists'}), 409

    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

# Login endpoint
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }, SECRET_KEY, algorithm="HS256")
        return jsonify({'token': token}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401
# Example protected endpoint
@app.route('/api/protected')
@token_required
def protected(current_user):
    return jsonify({'message': f'Hello, {current_user.username}! This is a protected endpoint.'})
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
