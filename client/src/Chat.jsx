import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./UserContext";

function Chat() {
  // State variables
  const [ws, setWs] = useState(null); // WebSocket connection
  const [onlinePeople, setOnlinePeople] = useState({}); // Online users
  const { username, id } = useContext(UserContext); // Current user data

  // Connect to WebSocket server on component mount
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4040");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);

  // Function to transform array of users into object of users
  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      // Don't add current user to online people list
      if (userId !== id) {
        people[userId] = username;
      }
    });
    console.log('showOnlinePeopl', people);
    setOnlinePeople(people);
  }

  // Handle WebSocket message event
  function handleMessage(event) {
    const messageData = JSON.parse(event.data);
    console.log(messageData);
    showOnlinePeople(messageData);
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex">
        {/* Chat list */}
        <div className="w-1/3 h-full bg-stone-600 p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            {/* Chat list title and icon */}
            <div className="flex items-center">
              <h2 className="text-white font-bold text-lg">Chat List</h2>
              <img
                src="https://cdn-icons-png.flaticon.com/512/811/811476.png"
                alt="chat icon"
                className="w-6 h-6 ml-2"
              />
            </div>
            {/* Active person label */}
            <span className="text-white">Active Person</span>
          </div>
          {/* Online people list */}
          <div className="bg-white p-2 rounded-lg">
            <ul className="mt-3 mx-3">
              {Object.values(onlinePeople).map((u) => (
                <li
                  key={u}
                  className={
                    "flex items-center space-x-3 mb-3 p-2 rounded-lg bg-green-200"
                  }
                >
                  <img
                    src="https://picsum.photos/id/237/50/50"
                    alt="avatar"
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">{u}</h3>
                    <p className="text-gray-600 text-sm">Hello there</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Chat area */}
        <div className="w-2/3 h-full bg-gray-200 p-4">
          <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-grow overflow-y-scroll">
              Message with selected person
            </div>
            {/* Message input */}
            <div className="flex gap-2">
              <input
                type="text"
                className="bg-white border p-2 flex-grow"
                placeholder="Type your message here"
              />
              <button className="bg-sky-500/75 rounded-lg p-2 text-cyan-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
