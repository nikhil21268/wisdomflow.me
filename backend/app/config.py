import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///db.sqlite3")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ACCESS_TOKEN_EXPIRES_MINUTES = 15
    REFRESH_TOKEN_EXPIRES_MINUTES = 60 * 24
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*")
