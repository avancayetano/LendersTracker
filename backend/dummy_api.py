from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from dummy_config import AppConfig
from dummy_models import db, Debtors, Lenders, Loans

USER_TYPES = {"debtor": Debtors, "lender": Lenders}

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
    
    user = db.session.scalar(db.select(User).filter_by(id=user_id))
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
    recipient = request.json["recipient"]
    suretyDebtor = request.json["suretyDebtor"]
    startPeriod = request.json["startPeriod"]
    contractSigned = request.json["contractSigned"]
    ackReceipts = request.json["ackReceipts"]
    otherDocs = request.json["otherDocs"]
    lenderContribPairs = request.json["lenderContribPairs"]

    # get debtor id
    debtor_id = db.session.scalar(db.select(Debtors).filter_by(username=debtor))

    # link debtor id to new loan, add loan

    # link every lender to loan via LoanLender, add LoanLender

    # return error or OK 
    ...
    return jsonify({"status": "OK", "message": "To be implemented."})

@app.route("/api/get-debtors-list", methods=["GET"])
def get_debtors_list():
    # return list of debtors
    debtors_query = Debtors.query.all()
    
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
    lenders_query = Lenders.query.all()
    
    lenders = []
    for val in lenders_query:
        debtor = dict()
        debtor["id"] = val.id
        debtor["username"] = val.username
        lenders.append(debtor)
    return jsonify(lenders)

# # 4 get user loan transaction
# @app.route("/api/add-loan-transaction", methods=["POST"])
# def add_loan_transactions():
#     # get request
#     # return error or OK 
#     ...
#     return jsonify({"status": "OK", "message": "To be implemented."})

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
