import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { UserAuthContextProvider } from "../context/user-auth-context";
import UserAuthContext from "../context/user-auth-context";

function ProtectedRoute(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const userAuthContext = useContext(UserAuthContext);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/get-current-user")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "OK") {
          userAuthContext.setProfile(data.message);
          setIsLoading(false);
        } else {
          alert("Unauthorized.");
          navigate("/");
        }
      });
  }, []);

  return (
    <UserAuthContextProvider>
      {isLoading ? <h1>Loading</h1> : props.children}
    </UserAuthContextProvider>
  );
}

export default ProtectedRoute;
