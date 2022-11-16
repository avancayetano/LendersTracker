import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineLogout } from "react-icons/md";

import AppMetaContext from "../context/app-meta-context";
import UserAuthContext from "../context/user-auth-context";

function LogOutButton(props) {
  const navigate = useNavigate();
  const userAuthContext = useContext(UserAuthContext);
  const appMetaContext = useContext(AppMetaContext);

  function logOutHandler(event) {
    event.preventDefault();
    fetch("/api/logout-user", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "OK") {
          userAuthContext.resetProfile();
          appMetaContext.setIsSideBarOpen(false);
          navigate("/");
        } else {
          alert("Some error occurred.");
        }
      });
  }

  return (
    <button
      onClick={logOutHandler}
      className={"w3-btn w3-black " + props.className}
    >
      <div className="icon-cont">
        <MdOutlineLogout />
        <span className="margin-left">Log Out</span>
      </div>
    </button>
  );
}

export default LogOutButton;
