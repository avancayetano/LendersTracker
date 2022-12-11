import { useContext } from "react";
import { Link } from "react-router-dom";
import {
  MdAccountCircle,
  MdOutlineHome,
  MdOutlineSearch,
  MdOutlineAttachMoney,
  MdOutlineArrowBackIosNew,
  MdOutlineClose,
  MdOutlineAddchart,
  MdOutlinePostAdd,
  MdOutlineManageSearch,
  MdOutlineViewStream,
} from "react-icons/md";

import AppMetaContext from "../context/app-meta-context";
import UserAuthContext from "../context/user-auth-context";
import LogOutButton from "./LogOutButton";

function SideBar() {
  const userAuthContext = useContext(UserAuthContext);
  const appMetaContext = useContext(AppMetaContext);

  return (
    <>
      <div
        className={
          "w3-sidebar sidebar w3-col s8 m4 l2 w3-bar-block w3-card w3-animate-left"
        }
      >
        <div
          className="w3-bar-item icon-btn w3-center w3-hover-light-grey"
          onClick={() => appMetaContext.setIsSideBarOpen(false)}
        >
          <div className="icon-cont icon-cont-center w3-padding-small">
            <MdOutlineClose className="w3-large" />
          </div>
        </div>
        <div className="w3-container w3-bar-item w3-center w3-border-top w3-border-bottom w3-padding-16">
          <div className="icon-cont">
            <MdAccountCircle className="w3-jumbo w3-onethird w3-text-brown" />
            <span className="w3-twothird w3-padding-small">
              <div className="w3-large w3-left-align">
                {userAuthContext.fullname}
              </div>
              <div className="w3-small w3-left-align">
                {userAuthContext.username}
              </div>
            </span>
          </div>
        </div>
        <Link
          to="/dashboard"
          className="w3-bar-item icon-btn w3-hover-light-grey w3-padding-large no-text-deco"
          onClick={() => appMetaContext.setIsSideBarOpen(false)}
        >
          <div className="icon-cont">
            <MdOutlineHome />
            <span className="margin-left">Dashboard</span>
          </div>
        </Link>
        <div
          className="w3-bar-item icon-btn w3-hover-light-grey w3-padding-large no-text-deco"
          onClick={() => {
            appMetaContext.setIsSideBarOpen(false);
            appMetaContext.setIsAddLoanFormOpen(true);
          }}
        >
          <div className="icon-cont full-height">
            <MdOutlinePostAdd />
            <span className="margin-left">Add Loan Transaction</span>
          </div>
        </div>
        <Link
          to="/dashboard/transactions"
          className="w3-bar-item icon-btn w3-hover-light-grey w3-padding-large no-text-deco"
          onClick={() => appMetaContext.setIsSideBarOpen(false)}
        >
          <div className="icon-cont">
            <MdOutlineViewStream />
            <span className="margin-left">Personal Transactions</span>
          </div>
        </Link>
        <Link
          to="/dashboard/others-transactions"
          className="w3-bar-item icon-btn w3-hover-light-grey w3-padding-large no-text-deco"
          onClick={() => appMetaContext.setIsSideBarOpen(false)}
        >
          <div className="icon-cont">
            <MdOutlineManageSearch />
            <span className="margin-left">Others' Transactions</span>
          </div>
        </Link>

        <LogOutButton className="bottom w3-bar-item w3-center" />
      </div>
    </>
  );
}
export default SideBar;
