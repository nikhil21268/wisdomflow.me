from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .config import Config
from .db import db
from .auth.routes import auth_bp
from .principles.routes import principles_bp


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    JWTManager(app)
    CORS(app, origins=Config.CORS_ORIGINS)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(principles_bp, url_prefix="/api/principles")

    return app
