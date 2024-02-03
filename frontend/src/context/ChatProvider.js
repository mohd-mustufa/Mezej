import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Usually this createContext is done in a separate file but we are doing it here and returning a provider and
// also the chatState. This way we just need to import the ChatProvider in the root where we want to access
// the context and wrap all the child components. Also anywhere we want to use the state, we will just have
// to import the useChatState hook that is defined instead of importing both ChatContext and the useContext hook.
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [fetchChatsAgain, setFetchChatsAgain] = useState(false);

  // Redirecting to homepage if the user is not logged in
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        fetchChatsAgain,
        setFetchChatsAgain,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
