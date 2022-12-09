from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from sqlalchemy.sql import func
import datetime

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

class Admin(db.Model):
    __tablename__ = "admin"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=lambda: uuid4().hex)
    fullname = db.Column(db.String(100), unique=True)
    username = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100), nullable=False)

class Loans(db.Model):
    __tablename__ = "loans"
    # FK debtor_id
    id = db.Column(db.String(32), primary_key=True, unique=True, default=lambda: uuid4().hex)
    principal_amt = db.Column(db.Float, nullable=False)
    interest  = db.Column(db.Float, nullable=False)
    period = db.Column(db.Integer, nullable=True)
    wpm = db.Column(db.Integer, nullable=True)
    date_of_transfer = db.Column(db.DateTime(timezone=True), server_default=func.now())
    amortization = db.Column(db.Float, nullable=False)
    # proof_of_transfer image/filesht
    recipient = db.Column(db.String(25), nullable=False)
    surety_debtor = db.Column(db.String(25), nullable=False)
    start_period = db.Column(db.DateTime(timezone=True), server_default=func.now())
    contract_signed = db.Column(db.Boolean, server_default="FALSE", nullable=False)
    ack_receipt = db.Column(db.Boolean, server_default="FALSE", nullable=False)
    # other_docs JSON



class LoanLenders(db.Model):
    __tablename__ = "loanlenders"
    ...
    id = db.Column(db.String(32), primary_key=True, unique=True, default=lambda: uuid4().hex)
    # FK loan_id int
    # FK lender_id int
    contribution = db.Column(db.Integer, nullable=True)

class Payments(db.Model):
    __tablename__ = "payments"
    ...
    id = db.Column(db.String(32), primary_key=True, unique=True, default=lambda: uuid4().hex)
    # FK loan_id
    period = db.Column(db.Integer, nullable=True)
    payment_date = db.Column(db.DateTime(timezone=True), server_default=func.now())
    status = db.Column(db.String(15), nullable=False)
    remarks = db.Column(db.String(255))

class PaymentLenders(db.Model):
    __tablename__ = "paymentlenders"
    id = db.Column(db.String(32), primary_key=True, unique=True, default=lambda: uuid4().hex)
    # FK payment_id
    # FK lender_id
    pay_index = db.Column(db.Integer, nullable=True)
    status = db.Column(db.String(20), nullable=False)
    
    
    
    