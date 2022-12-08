from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4

db = SQLAlchemy()

class Debtors(db.Model):
    __tablename__ = "debtors"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=lambda: uuid4().hex)
    fullname = db.Column(db.String(100), unique=True)
    username = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100), nullable=False)

class Lenders(db.Model):
    __tablename__ = "lenders"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=lambda: uuid4().hex)
    fullname = db.Column(db.String(100), unique=True)
    username = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100), nullable=False)

