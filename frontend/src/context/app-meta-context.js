import { createContext, useState } from "react";

const AppMetaContext = createContext({
  isSideBarOpen: false,
  setIsSideBarOpen: () => {},
});

export function AppMetaContextProvider(props) {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const context = {
    isSideBarOpen: isSideBarOpen,
    setIsSideBarOpen: setIsSideBarOpen,
  };

  return (
    <AppMetaContext.Provider value={context}>
      {props.children}
    </AppMetaContext.Provider>
  );
}

export default AppMetaContext;
