import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineHome } from "react-icons/md";

import UserAuthContext from "../context/user-auth-context";
import BasePage from "./BasePage";

function DashboardPage(props) {
  const navigate = useNavigate();
  const userAuthContext = useContext(UserAuthContext);

  return (
    <BasePage>
      <div className="w3-container w3-center">
        <h4 className="icon-cont icon-cont-center">
          <MdOutlineHome />
          <span className="margin-left text-overflow">Dashboard</span>
        </h4>
        <h4>Welcome, {userAuthContext.fullname}!</h4>
      </div>
    </BasePage>
  );
}

export default DashboardPage;
