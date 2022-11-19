import { createContext, useState } from "react";

const AppMetaContext = createContext({
  isSideBarOpen: false,
  isAddLoanFormOpen: false,
  setIsSideBarOpen: () => {},
  setIsAddLoanFormOpen: () => {},
  reset: () => {},
});

export function AppMetaContextProvider(props) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isAddLoanFormOpen, setIsAddLoanFormOpen] = useState(false);

  function reset() {
    setIsSideBarOpen(false);
    setIsAddLoanFormOpen(false);
  }

  const context = {
    isSideBarOpen,
    setIsSideBarOpen,
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
