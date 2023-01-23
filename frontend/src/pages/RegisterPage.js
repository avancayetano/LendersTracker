import { MdOutlinePersonOutline } from "react-icons/md";

import BasePage from "./BasePage";
import RegisterForm from "../components/RegisterForm";

function RegisterPage() {
  return (
    <BasePage>
      <h4 className="icon-cont icon-cont-center">
        <MdOutlinePersonOutline />
        <span className="margin-left text-overflow">Register</span>
      </h4>
      <RegisterForm />
    </BasePage>
  );
}

export default RegisterPage;
