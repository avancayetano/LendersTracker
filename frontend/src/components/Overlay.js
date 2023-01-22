import { useContext } from "react";

import AppMetaContext from "../context/app-meta-context";

function Overlay() {
  const appMetaContext = useContext(AppMetaContext);
  const show =
    appMetaContext.isAddLoanFormOpen ||
    appMetaContext.isSideBarOpen ||
    appMetaContext.isDialogOpen;

  function clickHandler(event) {
    event.preventDefault();
    const isSideBarOpen = appMetaContext.isSideBarOpen;
    appMetaContext.reset();
    if (isSideBarOpen) {
      appMetaContext.setIsSideBarClosed(true);
    }
  }

  return (
    <div
      className={"overlay " + (show ? " w3-show" : " w3-hide")}
      onClick={clickHandler}
    ></div>
  );
}

export default Overlay;
