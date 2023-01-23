import { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlinePersonOutline } from "react-icons/md";
import Select from "react-select";
import toast from "react-hot-toast";

import Form from "./ui/Form";
import UserAuthContext from "../context/user-auth-context";

function RegisterForm(props) {
  const navigate = useNavigate();
  const userAuthContext = useContext(UserAuthContext);

  const fullnameInputRef = useRef();
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordRef = useRef();
  const userTypeInputRef = useRef();

  const userTypeOptions =
    userAuthContext.userType === "lender"
      ? [{ value: "debtor", label: "Debtor" }]
      : [
          { value: "lender", label: "Lender" },
          { value: "debtor", label: "Debtor" },
        ];

  function submitHandler(event) {
    event.preventDefault();

    const content = {
      fullname: fullnameInputRef.current.value,
      username: usernameInputRef.current.value,
      password: passwordInputRef.current.value,
      confirmPassword: confirmPasswordRef.current.value,
      userType: userTypeInputRef.current.getValue()[0].value,
    };

    toast.promise(
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
            alert(data.message ? data.message : "Unauthorized. Please log in.");
          }
        }),
      {
        loading: "Creating account...",
        success: <b>Account created!</b>,
        error: <b>Could not create account.</b>,
      },
      {
        success: {
          duration: 5000,
        },
      }
    );
  }

  return (
    <Form title="Create an account." icon={MdOutlinePersonOutline}>
      <form
        autoComplete="off"
        className="w3-container w3-center w3-margin"
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
        <div>
          <div className="w3-half w3-padding-small">
            <Select
              options={userTypeOptions}
              defaultValue={userTypeOptions[0]}
              ref={userTypeInputRef}
            />
          </div>
          <div className="w3-half w3-padding-small">
            <button className="w3-btn w3-black">Register</button>
          </div>
        </div>
      </form>
    </Form>
  );
}

export default RegisterForm;
