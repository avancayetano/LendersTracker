import { useContext } from "react";
import { Link } from "react-router-dom";

import AppMetaContext from "../context/app-meta-context";
import UserAuthContext from "../context/user-auth-context";
import LogOutButton from "./LogOutButton";

function SideBar() {
  const userAuthContext = useContext(UserAuthContext);
  const appMetaContext = useContext(AppMetaContext);

  return (
    <>
      <div
        className={
          "w3-sidebar w3-bar-block w3-card w3-animate-left " +
          (appMetaContext.isSideBarOpen ? "w3-show" : "w3-hide")
        }
      >
        <div className="w3-container w3-bar-item w3-border-bottom">
          <h4>Hello, {userAuthContext.fullname}.</h4>
        </div>
        <Link to="#" className="w3-bar-item w3-button">
          Link 1
        </Link>
        <Link to="#" className="w3-bar-item w3-button">
          Link 2
        </Link>
        <Link to="#" className="w3-bar-item w3-button">
          Link 3
        </Link>
        <LogOutButton className="w3-bar-item">Log Out</LogOutButton>
      </div>
    </>
  );
}
export default SideBar;
