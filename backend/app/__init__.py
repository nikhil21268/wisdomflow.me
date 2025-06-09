from pathlib import Path
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from .config import Config
from .db import db


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    JWTManager(app)
    CORS(app, origins=Config.CORS_ORIGINS)

    from .auth.routes import auth_bp
    from .principles.routes import principles_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(principles_bp, url_prefix="/api/principles")

    build_dir = Path(__file__).resolve().parents[2] / "frontend" / "build"

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path: str):
        full_path = build_dir / path
        if path and full_path.exists():
            return send_from_directory(build_dir, path)
        return send_from_directory(build_dir, 'index.html')

    return app
