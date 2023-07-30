import axios from "axios";
import React, { useContext, useState } from "react";
import UserContext from "./UserContext";

const RegisterAndLoginForm = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("register");
  const { setUserName: setLoggedInUserName, setId } = useContext(UserContext);

  const isButtonDisabled = !userName || !password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLoginOrRegister === "register" ? "/register" : "/login";
    const { data } = await axios.post(url, { userName, password });
    // console.log(data);
    setLoggedInUserName(data.userName);
    setId(data._id);
  };

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2 border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white block w-full rounded-sm p-2 disabled:cursor-not-allowed"
          disabled={isButtonDisabled}
        >
          {isLoginOrRegister === "register" ? "Register" : "Login"}
        </button>
        {isLoginOrRegister === "register" ? (
          <div className="text-center mt-2 cursor-pointer">
            Already a member?{" "}
            <div onClick={() => setIsLoginOrRegister("login")}>Login here</div>
          </div>
        ) : (
          <div className="text-center mt-2 cursor-pointer ">
            Don't have an account?{" "}
            <div onClick={() => setIsLoginOrRegister("register")}>
              Register here
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterAndLoginForm;
