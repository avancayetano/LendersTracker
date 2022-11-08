import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LogInForm from "../components/LogInForm";
import RegisterForm from "../components/RegisterForm";
import UserAuthContext from "../context/user-auth-context";
import Loader from "../components/Loader";

function LandingPage(props) {
  const navigate = useNavigate();
  const userAuthContext = useContext(UserAuthContext);
  const [formType, setFormType] = useState("login");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (userAuthContext.isAuthenticated) {
      navigate("/dashboard");
    } else {
      fetch("/api/get-current-user")
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "OK") {
            navigate("/dashboard");
          } else {
            setIsLoading(false);
          }
        });
    }
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      {formType === "login" ? (
        <LogInForm setFormType={setFormType} />
      ) : (
        <RegisterForm setFormType={setFormType} />
      )}
    </>
  );
}

export default LandingPage;
