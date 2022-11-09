import { useState } from "react";

import { NavBar } from "./NavBar";
import { SideBar } from "./SideBar";

function Navigation() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  return (
    <>
      <NavBar />
      <SideBar isOpen={isSideBarOpen} />
    </>
  );
}

export default Navigation;
