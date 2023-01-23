import { MdAccountCircle } from "react-icons/md";
import { useContext, useState } from "react";

import BasePage from "./BasePage";
import UserAuthContext from "../context/user-auth-context";
import format from "../format";
import PasswordForm from "../components/PasswordForm";

function ProfilePage() {
  const userAuthContext = useContext(UserAuthContext);
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);

  function closeHandler() {
    setIsPasswordFormOpen(false);
  }
  return (
    <BasePage>
      <div className="w3-center w3-margin">
        <div className="w3-container w3-section w3-center w3-blue w3-padding-large w3-round-xxlarge w3-animate-left">
          <div className="icon-cont">
            <MdAccountCircle className="profile-pic w3-text-white" />
            <span className="w3-padding-small">
              <div className="w3-xlarge w3-left-align">
                <b>{userAuthContext.fullname}</b>
              </div>
              <div className="w3-large w3-left-align">
                {userAuthContext.username}
              </div>
              <div className="w3-large w3-text-white w3-left-align">
                {format(userAuthContext.userType, true)}
              </div>
            </span>
          </div>
        </div>
        <div
          className="w3-btn w3-teal w3-section"
          onClick={() => setIsPasswordFormOpen(true)}
        >
          Change password
        </div>
      </div>
      {isPasswordFormOpen && <PasswordForm closeHandler={closeHandler} />}
    </BasePage>
  );
}

export default ProfilePage;
