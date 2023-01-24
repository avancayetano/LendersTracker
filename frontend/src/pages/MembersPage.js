import { useEffect, useState, useContext } from "react";
import { MdOutlineGroups, MdAccountCircle } from "react-icons/md";

import BasePage from "./BasePage";
import HorizontalTable from "../components/HorizontalTable";
import UserAuthContext from "../context/user-auth-context";

function MembersPage() {
  const userAuthContext = useContext(UserAuthContext);

  const [members, setMembers] = useState({});
  const [keys, setKeys] = useState([]);
  const [keysIcons, setKeysIcons] = useState([]);

  useEffect(() => {
    fetch("/api/get-members")
      .then((res) => res.json())
      .then((data) => {
        setMembers(() =>
          data.message.reduce((prev, curr) => {
            prev[curr.name] = curr.userType;
            return prev;
          }, {})
        );
        setKeys(() => data.message.map((obj) => obj.name));
        setKeysIcons(() =>
          data.message.map((obj) =>
            obj.userType === "admin" ? (
              <MdAccountCircle className="w3-text-pink w3-xxxlarge" />
            ) : obj.userType === "lender" ? (
              <MdAccountCircle className="w3-text-deep-purple w3-xxxlarge" />
            ) : (
              <MdAccountCircle className="w3-text-blue w3-xxxlarge" />
            )
          )
        );
      });
  }, []);

  return (
    <BasePage>
      <div className="w3-container w3-center">
        <h4 className="icon-cont icon-cont-center">
          <MdOutlineGroups />
          <span className="margin-left text-overflow">Members</span>
        </h4>
        <HorizontalTable
          icon={MdOutlineGroups}
          title="Members"
          data={members}
          keys={keys}
          keysIcons={keysIcons}
          color="w3-purple"
          addtlClassNames="w3-quarter centered"
        />
      </div>
    </BasePage>
  );
}

export default MembersPage;
