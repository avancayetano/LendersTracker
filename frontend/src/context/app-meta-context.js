import { createContext, useState } from "react";

const AppMetaContext = createContext({
  isSideBarOpen: false,
  isSideBarClosed: false,
  isAddLoanFormOpen: false,
  isDialogOpen: false,
  addedNewLoan: false,
  setIsSideBarOpen: () => {},
  setIsSideBarClosed: () => {},
  setIsAddLoanFormOpen: () => {},
  setIsDialogOpen: () => {},
  setAddedNewLoan: () => {},
  reset: () => {},
});

export function AppMetaContextProvider(props) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isSideBarClosed, setIsSideBarClosed] = useState(false);
  const [isAddLoanFormOpen, setIsAddLoanFormOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [addedNewLoan, setAddedNewLoan] = useState(false);

  function reset() {
    setIsSideBarOpen(false);
    setIsSideBarClosed(false);
    setIsAddLoanFormOpen(false);
    setIsDialogOpen(false);
    setAddedNewLoan(false);
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
    addedNewLoan,
    setAddedNewLoan,
    reset,
  };

  return (
    <AppMetaContext.Provider value={context}>
      {props.children}
    </AppMetaContext.Provider>
  );
}

export default AppMetaContext;
