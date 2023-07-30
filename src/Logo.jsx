import React from "react";
import chat from "./assets/icons/chat.svg";

const Logo = () => {
  return (
    <div className="text-blue-700 font-extrabold flex gap-2 items-center p-2">
      <img src={chat} className="w-5 h-5" />
      MernChat
    </div>
  );
};

export default Logo;
