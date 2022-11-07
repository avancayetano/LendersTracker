import { useState } from "react";

import LogInForm from "../components/LogInForm";
import RegisterForm from "../components/RegisterForm";

function IndexPage(props) {
  const [formType, setFormType] = useState("login");

  return (
    <div>
      {formType === "login" ? (
        <LogInForm setFormType={setFormType} />
      ) : (
        <RegisterForm setFormType={setFormType} />
      )}
    </div>
  );
}

export default IndexPage;
