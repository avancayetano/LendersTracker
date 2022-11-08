import { useContext } from "react";

import UserAuthContext from "../context/user-auth-context";

function LogOutButton() {
  const userAuthContext = useContext(UserAuthContext);

  function logOutHandler(event) {
    event.preventDefault();
    fetch("/api/logout-user", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "OK") {
          userAuthContext.resetProfile();
          navigate("/");
        } else {
          alert("Some error occurred.");
        }
      });
  }

  return (
    <div>
      <button onClick={logOutHandler}>Log Out</button>
    </div>
  );
}

export default LogOutButton;
