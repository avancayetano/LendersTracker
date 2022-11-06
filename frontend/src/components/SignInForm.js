import { useRef } from "react";

import Form from "./ui/Form";
import classes from "./ui/Form.module.css";

function SignInForm(props) {
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    var content = {
      username: usernameInputRef.current.value,
      password: passwordInputRef.current.value,
    };

    fetch("/api/sign-in", {
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
    <Form title="Sign In">
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
          <button className="btn btn-primary">Sign In</button>
        </div>
      </form>
      <hr />
      <div>
        <span>Don't have an account yet? </span>
        <button
          className="btn btn-secondary"
          onClick={() => props.setFormType("sign-up")}
        >
          Sign Up Instead.
        </button>
      </div>
    </Form>
  );
}

export default SignInForm;
