import { useContext } from "react";

import AppMetaContext from "../context/app-meta-context";
import SideBar from "../components/SideBar";
import AddLoanForm from "../components/AddLoanForm";
import NavBar from "../components/NavBar";
import Overlay from "../components/Overlay";

function BasePage(props) {
  const appMetaContext = useContext(AppMetaContext);

  return (
    <>
      <div className="z-0">
        <NavBar />
        {props.children}
      </div>
      <div className="z-1">
        <Overlay />
      </div>

      <div className="z-2">
        {<SideBar />}
        {appMetaContext.isAddLoanFormOpen && <AddLoanForm />}
      </div>
    </>
  );
}

export default BasePage;
