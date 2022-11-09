import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Form from "./ui/Form";

function LogInForm(props) {
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
    <Form title="Log in using your account.">
      <form className="w3-container w3-center" onSubmit={submitHandler}>
        <p>
          <label htmlFor="username">Username</label>
          <input
            className="w3-input"
            type="text"
            required
            id="username"
            ref={usernameInputRef}
          />
        </p>
        <p>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="w3-input"
            required
            id="password"
            ref={passwordInputRef}
          />
        </p>
        <p>
          <button className="w3-btn w3-black">Log In</button>
        </p>
      </form>
      <p className="w3-center">
        <span>Don't have an account yet? </span>
        <button
          className="w3-btn w3-blaack w3-border"
          onClick={() => props.setFormType("register")}
        >
          Register instead.
        </button>
      </p>
    </Form>
  );
}

export default LogInForm;
