import { useContext } from "react";

import AppMetaContext from "../context/app-meta-context";

function Overlay() {
  const appMetaContext = useContext(AppMetaContext);
  const show = appMetaContext.isAddLoanFormOpen || appMetaContext.isSideBarOpen;

  function clickHandler(event) {
    event.preventDefault();
    appMetaContext.reset();
  }

  return (
    <div
      className={"overlay " + (show ? " w3-show" : " w3-hide")}
      onClick={clickHandler}
    ></div>
  );
}

export default Overlay;
