from models import db


class AppConfig:
    SECRET_KEY = "SADSKAkfedsmfkjsfggsdmvffksdk"

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///./db.sqlite"

    SESSION_TYPE = "sqlalchemy"
    SESSION_PERMANENT = True
    SESSION_USE_SIGNER = True

    SESSION_SQLALCHEMY = db
    SESSION_SQLALCHEMY_TABLE = "session"

    UPLOAD_FOLDER = "./files/"
    ALLOWED_EXTENSIONS = {"txt", "pdf", "png", "jpg", "jpeg", "gif"}
