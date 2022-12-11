import { useContext } from "react";
import { MdOutlineMenu } from "react-icons/md";

import AppMetaContext from "../context/app-meta-context";
import UserAuthContext from "../context/user-auth-context";

function NavBar() {
  const appMetaContext = useContext(AppMetaContext);
  const userAuthContext = useContext(UserAuthContext);

  return (
    <>
      <div className="w3-bar w3-border w3-white w3-center w3-display-container">
        <h3>
          <b>Lenders' Tracker</b>
        </h3>
        {userAuthContext.isAuthenticated && (
          <div
            className="w3-display-left icon-btn w3-bar-item w3-hover-light-grey"
            onClick={() => appMetaContext.setIsSideBarOpen(true)}
          >
            <h3 className="icon-cont">
              <MdOutlineMenu />
            </h3>
          </div>
        )}
      </div>
    </>
  );
}

export default NavBar;
