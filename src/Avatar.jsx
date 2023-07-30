import React from "react";

const Avatar = ({ userName, userId, online }) => {
  // console.log(userName)
  //   console.log(userId)

  const colors = [
    "bg-red-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-blue-200",
    "bg-yellow-200",
    "bg-pink-200",
    "bg-teal-200",
  ];

  const userIdBase10 = parseInt(userId, 16);
  const colorIndex = userIdBase10 % colors.length;
  const color = colors[colorIndex];

  // console.log(userName)

  return (
    <div
      className={
        "w-8 h-8 bg-red-200 relative rounded-full flex items-center " + color
      }
    >
      <div className="w-full text-center font-bold uppercase opacity-70">
        {userName}
      </div>
      {online && (
        <div className="absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border border-white "></div>
      )}
      {!online && (
        <div className="absolute w-3 h-3 bg-gray-400 bottom-0 right-0 rounded-full border border-white "></div>
      )}
    </div>
  );
};

export default Avatar;
