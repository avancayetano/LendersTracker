import { useState, useRef, useContext } from "react";
import { MdOutlinePassword } from "react-icons/md";
import toast from "react-hot-toast";

import Form from "./ui/Form";
import Overlay from "./Overlay";
import UserAuthContext from "../context/user-auth-context";

function PasswordForm(props) {
  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();

  const userAuthContext = useContext(UserAuthContext);

  function changePassword(event) {
    event.preventDefault();
    const oldPassword = oldPasswordRef.current.value;
    const newPassword = newPasswordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    if (newPassword === confirmPassword) {
      toast.promise(
        fetch("/api/change-password", {
          method: "POST",
          body: JSON.stringify({
            username: userAuthContext.username,
            oldPassword: oldPassword,
            newPasswordRef: newPassword,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === "OK") {
              props.closeHandler();
            } else {
              alert("Error.");
            }
          }),
        {
          loading: "Saving...",
          success: <b>Password saved!</b>,
          error: <b>Could not change password.</b>,
        },
        {
          success: {
            duration: 5000,
          },
        }
      );
    } else {
      toast.error("Password does not match.");
    }
  }

  return (
    <>
      <Overlay closeHandler={props.closeHandler} />
      <Form
        title="Change password."
        icon={MdOutlinePassword}
        closeHandler={props.closeHandler}
        addtlClassNames="z-3"
      >
        <form
          autoComplete="off"
          className="w3-container w3-center"
          onSubmit={(event) => changePassword(event)}
        >
          <p>
            <label htmlFor="old-password">Old Password</label>
            <input
              className="w3-input w3-center"
              type="text"
              required
              id="old-password"
              ref={oldPasswordRef}
            />
          </p>
          <p>
            <label htmlFor="new-password">New Password</label>
            <input
              type="password"
              className="w3-input w3-center"
              required
              id="new-password"
              ref={newPasswordRef}
            />
          </p>
          <p>
            <label htmlFor="new-password">Confirm Password</label>
            <input
              type="password"
              className="w3-input w3-center"
              required
              id="confirm-password"
              ref={confirmPasswordRef}
            />
          </p>
          <div>
            <div className="w3-margin">
              <button className="w3-btn w3-teal">Save</button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}

export default PasswordForm;
