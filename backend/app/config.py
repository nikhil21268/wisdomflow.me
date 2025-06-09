import os
from datetime import timedelta


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    if not SQLALCHEMY_DATABASE_URI:
        raise RuntimeError("DATABASE_URL must point to a PostgreSQL database")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ACCESS_TOKEN_EXPIRES_MINUTES = 15
    REFRESH_TOKEN_EXPIRES_MINUTES = 60 * 24
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*")
    JWT_SECRET_KEY = SECRET_KEY
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(minutes=REFRESH_TOKEN_EXPIRES_MINUTES)
