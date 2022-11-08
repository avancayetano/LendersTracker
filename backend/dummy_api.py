from flask import Flask, request, jsonify, session
from flask_bcrypt import Bcrypt
from flask_session import Session
from dummy_config import AppConfig
from dummy_models import db, User

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

    user = db.session.scalar(db.select(User).filter_by(username=username))

    if user is not None:
        return jsonify({"status": "error", "message": "User already exists."})

    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(fullname=fullname, username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    session["user_id"] = new_user.id

    return jsonify({"status": "OK", "message": user_info(new_user)})

@app.route("/api/login-user", methods=["POST"])
def login_user():
    username = request.json["username"]
    password = request.json["password"]

    user = db.session.scalar(db.select(User).filter_by(username=username))

    if user is None:
        return jsonify({"status": "error", "message": "Unauthorized."})

    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"status": "error", "message": "Unauthorized."})
    
    session["user_id"] = user.id

    return jsonify({"status": "OK", "message": user_info(user)})


@app.route("/api/logout-user", methods=["POST"])
def logout_user():
    session.pop("user_id")
    session.clear()
    return jsonify({"status": "OK", "message": "Log out successful."})


if __name__ == "__main__":
    app.run(debug=True)
