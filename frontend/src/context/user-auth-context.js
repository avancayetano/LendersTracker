import { createContext, useState } from "react";

const UserAuthContext = createContext({
  username: "",
  fullname: "",
  isAuthenticated: false,
  setProfile: (profile) => {},
  resetProfile: () => {},
});

export function UserAuthContextProvider(props) {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [isAuthenticated, setisAuthenticated] = useState(false);

  function setProfileHandler(profile) {
    setUsername(profile.username);
    setFullname(profile.fullname);
    setisAuthenticated(true);
  }

  function resetProfileHandler() {
    setUsername("");
    setFullname("");
    setisAuthenticated(false);
  }

  const context = {
    username: username,
    fullname: fullname,
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
