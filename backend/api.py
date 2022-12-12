from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from config import AppConfig
from models import db, Debtor, Lender, Loan, LoanLender, Payment, PaymentLender
from flask import send_from_directory
from os import path
from datetime import datetime
from dateutil.relativedelta import relativedelta
from werkzeug.utils import secure_filename
import json
import os


USER_TYPES = {"debtor": Debtor, "lender": Lender}
DATE_FORMAT = "%b %d, %Y"

app = Flask(__name__)
app.config.from_object(AppConfig)

bcrypt = Bcrypt(app)

Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()


def format_user_info(user, user_type):
    return {
        "id": user.id,
        "fullname": user.fullname,
        "username": user.username,
        "userType": user_type,
    }


@app.route("/api/get-current-user")
def get_current_user():
    user_info = session.get("user_info")
    if user_info:
        return jsonify({"status": "OK", "message": user_info})

    return jsonify({"status": "error", "message": "Unauthorized."})


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

    session["user_info"] = format_user_info(new_user, user_type)
    user_info = session.get("user_info")
    return jsonify({"status": "OK", "message": user_info})


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

    session["user_info"] = format_user_info(user, user_type)
    user_info = session.get("user_info")

    return jsonify({"status": "OK", "message": user_info})


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in app.config["ALLOWED_EXTENSIONS"]
    )


@app.route("/api/add-loan-transaction", methods=["POST"])
def add_loan_transactions():
    user_info = session.get("user_info")
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
            user_info.get("id"),
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

    # add new Payment row
    for per in range(period):
        for w in range(withdrawalsPerMonth):
            # add payment
            new_payment = Payment(
                period=per + 1,
                payment_date=startPeriod
                + relativedelta(
                    days=(withdrawalsPerMonth * per + w) * (30 // withdrawalsPerMonth)
                ),
                loan_id=new_loan.id,
            )
            db.session.add(new_payment)

            # add paymentlender
            for val in lenderContribPairs:
                lender_fullname = str(val["lender"])

                lender = db.session.scalar(
                    db.select(Lender).filter_by(fullname=lender_fullname)
                )
                new_paymentlender = PaymentLender(
                    status="", payment_id=new_payment.id, lender_id=lender.id
                )
                db.session.add(new_paymentlender)

    # link every lender to loan via LoanLender, add LoanLender
    for val in lenderContribPairs:
        lender_fullname = str(val["lender"])
        contrib = float(val["contribution"])

        lender = db.session.scalar(
            db.select(Lender).filter_by(fullname=lender_fullname)
        )

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
    user_info = session.get("user_info")
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
    user_info = session.get("user_info")
    # return list of debtors
    lenders_query = Lender.query.all()

    lenders = []
    for val in lenders_query:
        debtor = dict()
        debtor["id"] = val.id
        debtor["fullname"] = val.fullname
        lenders.append(debtor)
    return jsonify({"status": "OK", "message": lenders})


# 4 get lender loan transactions
@app.route(
    "/api/get-lender-loan-transactions/", methods=["GET"], defaults={"loan_id": None}
)
@app.route("/api/get-lender-loan-transactions/<int:loan_id>", methods=["GET"])
def get_lender_loan_transactions(loan_id):
    user_info = session.get("user_info")

    if loan_id:
        print("PARAMETER LOANID ACCEPTED:", loan_id)

    # get request
    loan_lenders = (
        db.session.query(LoanLender)
        .filter(LoanLender.lender_id == user_info.get("id"))
        .all()
    )
    data = []
    print("XDDDDDDDDDDDXXXXXXXXXXXXXXXXXXXXXXXXXXXx")
    print(loan_lenders)
    print("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
    for ind, loan_lender in enumerate(loan_lenders):
        print("Loan:", ind)
        loans = db.session.query(Loan).filter(Loan.id == loan_lender.loan_id).all()
        for loan in loans:
            if loan_id and (int(loan.id) != int(loan_id)):
                continue
            txn = {
                "loanId": loan.id,
                # "status": "Ongoing",
                "debtor": {
                    "username": loan.debtor.username,
                    "fullname": loan.debtor.fullname,
                },
                "principalAmount": loan.principal_amt,
                "interest": loan.interest,
                "period": loan.period,
                "withdrawalsPerMonth": loan.wpm,
                # "amortizationPerWithdrawal": 1333.33,
                # "amountAtEnd": 16000,
                # "completedAmortization": 5333.33,
                # "balanceAmortization": 10666.67,
                "dateOfTransfer": loan.date_of_transfer.strftime(DATE_FORMAT),
                "proofOfTransfer": loan.proof_of_transfer,
                "lwt": loan.lwt,
                "startPeriod": loan.start_period.strftime(DATE_FORMAT),
                # "endPeriod": "30 Mar 2023",
                "suretyDebtor": loan.surety_debtor,
                "contractSigned": loan.contract_signed,
                "ackReceipts": loan.ack_receipt,
                "otherDocs": loan.other_docs,
            }
            data.append(txn)
    print("FINAL DATA:\n", data)
    print("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")

    # return error or OK
    ...
    return jsonify({"status": "OK", "message": data})


# 4.75 get debtor loan transactions (for debtors view)
@app.route(
    "/api/get-debtor-loan-transactions/", methods=["GET"], defaults={"loan_id": None}
)
@app.route("/api/get-debtor-loan-transactions/<int:loan_id>", methods=["GET"])
def get_debtor_loan_transactions(loan_id):
    user_info = session.get("user_info")

    data = []
    loans = db.session.query(Loan).filter(Loan.debtor_id == user_info.get("id")).all()

    for loan in loans:
        if loan_id and (int(loan.id) != int(loan_id)):
            continue
        txn = {
            "loanId": loan.id,
            # "status": "Ongoing",
            "debtor": {
                "username": loan.debtor.username,
                "fullname": loan.debtor.fullname,
            },
            "principalAmount": loan.principal_amt,
            "interest": loan.interest,
            "period": loan.period,
            "withdrawalsPerMonth": loan.wpm,
            # "amortizationPerWithdrawal": 1333.33,
            # "amountAtEnd": 16000,
            # "completedAmortization": 5333.33,
            # "balanceAmortization": 10666.67,
            "dateOfTransfer": loan.date_of_transfer.strftime(DATE_FORMAT),
            "proofOfTransfer": loan.proof_of_transfer,
            "lwt": loan.lwt,
            "startPeriod": loan.start_period.strftime(DATE_FORMAT),
            # "endPeriod": "30 Mar 2023",
            "suretyDebtor": loan.surety_debtor,
            "contractSigned": loan.contract_signed,
            "ackReceipts": loan.ack_receipt,
            "otherDocs": loan.other_docs,
        }
        data.append(txn)

    return jsonify({"status": "OK", "message": data})


# 5 get lender breakdown of loan transaction
@app.route("/api/get-lender-breakdown/<int:loanId>", methods=["GET"])
def get_lender_breakdown(loanId):
    user_info = session.get("user_info")

    loan = db.session.query(Loan).filter(Loan.id == loanId).first()
    interest = loan.interest
    duration = loan.period
    wpm = loan.wpm

    ### FILTER TXN from ID ###
    loan_lenders = (
        db.session.query(LoanLender).filter(LoanLender.loan_id == loanId).all()
    )
    print("LOANLENDERS FOUND:", loan_lenders)
    data = []

    for loan_lender in loan_lenders:
        amortization = (loan_lender.contribution * (1 + (interest * duration))) / (
            duration * wpm
        )
        breakdown = {
            "lender": {
                "username": loan_lender.lender.username,
                "fullname": loan_lender.lender.fullname,
            },
            "contribution": loan_lender.contribution,
            "amortizationPerWithdrawal": amortization,
            "amountAtEnd": amortization * wpm * duration,
            # "completedAmortization": 2000, computed
            # "balanceAmortization": 4000, computed
        }
        data.append(breakdown)

    return jsonify({"status": "OK", "message": data})


# 6 get payments of loan transaction
@app.route("/api/get-payments/<int:loanId>", methods=["GET"])
def get_payments(loanId):
    user_info = session.get("user_info")

    ### FILTER Payments from ID ###
    payments = db.session.query(Payment).filter(Payment.loan_id == loanId).all()
    print("LOANLENDERS FOUND:", payments)
    data = []

    loan = db.session.scalar(db.select(Loan).filter_by(id=loanId))
    amortization = (loan.principal_amt * (1 + (loan.interest * loan.period))) / (
        loan.period * loan.wpm
    )

    for payment in payments:
        status = []

        paymentlenders = (
            db.session.query(PaymentLender)
            .filter(PaymentLender.payment_id == payment.id)
            .all()
        )

        # get status for each lender
        for paymentlender in paymentlenders:
            lender = db.session.scalar(
                db.select(Lender).filter_by(id=paymentlender.lender_id)
            )
            status.append(
                dict(
                    {
                        "lender": {
                            "username": lender.username,
                            "fullname": lender.fullname,
                        },
                        "received": False if paymentlender.status == "" else True,
                    }
                )
            )

        dat = {
            "period": payment.period,
            "paymentDate": payment.payment_date.strftime(DATE_FORMAT),
            "amortization": amortization,
            "status": status,
        }
        data.append(dat)

    # return error or OK

    return jsonify({"status": "OK", "message": data})


# 7 del loan transaction
@app.route("/api/delete-loan-transaction", methods=["POST"])
def delete_loan_transactions():
    user_info = session.get("user_info")

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
    user_info = session.get("user_info")

    loan_id = request.json["loanId"]
    paymentData = request.json["paymentData"]

    # files = request.files
    # inputs = json.loads(request.form["inputs"])

    print(loan_id)
    for row in paymentData:
        payment_date = row["paymentDate"]
        period = row["period"]
        status = row["status"]
        
        print("FINDING PAYMENT...", loan_id, period, payment_date)
        payment_id = db.session.query(Payment).filter_by(loan_id=loan_id, period=period, payment_date=datetime.strptime(payment_date,"%b %d, %Y")).first()
        payment_id = payment_id.id
        print(payment_id)
        

        print("PAYMENT_ID", payment_id)
        for stat in status:
            lender_id = db.session.query(Lender).filter_by(username=stat["lender"]["username"]).first()
            lender_id = lender_id.id

            paymentlender = db.session.query(PaymentLender).filter_by(lender_id=lender_id,payment_id=payment_id).first()
            received = stat["received"]
            paymentlender.status = "Received" if received else ""

    print("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++")

    return jsonify({"status": "OK", "message": "Successfully updated."})


# 9
@app.route("/api/get-cumulative-bal-breakdown", methods=["GET"])
def get_cumulative_bal_breakdown():
    user_info = session.get("user_info")
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
    user_info = session.get("user_info")
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
    user_info = session.get("user_info")
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
    session.pop("user_info")
    session.clear()
    return jsonify({"status": "OK", "message": "Log out successful."})


if __name__ == "__main__":
    app.run(debug=True)
