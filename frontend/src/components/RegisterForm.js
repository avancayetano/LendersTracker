import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import Form from "./ui/Form";
import classes from "./ui/Form.module.css";

function RegisterForm(props) {
  const navigate = useNavigate();

  const fullnameInputRef = useRef();
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    const content = {
      fullname: fullnameInputRef.current.value,
      username: usernameInputRef.current.value,
      password: passwordInputRef.current.value,
      confirmPassword: confirmPasswordRef.current.value,
    };

    fetch("/api/register-user", {
      method: "POST",
      body: JSON.stringify(content),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "OK") {
          navigate("/dashboard");
        } else {
          alert("Unauthorized.");
        }
      });
  }

  return (
    <Form title="Create an account.">
      <form className={classes.form} onSubmit={submitHandler}>
        <div className={classes.field}>
          <label htmlFor="fullname">Full Name</label>
          <input type="text" required id="fullname" ref={fullnameInputRef} />
        </div>
        <div className={classes.field}>
          <label htmlFor="username">Username</label>
          <input type="text" required id="username" ref={usernameInputRef} />
        </div>
        <div className={classes.field}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            required
            id="password"
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.field}>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            required
            id="confirm-password"
            ref={confirmPasswordRef}
          />
        </div>
        <div>
          <button className="btn btn-primary">Register</button>
        </div>
      </form>
      <hr />
      <div>
        <span>Already have an account? </span>
        <button
          className="btn btn-secondary"
          onClick={() => props.setFormType("login")}
        >
          Log in instead.
        </button>
      </div>
    </Form>
  );
}

export default RegisterForm;
