import React, { useContext, useEffect, useRef, useState } from "react";
import send from "./assets/icons/send.svg";
import user from "./assets/icons/user.svg";
import attachment from "./assets/icons/attachment.svg";
import Logo from "./Logo";
import UserContext from "./UserContext";
import uniqBy from "lodash/uniqBy";
import axios from "axios";
import Contact from "./Contact";

axios.defaults.baseURL = "https://mernchat-2uyg.onrender.com";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});

  const [selectedUserId, setSelectedUserId] = useState(null);

  const { userName, id, setUserName, setId } = useContext(UserContext);

  const [newMessageText, setNewMessageText] = useState("");

  // const [messages, setMessages] = useState([]);
  const [messages, setMessages] = useState([]);

  // console.log(messages)
  const [offlinePeople, setOfflinePeople] = useState({});

  //small trick to reconnect to webSocket
  const BoxRef = useRef();
  useEffect(() => {
    connectToWebSocket();
  }, []);

  const connectToWebSocket = () => {
    //this ws is not same as that in usestate hook
    const ws = new WebSocket("ws://localhost:4000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        connectToWebSocket();
      }, 1000);
    });
  };

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, userName }) => {
      people[userId] = userName;
    });

    // console.log(people);
    // {64c030035b1f0d8603045694: 'test', 64c0300e5b1f0d8603045696: 'test2', 64c0301b5b1f0d8603045698: 'test3'}
    setOnlinePeople(people);
  }

  function handleMessage(e) {
    // console.log("new message", e);
    const messageData = JSON.parse(e.data);
    // console.log(messageData);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      if (messageData.sender === selectedUserId) {
        // console.log(messageData);
        setMessages((prev) => [
          // console.log(prev),
          ...prev,
          {
            ...messageData,
          },
        ]);
      }
    }
  }

  const onlinePeopleExcMe = { ...onlinePeople };
  delete onlinePeopleExcMe[id];

  // console.log(messages)
  const sendMessage = (e, file = null) => {
    if (e) e.preventDefault();
    ws.send(
      JSON.stringify({
        recipient: selectedUserId,
        text: newMessageText,
        file,
      })
    );

    if (file) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        setMessages(res.data);
      });
    } else {
      setNewMessageText("");
      setMessages((prev) => [
        // console.log("Prev value:", prev),
        ...prev,
        {
          text: newMessageText,
          isOur: true,
          sender: id,
          recipient: selectedUserId,
          _id: Date.now(),
        },
      ]);
    }
  };

  const sendFile = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      sendMessage(null, {
        name: e.target.files[0].name,
        data: reader.result,
      });
    };
  };

  useEffect(() => {
    const div = BoxRef.current;
    if (div) {
      div.scrollIntoView({ behaviour: "smooth", block: "end" });
    }
  }, [messages]);

  const messagesWithOutDupes = uniqBy(messages, "_id");
  // console.log(messages);
  // console.log(messagesWithOutDupes);

  useEffect(() => {
    if (selectedUserId) {
      axios.get("/messages/" + selectedUserId).then((res) => {
        // console.log(res.data);
        setMessages(res.data);
      });
    }
  }, [selectedUserId]);

  useEffect(() => {
    axios.get("/people").then((res) => {
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));

      // console.log(offlinePeopleArr);
      const offlinePeople = {};
      offlinePeopleArr.forEach((p) => {
        offlinePeople[p._id] = p;
      });

      // console.log(offlinePeople);
      setOfflinePeople(offlinePeople);
    });
  }, [onlinePeople]);
  // console.log(onlinePeople);

  const logout = () => {
    axios.post("/logout").then(() => {
      setWs(null);
      setId(null);
      setUserName(null);
    });
  };

  // console.log(userName);
  // console.log(onlinePeopleExcMe)
  // console.log(offlinePeople)
  // console.log(messages);
  //--------------------------------------COMPONENT BELOW-------------------------------------------------//

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3 p-4 flex flex-col ">
        <div className="flex-grow">
          <Logo />
          {Object.keys(onlinePeopleExcMe).map((userId) => (
            <Contact
              key={userId}
              online={true}
              id={userId}
              setSelectedid={setSelectedUserId}
              selectedid={selectedUserId}
              userName={onlinePeopleExcMe[userId]}
            />
          ))}
          {Object.keys(offlinePeople).map((userId) => (
            <Contact
              key={userId}
              online={false}
              id={userId}
              setSelectedid={setSelectedUserId}
              selectedid={selectedUserId}
              userName={offlinePeople[userId].userName}
            />
          ))}
        </div>
        <div className="p-2  flex  gap-2  justify-center">
          <div className="flex gap-2 items-center">
            <img src={user} className="w-5 h-5" />
            <span className="mr-2 text-sm text-gray-600 font-extrabold">
              {userName}
            </span>
          </div>
          <button
            className="text-sm font-bold text-white rounded-lg bg-blue-500 px-4 py-1"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
      <div className="bg-blue-200 w-2/3 p-2 flex flex-col ">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full  items-center justify-center">
              <div className="text-black/[0.4]">
                &larr; Select a person from the sidebar.
              </div>
            </div>
          )}
          {!!selectedUserId && (
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-0">
                {messagesWithOutDupes.map((message) => (
                  <div
                    className={
                      message.sender === id ? "text-right" : "text-left"
                    }
                    key={message._id}
                  >
                    <div
                      className={
                        "text-left inline-block p-2 m-2 rounded-md text-sm " +
                        (message.sender === id
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-500")
                      }
                    >
                      {message.text}
                      {message.file && (
                        <div className="flex items-center gap-2">
                          <img src={attachment} className="w-5 h-5" />
                          <a
                            className="underline"
                            href={
                              axios.defaults.baseURL +
                              "/uploads/" +
                              message.file
                            }
                            target="_blank"
                          >
                            {message.file}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={BoxRef} />
              </div>
            </div>
          )}
        </div>
        {!!selectedUserId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              type="text "
              placeholder="Type your message here"
              className="bg-white border p-2 flex-grow rounded-sm"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
            />
            <label className="bg-gray-200 p-2 rounded-lg overflow-hidden border border-gray-300 cursor-pointer flex items-center">
              <input type="file" className="hidden" onChange={sendFile} />
              <img src={attachment} className="w-5 h-5" />
            </label>
            <button className="bg-blue-500 p-2 rounded-lg overflow-hidden">
              <img src={send} className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
