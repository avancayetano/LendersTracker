import { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineLogin } from "react-icons/md";
import Select from "react-select";

import Form from "./ui/Form";

function LogInForm(props) {
  const navigate = useNavigate();

  const usernameInputRef = useRef();
  const passwordInputRef = useRef();
  const userTypeInputRef = useRef();

  const userTypeOptions = [
    { value: "lender", label: "Lender" },
    { value: "debtor", label: "Debtor" },
  ];

  function submitHandler(event) {
    event.preventDefault();

    const content = {
      username: usernameInputRef.current.value,
      password: passwordInputRef.current.value,
      userType: userTypeInputRef.current.getValue()[0].value,
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
          alert(data.message ? data.message : "Unauthorized. Please log in.");
        }
      });
  }

  return (
    <Form title="Log in using your account." icon={MdOutlineLogin}>
      <form
        autoComplete="off"
        className="w3-container w3-center"
        onSubmit={submitHandler}
      >
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
            type="password"
            className="w3-input w3-center"
            required
            id="password"
            ref={passwordInputRef}
          />
        </p>

        <div>
          <div className="w3-half w3-padding-small">
            <Select
              options={userTypeOptions}
              defaultValue={userTypeOptions[0]}
              ref={userTypeInputRef}
            />
          </div>
          <div className="w3-half w3-padding-small">
            <button className="w3-btn w3-black">Log In</button>
          </div>
        </div>
      </form>
      <p className="w3-center">
        <span>Don't have an account yet? </span>
        <button
          className="w3-btn w3-border"
          onClick={() => props.setFormType("register")}
        >
          Register instead.
        </button>
      </p>
    </Form>
  );
}

export default LogInForm;
