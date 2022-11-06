import { useState } from "react";

import SignInForm from "../components/SignInForm";
import SignUpForm from "../components/SignUpForm";

function IndexPage(props) {
  const [formType, setFormType] = useState("sign-in");

  return (
    <div>
      {formType === "sign-in" ? (
        <SignInForm setFormType={setFormType} />
      ) : (
        <SignUpForm setFormType={setFormType} />
      )}
    </div>
  );
}

export default IndexPage;
