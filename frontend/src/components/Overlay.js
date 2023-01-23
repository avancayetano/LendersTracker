import { useContext } from "react";

import AppMetaContext from "../context/app-meta-context";

function Overlay(props) {
  const appMetaContext = useContext(AppMetaContext);

  function clickHandler(event) {
    event.preventDefault();
    const isSideBarOpen = appMetaContext.isSideBarOpen;
    appMetaContext.reset();
    if (isSideBarOpen) {
      appMetaContext.setIsSideBarClosed(true);
    }

    // Note to self: make everything like this
    // Instead of relying on context, just pass the close handler of the involved form/dialog/sidebar
    if (props.closeHandler) {
      props.closeHandler();
    }
  }

  return <div className={"z-1 overlay "} onClick={clickHandler}></div>;
}

export default Overlay;
