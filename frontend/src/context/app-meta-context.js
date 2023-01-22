import { createContext, useState } from "react";

const AppMetaContext = createContext({
  isSideBarOpen: false,
  isSideBarClosed: false,
  isAddLoanFormOpen: false,

  setIsSideBarOpen: () => {},
  setIsSideBarClosed: () => {},
  setIsAddLoanFormOpen: () => {},
  reset: () => {},
});

export function AppMetaContextProvider(props) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isSideBarClosed, setIsSideBarClosed] = useState(false);
  const [isAddLoanFormOpen, setIsAddLoanFormOpen] = useState(false);

  function reset() {
    setIsSideBarOpen(false);
    setIsSideBarClosed(false);
    setIsAddLoanFormOpen(false);
  }

  const context = {
    isSideBarOpen,
    setIsSideBarOpen,
    isSideBarClosed,
    setIsSideBarClosed,
    isAddLoanFormOpen,
    setIsAddLoanFormOpen,
    reset,
  };

  return (
    <AppMetaContext.Provider value={context}>
      {props.children}
    </AppMetaContext.Provider>
  );
}

export default AppMetaContext;
