import { createContext, useState } from "react";

const AppMetaContext = createContext({
  isSideBarOpen: false,
  isSideBarClosed: false,
  isAddLoanFormOpen: false,
  isDialogOpen: false,
  setIsSideBarOpen: () => {},
  setIsSideBarClosed: () => {},
  setIsAddLoanFormOpen: () => {},
  setIsDialogOpen: () => {},
  reset: () => {},
});

export function AppMetaContextProvider(props) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isSideBarClosed, setIsSideBarClosed] = useState(false);
  const [isAddLoanFormOpen, setIsAddLoanFormOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function reset() {
    setIsSideBarOpen(false);
    setIsSideBarClosed(false);
    setIsAddLoanFormOpen(false);
    setIsDialogOpen(false);
  }

  const context = {
    isSideBarOpen,
    setIsSideBarOpen,
    isSideBarClosed,
    setIsSideBarClosed,
    isAddLoanFormOpen,
    setIsAddLoanFormOpen,
    isDialogOpen,
    setIsDialogOpen,
    reset,
  };

  return (
    <AppMetaContext.Provider value={context}>
      {props.children}
    </AppMetaContext.Provider>
  );
}

export default AppMetaContext;
