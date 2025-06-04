from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt

from ..models import db, User
from ..config import Config

auth_bp = Blueprint('auth', __name__)


def create_tokens(user_id):
    payload = {
        'sub': str(user_id),
        'exp': datetime.utcnow() + timedelta(minutes=Config.ACCESS_TOKEN_EXPIRES_MINUTES)
    }
    token = jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')

    refresh_payload = {
        'sub': str(user_id),
        'exp': datetime.utcnow() + timedelta(minutes=Config.REFRESH_TOKEN_EXPIRES_MINUTES)
    }
    refresh = jwt.encode(refresh_payload, Config.SECRET_KEY, algorithm='HS256')
    return token, refresh


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({'error': 'Invalid data'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email exists'}), 400
    user = User(email=data['email'], password_hash=generate_password_hash(data['password']))
    db.session.add(user)
    db.session.commit()
    token, refresh = create_tokens(user.id)
    return jsonify({'access_token': token, 'refresh_token': refresh})


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    if not user or not check_password_hash(user.password_hash, data.get('password','')):
        return jsonify({'error': 'Invalid credentials'}), 401
    token, refresh = create_tokens(user.id)
    return jsonify({'access_token': token, 'refresh_token': refresh})


@auth_bp.route('/refresh', methods=['POST'])
def refresh():
    data = request.get_json()
    try:
        payload = jwt.decode(data.get('refresh_token'), Config.SECRET_KEY, algorithms=['HS256'])
    except jwt.PyJWTError:
        return jsonify({'error': 'Invalid token'}), 401
    token, refresh = create_tokens(payload['sub'])
    return jsonify({'access_token': token, 'refresh_token': refresh})
