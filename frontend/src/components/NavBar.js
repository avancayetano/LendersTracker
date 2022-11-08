import { IoMenu } from "react-icons/io5";

function NavBar() {
  return (
    <>
      <div className="nav-bar">
        <div className="nav-bar-inner">
          <IoMenu className="left icon" />
          <div className="title">Lenders' Tracker</div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
