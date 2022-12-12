import { createContext, useState } from "react";

const UserAuthContext = createContext({
  username: "",
  fullname: "",
  userType: "",
  isAuthenticated: false,
  setProfile: (profile) => {},
  resetProfile: () => {},
});

export function UserAuthContextProvider(props) {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [userType, setUserType] = useState("");
  const [isAuthenticated, setisAuthenticated] = useState(false);

  function setProfileHandler(profile) {
    setUsername(profile.username);
    setFullname(profile.fullname);
    setUserType(profile.userType);
    setisAuthenticated(true);
  }

  function resetProfileHandler() {
    setUsername("");
    setFullname("");
    setUserType("");
    setisAuthenticated(false);
  }

  const context = {
    username: username,
    fullname: fullname,
    userType: userType,
    isAuthenticated: isAuthenticated,
    setProfile: setProfileHandler,
    resetProfile: resetProfileHandler,
  };

  return (
    <UserAuthContext.Provider value={context}>
      {props.children}
    </UserAuthContext.Provider>
  );
}

export default UserAuthContext;
