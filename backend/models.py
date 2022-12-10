from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from sqlalchemy.sql import func
import datetime

db = SQLAlchemy()

# guide for one-to-many relationships and on-delete cascade
# https://docs.sqlalchemy.org/en/14/orm/cascades.html#using-foreign-key-on-delete-cascade-with-orm-relationships


# Note: I removed the remarks field in the Payment model
# All columns should be non-empty


class Debtor(db.Model):
    __tablename__ = "debtor"
    id = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)
    fullname = db.Column(db.String(100), unique=True, nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

    # relationships
    loans = db.relationship("Loan", back_populates="debtor", cascade="all, delete")


class Lender(db.Model):
    __tablename__ = "lender"
    id = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)
    fullname = db.Column(db.String(100), unique=True, nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

    # relationships
    loan_lenders = db.relationship(
        "LoanLender", back_populates="lender", cascade="all, delete"
    )

    payment_lenders = db.relationship("PaymentLender", back_populates="lender")


class Admin(db.Model):
    __tablename__ = "admin"
    id = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)
    fullname = db.Column(db.String(100), unique=True, nullable=False)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)

    # relationships


class Loan(db.Model):
    __tablename__ = "loan"
    id = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)
    principal_amt = db.Column(db.Float, nullable=False)
    interest = db.Column(
        db.Float, nullable=False
    )  # should be in percent like 10% not 0.1
    period = db.Column(db.Integer, nullable=False)
    wpm = db.Column(db.Integer, nullable=False)
    date_of_transfer = db.Column(
        db.DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    amortization = db.Column(db.Float, nullable=False)
    lwt = db.Column(db.String(100), nullable=False)
    surety_debtor = db.Column(db.String(100), nullable=False)
    start_period = db.Column(
        db.DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    proof_of_transfer = db.Column(db.String(255), nullable=False)
    contract_signed = db.Column(db.String(255), server_default="FALSE", nullable=False)
    ack_receipt = db.Column(db.String(255), server_default="FALSE", nullable=False)
    other_docs = db.Column(db.String(255), nullable=False)

    # relationships
    debtor_id = db.Column(
        db.Integer, db.ForeignKey("debtor.id", ondelete="CASCADE"), nullable=False
    )
    debtor = db.relationship("Debtor", back_populates="loans")

    loan_lenders = db.relationship(
        "LoanLender", back_populates="loan", cascade="all, delete"
    )

    payments = db.relationship("Payment", back_populates="loan", cascade="all, delete")


class LoanLender(db.Model):
    __tablename__ = "loanlender"
    id = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)
    contribution = db.Column(db.Integer, nullable=False)

    # relationships
    loan_id = db.Column(
        db.Integer, db.ForeignKey("loan.id", ondelete="CASCADE"), nullable=False
    )
    loan = db.relationship("Loan", back_populates="loan_lenders")

    lender_id = db.Column(
        db.Integer, db.ForeignKey("lender.id", ondelete="CASCADE"), nullable=False
    )
    lender = db.relationship("Lender", back_populates="loan_lenders")


class Payment(db.Model):
    __tablename__ = "payment"
    id = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)
    period = db.Column(db.Integer, nullable=False)
    payment_date = db.Column(
        db.DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # relationships
    loan_id = db.Column(
        db.Integer, db.ForeignKey("loan.id", ondelete="CASCADE"), nullable=False
    )
    loan = db.relationship("Loan", back_populates="payments")

    payment_lenders = db.relationship("PaymentLender", back_populates="payment")


class PaymentLender(db.Model):
    __tablename__ = "paymentlender"
    id = db.Column(db.Integer, primary_key=True, unique=True, nullable=False)

    pay_index = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), nullable=False)

    # relationships
    payment_id = db.Column(
        db.Integer, db.ForeignKey("payment.id", ondelete="CASCADE"), nullable=False
    )
    payment = db.relationship("Payment", back_populates="payment_lenders")

    lender_id = db.Column(
        db.Integer, db.ForeignKey("lender.id", ondelete="CASCADE"), nullable=False
    )
    lender = db.relationship("Lender", back_populates="payment_lenders")
