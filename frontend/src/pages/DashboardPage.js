import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import UserAuthContext from "../context/user-auth-context";
import LogOutButton from "../components/LogOutButton";

function DashboardPage(props) {
  const navigate = useNavigate();
  const userAuthContext = useContext(UserAuthContext);

  return (
    <div className="w3-container w3-center">
      <h4>Dashboard</h4>
      <h4>Hello, {userAuthContext.fullname}.</h4>
    </div>
  );
}

export default DashboardPage;
