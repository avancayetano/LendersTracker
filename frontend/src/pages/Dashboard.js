import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import UserAuthContext from "../context/user-auth-context";

function DashboardPage(props) {
  const navigate = useNavigate();
  const userAuthContext = useContext(UserAuthContext);

  function logout(event) {
    event.preventDefault();
    fetch("/api/logout-user", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "OK") {
          navigate("/");
        } else {
          alert("Some error occurred.");
        }
      });
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Hello, {userAuthContext.fullname}.</h2>
      <button className="btn btn-primary" onClick={logout}>
        Log out
      </button>
    </div>
  );
}

export default DashboardPage;
