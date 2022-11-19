import { useContext } from "react";

import AppMetaContext from "../context/app-meta-context";
import SideBar from "../components/SideBar";
import AddLoanForm from "../components/AddLoanForm";

function BasePage(props) {
  const appMetaContext = useContext(AppMetaContext);

  return (
    <>
      {appMetaContext.isSideBarOpen && <SideBar />}
      {appMetaContext.isAddLoanFormOpen && <AddLoanForm />}
      {props.children}
    </>
  );
}

export default BasePage;
