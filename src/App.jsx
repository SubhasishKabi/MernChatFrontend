import { useContext, useEffect } from "react";
import axios from "axios";
import UserContext from "./UserContext";
import RegisterAndLoginForm from "./RegisterAndLoginForm";
import Chat from "./Chat";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function App() {
  const { userName, id, setUserName, setId } = useContext(UserContext);

  // console.log(userName);
  if (userName) {
    return <Chat />;
  }

  return <RegisterAndLoginForm />;
}

export default App;
