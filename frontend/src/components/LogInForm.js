import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Form from "./ui/Form";
import classes from "./ui/Form.module.css";
import UserAuthContext from "../context/user-auth-context";

function LogInForm(props) {
  const userAuthContext = useContext(UserAuthContext);

  const navigate = useNavigate();

  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    const content = {
      username: usernameInputRef.current.value,
      password: passwordInputRef.current.value,
    };

    fetch("/api/login-user", {
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
    <Form title="Log In">
      <form className={classes.form} onSubmit={submitHandler}>
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
        <div>
          <button className="btn btn-primary">Log In</button>
        </div>
      </form>
      <hr />
      <div>
        <span>Don't have an account yet? </span>
        <button
          className="btn btn-secondary"
          onClick={() => props.setFormType("register")}
        >
          Register instead.
        </button>
      </div>
    </Form>
  );
}

export default LogInForm;
