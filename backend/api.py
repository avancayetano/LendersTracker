from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from config import AppConfig
from models import db, Debtor, Lender, Loan, LoanLender
from flask import send_from_directory
from os import path
from datetime import datetime

basedir = path.abspath(path.dirname(__file__))
uploads_path = path.join(basedir, 'files')


USER_TYPES = {"debtor": Debtor, "lender": Lender}

app = Flask(__name__)
app.config.from_object(AppConfig)

bcrypt = Bcrypt(app)

Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()

def user_info(user):
    return {
        "id": user.id,
        "fullname": user.fullname,
        "username": user.username
    }


@app.route("/api/get-current-user")
def get_current_user():
    user_id = session.get("user_id")

    if not user_id:
        return jsonify({"status": "error", "message": "Unauthorized."})
    
    user = db.session.scalar(db.select(Debtor).filter_by(id=user_id))

    if user:
        return jsonify({"status": "OK", "message": user_info(user)})

    user = db.session.scalar(db.select(Lender).filter_by(id=user_id))
    
    return jsonify({"status": "OK", "message": user_info(user)})
    

@app.route("/api/register-user", methods=["POST"])
def register_user():
    fullname = request.json["fullname"]
    username = request.json["username"]
    password = request.json["password"]
    user_type = request.json["userType"]

    user = db.session.scalar(db.select(USER_TYPES[user_type]).filter_by(username=username))

    if user is not None:
        return jsonify({"status": "error", "message": "User already exists."})

    user = db.session.scalar(db.select(USER_TYPES[user_type]).filter_by(fullname=fullname))

    if user is not None:
        return jsonify({"status": "error", "message": "User already exists."})
    
    hashed_password = bcrypt.generate_password_hash(password)
    new_user = USER_TYPES[user_type](fullname=fullname, username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    session["user_id"] = new_user.id

    return jsonify({"status": "OK", "message": user_info(new_user)})

@app.route("/api/login-user", methods=["POST"])
def login_user():
    username = request.json["username"]
    password = request.json["password"]
    user_type = request.json["userType"]

    user = db.session.scalar(db.select(USER_TYPES[user_type]).filter_by(username=username))

    if user is None:
        return jsonify({"status": "error", "message": "Unauthorized."})

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"status": "error", "message": "Unauthorized."})
    
    session["user_id"] = user.id

    return jsonify({"status": "OK", "message": user_info(user)})

@app.route("/api/add-loan-transaction", methods=["POST"])
def add_loan_transactions():
    # get request
    debtor = request.json["debtor"]
    principalAmount = request.json["principalAmount"]
    interest = request.json["interest"]
    period = request.json["period"]
    withdrawalsPerMonth = request.json["withdrawalsPerMonth"]
    dateOfTransfer = request.json["dateOfTransfer"]
    proofOfTransfer = request.json["proofOfTransfer"]
    lwt = request.json["lendorWhoTransferred"]
    suretyDebtor = request.json["suretyDebtor"]
    startPeriod = request.json["startPeriod"]
    contractSigned = request.json["contractSigned"]
    ackReceipts = request.json["ackReceipts"]
    otherDocs = request.json["otherDocs"]
    lenderContribPairs = request.json["lenderContribPairs"]
    
    # download available files
    user_id = session["user_id"]
    pot_filename = "pot_" + proofOfTransfer.filename + str(user_id) + datetime.now().strftime("_%d%m%Y_%H%M%S")
    od_filename = "pot_" + proofOfTransfer.filename + str(user_id) + datetime.now().strftime("_%d%m%Y_%H%M%S")
    proofOfTransfer.save(path.join(uploads_path, pot_filename))
    otherDocs.save(path.join(uploads_path, od_filename))

    # get debtor id
    debtor_id = db.session.scalar(db.select(Debtor).filter_by(username=debtor))

    # link debtor id to new loan, add loan
    new_loan = Loan(debtor_id=debtor_id, principal_amt=principalAmount, interest=interest,
        period=period, wpm=withdrawalsPerMonth, date_of_transfer=dateOfTransfer, proof_of_transfer=pot_filename, lwt=lwt, 
        surety_debtor=suretyDebtor, start_period=startPeriod, contract_signed=contractSigned,
        ack_receipt=ackReceipts, other_docs=od_filename)
    db.session.add(new_loan)
    db.session.commit()

    # link every lender to loan via LoanLender, add LoanLender
    for val in lenderContribPairs:
        lender_username = str(val["lender"])
        contrib = float(val["contribution"])

        lender = db.session.scalar(db.select(Lender).filter_by(username=lender_username))
        new_loanLender = LoanLender(loan_id=new_loan.id, lender_id=lender.id,contribution=contrib)
        db.session.add(new_loanLender)
        db.session.commit()

    # return error or OK 
    ...
    return jsonify({"status": "OK", "message": "To be implemented."})

@app.route("/api/get-debtors-list", methods=["GET"])
def get_debtors_list():
    # return list of debtors
    debtors_query = Debtor.query.all()
    
    debtors = []
    for val in debtors_query:
        debtor = dict()
        debtor["id"] = val.id
        debtor["username"] = val.username
        debtors.append(debtor)

    return jsonify(debtors)

@app.route("/api/get-lenders-list", methods=["GET"])
def get_lenders_list():
    # return list of debtors
    lenders_query = Lender.query.all()
    
    lenders = []
    for val in lenders_query:
        debtor = dict()
        debtor["id"] = val.id
        debtor["username"] = val.username
        lenders.append(debtor)
    return jsonify(lenders)

# 4 get user loan transaction
@app.route("/api/get-user-loan-transactions/", methods=["POST"])
def get_user_loan_transactions():

    user_id = session["user_id"]

    # get request
    loans = db.session.scalar(db.select(LoanLender, Loan).join(Loan.id))

    # return error or OK 
    ...
    return jsonify({"status": "OK", "message": "To be implemented."})

# # 5 get lender breakdown of loan transaction
# @app.route("/api/add-loan-transaction", methods=["POST"])
# def add_loan_transactions():
#     # get request
#     # return error or OK 
#     ...
#     return jsonify({"status": "OK", "message": "To be implemented."})

# # 6 get payments of loan transaction
# @app.route("/api/add-loan-transaction", methods=["POST"])
# def add_loan_transactions():
#     # get request
#     # return error or OK 
#     ...
#     return jsonify({"status": "OK", "message": "To be implemented."})

# # 7 del loan transaction
# @app.route("/api/add-loan-transaction", methods=["POST"])
# def add_loan_transactions():
#     # get request
#     # return error or OK 
#     ...
#     return jsonify({"status": "OK", "message": "To be implemented."})

# # 8 edit payment status
# @app.route("/api/add-loan-transaction", methods=["POST"])
# def add_loan_transactions():
#     # get request
#     # return error or OK 
#     ...
#     return jsonify({"status": "OK", "message": "To be implemented."})

# # 9 
# @app.route("/api/add-loan-transaction", methods=["POST"])
# def add_loan_transactions():
#     # get request
#     # return error or OK 
#     ...
#     return jsonify({"status": "OK", "message": "To be implemented."})

# # 10
# @app.route("/api/add-loan-transaction", methods=["POST"])
# def add_loan_transactions():
#     # get request
#     # return error or OK 
#     ...
#     return jsonify({"status": "OK", "message": "To be implemented."})
# # 11
# @app.route("/api/add-loan-transaction", methods=["POST"])
# def add_loan_transactions():
#     # get request
#     # return error or OK 
#     ...
#     return jsonify({"status": "OK", "message": "To be implemented."})

@app.route("/api/logout-user", methods=["POST"])
def logout_user():
    session.pop("user_id")
    session.clear()
    return jsonify({"status": "OK", "message": "Log out successful."})



if __name__ == "__main__":
    app.run(debug=True)