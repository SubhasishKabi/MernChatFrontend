import React from "react";
import Avatar from "./Avatar";

const Contact = ({ online, id, userName, onClick, selected }) => {
  // console.log(selectedid)
  // console.log(userName)
  return (
    <div
      key={id}
      className={
        "border-b border-gray-300 py-2 flex items-center gap-2 cursor-pointer " +
        (selected ? "bg-blue-100" : "")
      }
      onClick={() => onClick(id)}
    >
      {selected && <div className="w-1 bg-blue-500 h-12"></div>}
      <div className="flex gap-2 items-center">
        <Avatar userName={userName[0]} userId={id} online={online} />
        <span className="text-gray-800 ">{userName}</span>
      </div>
    </div>
  );
};

export default Contact;
