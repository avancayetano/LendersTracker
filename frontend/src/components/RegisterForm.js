import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlinePersonOutline } from "react-icons/md";

import Form from "./ui/Form";

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
    <Form title="Create an account." icon={MdOutlinePersonOutline}>
      <form
        autoComplete="off"
        className="w3-container w3-center"
        onSubmit={submitHandler}
      >
        <p>
          <label htmlFor="fullname">Full Name</label>
          <input
            className="w3-input w3-center"
            type="text"
            required
            id="fullname"
            ref={fullnameInputRef}
          />
        </p>
        <p>
          <label htmlFor="username">Username</label>
          <input
            className="w3-input w3-center"
            type="text"
            required
            id="username"
            ref={usernameInputRef}
          />
        </p>
        <p>
          <label htmlFor="password">Password</label>
          <input
            className="w3-input w3-center"
            type="password"
            required
            id="password"
            ref={passwordInputRef}
          />
        </p>
        <p>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            className="w3-input w3-center"
            type="password"
            required
            id="confirm-password"
            ref={confirmPasswordRef}
          />
        </p>
        <p>
          <button className="w3-btn w3-black">Register</button>
        </p>
      </form>
      <p className="w3-center">
        <span>Already have an account? </span>
        <button
          className="w3-btn w3-border"
          onClick={() => props.setFormType("login")}
        >
          Log in instead.
        </button>
      </p>
    </Form>
  );
}

export default RegisterForm;
