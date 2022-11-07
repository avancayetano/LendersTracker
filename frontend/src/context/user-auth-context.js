import { createContext, useState } from "react";

const UserAuthContext = createContext({
  username: "",
  fullname: "",
  setProfile: (profile) => {},
});

export function UserAuthContextProvider(props) {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");

  function setProfileHandler(profile) {
    setUsername(profile.username);
    setFullname(profile.fullname);
  }

  const context = {
    username: username,
    fullname: fullname,
    setProfile: setProfileHandler,
  };

  return (
    <UserAuthContext.Provider value={context}>
      {props.children}
    </UserAuthContext.Provider>
  );
}

export default UserAuthContext;
