import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import UserAuthContext from "../context/user-auth-context";
import Loader from "./Loader";

function ProtectedRoute(props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const userAuthContext = useContext(UserAuthContext);

  useEffect(() => {
    setIsLoading(true);
    if (userAuthContext.isAuthenticated) {
      setIsLoading(false);
    } else {
      fetch("/api/get-current-user")
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "OK") {
            userAuthContext.setProfile(data.message);
            setIsLoading(false);
          } else {
            navigate("/");
            alert("Unauthorized.");
          }
        });
    }
  }, []);

  return (
    <>
      {isLoading && <Loader />} {props.children}
    </>
  );
}

export default ProtectedRoute;
