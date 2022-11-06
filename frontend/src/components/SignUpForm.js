import { useRef } from "react";

import Form from "./ui/Form";
import classes from "./ui/Form.module.css";

function SignUpForm(props) {
  const fullnameInputRef = useRef();
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    var content = {
      fullname: fullnameInputRef.current.value,
      username: usernameInputRef.current.value,
      password: passwordInputRef.current.value,
      confirmPassword: confirmPasswordRef.current.value,
    };

    fetch("/api/sign-up", {
      method: "POST",
      body: JSON.stringify(content),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }

  return (
    <Form title="Sign Up">
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
          <button className="btn btn-primary">Sign Up</button>
        </div>
      </form>
      <hr />
      <div>
        <span>Already have an account? </span>
        <button
          className="btn btn-secondary"
          onClick={() => props.setFormType("sign-in")}
        >
          Sign In Instead.
        </button>
      </div>
    </Form>
  );
}

export default SignUpForm;
