from test_models import db

class ApplicationConfig:
    SECRET_KEY = "SADSKAkfedsmfkjsfggsdmvffksdk"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = r"sqlite:///./db.sqlite"

    SESSION_TYPE = "sqlalchemy"
    SESSION_PERMANENT = True
    SESSION_USE_SIGNER = True

    SESSION_SQLALCHEMY = db
    SESSION_SQLALCHEMY_TABLE = "sessions"