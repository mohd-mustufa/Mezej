import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatsPage = () => {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    try {
      const data = await axios.get("http://127.0.0.1:5000/chats");
      setChats(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>
      {chats.map((chat) => (
        <div key={chat._id}>{chat.chatName}</div>
      ))}
    </div>
  );
};

export default ChatsPage;
