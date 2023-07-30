import axios from "axios";
import { createContext, useEffect, useState } from "react";

const UserContext = createContext({});

//destructured props as {children}
export const UserContextProvider = ({ children }) => {
  const [userName, setUserName] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    axios.get("/profile").then((response) => {
      // console.log(response.data);
      setId(response.data?.id);
      setUserName(response.data?.userName);
    });
  }, []);

  return (
    <UserContext.Provider value={{ userName, setUserName, id, setId }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
