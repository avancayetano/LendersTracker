from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from config import AppConfig
from models import db, Debtor, Lender, Loan, LoanLender, Payment, PaymentLender
from flask import send_from_directory
from os import path
from datetime import datetime
from werkzeug.utils import secure_filename
import json
import os


USER_TYPES = {"debtor": Debtor, "lender": Lender}

app = Flask(__name__)
app.config.from_object(AppConfig)

bcrypt = Bcrypt(app)

Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()


def user_info(user):
    return {"id": user.id, "fullname": user.fullname, "username": user.username}


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

    user = db.session.scalar(
        db.select(USER_TYPES[user_type]).filter_by(username=username)
    )

    if user is not None:
        return jsonify({"status": "error", "message": "User already exists."})

    user = db.session.scalar(
        db.select(USER_TYPES[user_type]).filter_by(fullname=fullname)
    )

    if user is not None:
        return jsonify({"status": "error", "message": "User already exists."})

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = USER_TYPES[user_type](
        fullname=fullname, username=username, password=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()

    session["user_id"] = new_user.id

    return jsonify({"status": "OK", "message": user_info(new_user)})


@app.route("/api/login-user", methods=["POST"])
def login_user():
    username = request.json["username"]
    password = request.json["password"]
    user_type = request.json["userType"]

    user = db.session.scalar(
        db.select(USER_TYPES[user_type]).filter_by(username=username)
    )

    if user is None:
        return jsonify({"status": "error", "message": "Unauthorized."})

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"status": "error", "message": "Unauthorized."})

    session["user_id"] = user.id

    return jsonify({"status": "OK", "message": user_info(user)})


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in app.config["ALLOWED_EXTENSIONS"]
    )


@app.route("/api/add-loan-transaction", methods=["POST"])
def add_loan_transactions():
    user_id = session["user_id"]
    # get request

    files = request.files
    inputs = json.loads(request.form["inputs"])

    print("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    print(files)
    print("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
    print(inputs)
    print("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

    # inputs
    debtor = inputs.get("debtor", "")
    principalAmount = float(inputs.get("principalAmount", 0))
    interest = float(inputs.get("interest", 0))
    period = int(inputs.get("period", 0))
    withdrawalsPerMonth = int(inputs.get("withdrawalsPerMonth", 0))
    dateOfTransfer = datetime.strptime(inputs["dateOfTransfer"], "%Y-%m-%d")
    lwt = inputs.get("lwt", "")
    suretyDebtor = inputs.get("suretyDebtor", "")
    startPeriod = datetime.strptime(inputs["startPeriod"], "%Y-%m-%d")
    lenderContribPairs = inputs.get("lenderContribPairs", [])

    filenames = {}
    for file in files:
        filename = "{}-{}-{}-{}".format(
            user_id,
            file,
            datetime.now().strftime("%d%m%Y_%H%M%S"),
            files[file].filename,
        )
        if files[file] and allowed_file(filename):
            filename = secure_filename(filename)
            filenames[file] = filename
            files[file].save(os.path.join(app.config["UPLOAD_FOLDER"], filename))

    # get debtor id
    debtor_id = db.session.scalar(db.select(Debtor).filter_by(fullname=debtor)).id

    # amortization not included, computed in query

    # link debtor id to new loan, add loan
    new_loan = Loan(
        debtor_id=debtor_id,
        principal_amt=principalAmount,
        interest=interest,
        period=period,
        wpm=withdrawalsPerMonth,
        date_of_transfer=dateOfTransfer,
        proof_of_transfer=filenames.get("proofOfTransfer", ""),
        lwt=lwt,
        surety_debtor=suretyDebtor,
        start_period=startPeriod,
        contract_signed=filenames.get("contractSigned", ""),
        ack_receipt=filenames.get("ackReceipts", ""),
        other_docs=filenames.get("otherDocs", ""),
    )
    db.session.add(new_loan)
    db.session.commit()

    # add new Paymentn row
    new_payment = Payment(period=period, loan_id=new_loan.id)
    db.session.add(new_payment)

    # link every lender to loan via LoanLender, add LoanLender
    for val in lenderContribPairs:
        lender_fullname = str(val["lender"])
        contrib = float(val["contribution"])

        lender = db.session.scalar(
            db.select(Lender).filter_by(fullname=lender_fullname)
        )

        new_paymentlender = PaymentLender(status="-", payment_id=new_payment.id, lender_id=lender.id)
        db.session.add(new_paymentlender)

        new_loanLender = LoanLender(
            loan_id=new_loan.id, lender_id=lender.id, contribution=contrib
        )
        db.session.add(new_loanLender)
        db.session.commit()

    # add Payment row for each computed paying time


    # return error or OK
    ...
    return jsonify({"status": "OK", "message": "Successfully added loan transaction."})


@app.route("/api/get-debtors-list", methods=["GET"])
def get_debtors_list():
    user_id = session["user_id"]
    # return list of debtors
    debtors_query = Debtor.query.all()

    debtors = []
    for val in debtors_query:
        debtor = dict()
        debtor["id"] = val.id
        debtor["fullname"] = val.fullname
        debtors.append(debtor)

    return jsonify({"status": "OK", "message": debtors})


@app.route("/api/get-lenders-list", methods=["GET"])
def get_lenders_list():
    user_id = session["user_id"]
    # return list of debtors
    lenders_query = Lender.query.all()

    lenders = []
    for val in lenders_query:
        debtor = dict()
        debtor["id"] = val.id
        debtor["fullname"] = val.fullname
        lenders.append(debtor)
    return jsonify({"status": "OK", "message": lenders})


# 4 get user loan transactions
@app.route("/api/get-user-loan-transactions", methods=["GET"])
def get_user_loan_transactions():
    print("ENDPOINT 4 CALLED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    user_id = session["user_id"]
    
    # get request
    loan_lenders = db.session.query(LoanLender).filter(LoanLender.lender_id==user_id).all()
    data = []
    
    for ind,loan_lender in enumerate(loan_lenders):
        print("Loan:",ind)
        loans = db.session.query(Loan).filter(Loan.id == loan_lender.loan_id).all()
        for loan in loans:
            txn = {
                "loanId": loan.id,
                # "status": "Ongoing",
                "debtor": loan.debtor.username,
                "principalAmount": loan.principal_amt,
                "interest": loan.interest,
                "period": loan.period,
                "withdrawalsPerMonth": loan.wpm,
                # "amortizationPerWithdrawal": 1333.33,
                # "amountAtEnd": 16000,
                # "completedAmortization": 5333.33,
                # "balanceAmortization": 10666.67,
                "dateOfTransfer": loan.date_of_transfer,
                "proofOfTransfer": loan.proof_of_transfer,
                "lwt": loan.lwt,
                "startPeriod": loan.start_period,
                # "endPeriod": "30 Mar 2023",
                "suretyDebtor": loan.surety_debtor,
                "contractSigned": loan.contract_signed,
                "ackReceipts": loan.ack_receipt,
                "otherDocs": loan.other_docs,
            }
            data.append(txn)
    

    # return error or OK
    ...
    return jsonify({"status": "OK", "message": data})


# 4.5 get a user loan transaction. PLEASE DO THIS
# get a specific loan transaction info using its ID
@app.route("/api/get-loan-transaction/<int:loanId>", methods=["GET"])
def get_loan_transaction(loanId):
    print("!!!!!!!4.5 ENDPOINT!!!!!!!")
    # get user id
    user_id = session["user_id"]

    ### FILTER TXN from ID ###
    loan_lenders = db.session.query(LoanLender).filter(LoanLender.lender_id==user_id).all()
    print("LOANLENDERS FOUND:", loan_lenders)
    data = []

    for ind,loan_lender in enumerate(loan_lenders):
        print("Loan:",ind)
        loans = db.session.query(Loan).filter(Loan.id == loan_lender.loan_id).all()
        for loan in loans:
            if loanId and (int(loan.id) != int(loanId)):
                continue
            txn = {
                "loanId": loan.id,
                # "status": "Ongoing",
                "debtor": loan.debtor.username,
                "principalAmount": loan.principal_amt,
                "interest": loan.interest,
                "period": loan.period,
                "withdrawalsPerMonth": loan.wpm,
                # "amortizationPerWithdrawal": 1333.33,
                # "amountAtEnd": 16000,
                # "completedAmortization": 5333.33,
                # "balanceAmortization": 10666.67,
                "dateOfTransfer": loan.date_of_transfer,
                "proofOfTransfer": loan.proof_of_transfer,
                "lwt": loan.lwt,
                "startPeriod": loan.start_period,
                # "endPeriod": "30 Mar 2023",
                "suretyDebtor": loan.surety_debtor,
                "contractSigned": loan.contract_signed,
                "ackReceipts": loan.ack_receipt,
                "otherDocs": loan.other_docs,
            }
            data.append(txn)
    
    print("FINAL DATA RETURNED:", data)
    # return error or OK
    ...
    return jsonify({"status": "OK", "message": data})



# 5 get lender breakdown of loan transaction
@app.route("/api/get-lender-breakdown/<int:loanId>", methods=["GET"])
def get_lender_breakdown(loanId):

    loan = db.session.query(Loan).filter(Loan.id == loanId).first()
    interest = loan.interest
    duration = loan.duration
    wpm = loan.wpm

    ### FILTER TXN from ID ###
    loan_lenders = db.session.query(LoanLender).filter(LoanLender.loan_id==loanId).all()
    print("LOANLENDERS FOUND:", loan_lenders)
    data = []

    for loan_lender in loan_lenders:
        amortization = (loan_lender.contribution*(1+(interest*duration)))/(duration*wpm)
        breakdown = {
            "lender": loan_lender.id,
            "contribution": loan_lender.contribution,
            "amortizationPerWithdrawal": amortization,
            "amountAtEnd": amortization*wpm*duration,
            # "completedAmortization": 2000, computed
            # "balanceAmortization": 4000, computed
        }
        data.append(breakdown)

    return jsonify({"status": "OK", "message": data})


# 6 get payments of loan transaction
@app.route("/api/get-payments/<int:loanId>", methods=["GET"])
def get_payments(loanId):
    user_id = session["user_id"]
    
    ### FILTER Payments from ID ###
    payments = db.session.query(Payment).filter(Payment.loan_id==loanId).all()
    print("LOANLENDERS FOUND:", payments)
    data = []

    loan = db.session.scalar(db.session.select(Loan).filter_by(id==loanId))
    amortization = (loan.principal_amt*(1+(loan.interest*loan.duration)))/(loan.duration*loan.wpm)

    for payment in payments:
        status = []
        
        dat = {
            "period": payment.period,
            "paymentDate": payment.payment_date,
            "amortization": amortization,
            "status": []
        }
        payment.

    # return error or OK
    dummy_payments = [
        {
            "period": 1,
            "paymentDate": "15 Oct 2022",
            "amortization": 1000,
            "status": [
                {"lender": "Lender 1", "received": True},
                {"lender": "Lender 2", "received": True},
            ],
        },
        {
            "period": 1,
            "paymentDate": "30 Oct 2022",
            "amortization": 1000,
            "status": [
                {"lender": "Lender 1", "received": True},
                {"lender": "Lender 2", "received": True},
            ],
        },
        {
            "period": 2,
            "paymentDate": "15 Oct 2022",
            "amortization": 1000,
            "status": [
                {"lender": "Lender 1", "received": True},
                {"lender": "Lender 2", "received": False},
            ],
        },
        {
            "period": 2,
            "paymentDate": "15 Oct 2022",
            "amortization": 1000,
            "status": [
                {"lender": "Lender 1", "received": False},
                {"lender": "Lender 2", "received": False},
            ],
        },
        {
            "period": 3,
            "paymentDate": "15 Oct 2022",
            "amortization": 1000,
            "status": [
                {"lender": "Lender 1", "received": False},
                {"lender": "Lender 2", "received": False},
            ],
        },
        {
            "period": 3,
            "paymentDate": "15 Oct 2022",
            "amortization": 1000,
            "status": [
                {"lender": "Lender 1", "received": False},
                {"lender": "Lender 2", "received": False},
            ],
        },
    ]

    return jsonify({"status": "OK", "message": dummy_payments})


# 7 del loan transaction
@app.route("/api/delete-loan-transaction", methods=["POST"])
def delete_loan_transactions():
    user_id = session["user_id"]

    # mas safe if nasa payload yung loanId kaysa sa URL mismo
    loanId = request.json.get("loanId", None)
    
    loan = db.session.get(Loan, loanId)
    if not loan:
        return jsonify({"status": "OK", "message": "No loan id exists."})

    db.session.delete(loan)
    db.session.commit()

    return jsonify({"status": "OK", "message": "Successfully deleted."})


# 8 edit payment status
@app.route("/api/edit-payment-status", methods=["POST"])
def edit_payment_status():
    user_id = session["user_id"]

    ...
    loanId = request.json.get("loanId", None)
    payment_data = request.json.get("paymentData", [])

    print("ooooooooooooooooooooooooooooooooooooooooooooooo")
    print(payment_data)
    print("ooooooooooooooooooooooooooooooooooooooooooooooo")

    return jsonify({"status": "OK", "message": "Successfully updated."})


# 9
@app.route("/api/get-cumulative-bal-breakdown", methods=["GET"])
def get_cumulative_bal_breakdown():
    user_id = session["user_id"]
    ...

    dummy_data = {
        "cumulativeBalAmortization": 700000,
        "cumulativeCompAmortization": 105605050,
        "breakdown": [
            {"debtor": "Debtor 1", "cumulativeBal": 40000},
            {"debtor": "Debtor 2", "cumulativeBal": 40000},
        ],
    }

    return jsonify({"status": "OK", "message": dummy_data})


# 10
@app.route("/api/get-personal-transactions-table", methods=["GET"])
def get_personal_transactions_table():
    user_id = session["user_id"]
    # get request
    # return error or OK
    ...

    dummy_data = [
        {
            "loanId": 1,
            "debtor": "Debtor 1",
            "amortizationPerWithdrawal": 5000,
            "balanceAmortization": 10000,
            "paymentDate": "18-11-2022",
        },
        {
            "loanId": 2,
            "debtor": "Debtor 2",
            "amortizationPerWithdrawal": 25000,
            "balanceAmortization": 110000,
            "paymentDate": "18-11-2022",
        },
        {
            "loanId": 3,
            "debtor": "Debtor 3",
            "amortizationPerWithdrawal": 15000,
            "balanceAmortization": 120000,
            "paymentDate": "18-11-2022",
        },
        {
            "loanId": 4,
            "debtor": "Debtor 4",
            "amortizationPerWithdrawal": 35000,
            "balanceAmortization": 130000,
            "paymentDate": "18-11-2022",
        },
    ]
    return jsonify({"status": "OK", "message": dummy_data})


# 11
@app.route("/api/get-others-transactions-table", methods=["GET"])
def get_others_transactions_table():
    user_id = session["user_id"]
    dummy_data = [
        {
            "loanId": 1,
            "lender": "Lender 1",
            "debtor": "Debtor 1",
            "amortizationPerWithdrawal": 5000,
            "balanceAmortization": 10000,
            "paymentDate": "18-11-2022",
        },
        {
            "loanId": 2,
            "lender": "Lender 1",
            "debtor": "Debtor 2",
            "amortizationPerWithdrawal": 25000,
            "balanceAmortization": 110000,
            "paymentDate": "18-11-2022",
        },
        {
            "loanId": 3,
            "lender": "Lender 3",
            "debtor": "Debtor 3",
            "amortizationPerWithdrawal": 15000,
            "balanceAmortization": 120000,
            "paymentDate": "18-11-2022",
        },
        {
            "loanId": 4,
            "lender": "Lender 2",
            "debtor": "Debtor 4",
            "amortizationPerWithdrawal": 35000,
            "balanceAmortization": 130000,
            "paymentDate": "18-11-2022",
        },
    ]
    return jsonify({"status": "OK", "message": dummy_data})


@app.route("/api/logout-user", methods=["POST"])
def logout_user():
    session.pop("user_id")
    session.clear()
    return jsonify({"status": "OK", "message": "Log out successful."})


if __name__ == "__main__":
    app.run(debug=True)
