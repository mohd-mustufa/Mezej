import React, { useEffect, useState } from "react";
import { useChatState } from "../../context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "../miscellaneous/ProfileModal";
import { getSender } from "../../utils/getSender";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import { BASE_URL, MESSAGE_URL } from "../../utils/constants";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const toast = useToast();
  const { user, selectedChat, setSelectedChat } = useChatState();

  const fetchAllMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        BASE_URL + MESSAGE_URL + selectedChat._id,
        config
      );

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to send the Message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      const config = {
        headers: {
          "content-type": "Application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      setNewMessage("");
      try {
        const { data } = await axios.post(
          BASE_URL + MESSAGE_URL,
          {
            chatId: selectedChat._id,
            content: newMessage,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (err) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    fetchAllMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageData) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageData.chat._id
      ) {
        // notif
      } else {
        setMessages([...messages, newMessageData]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            fontFamily="work sans"
            fontSize={{ base: "25px", md: "30px" }}
            w="100%"
            px={2}
            pb={2}
          >
            <IconButton
              icon={<ArrowBackIcon />}
              display={{ base: "flex", md: "none" }}
              onClick={() => setSelectedChat("")}
            />
            {selectedChat.isGroupChat ? (
              <>
                {selectedChat.chatName}
                <UpdateGroupChatModal />
              </>
            ) : (
              <>
                {getSender(user, selectedChat.users)?.name}
                <ProfileModal user={getSender(user, selectedChat.users)} />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            p={3}
            overflowY="auto"
          >
            {loading ? (
              <Spinner
                margin="auto"
                h={20}
                w={20}
                alignSelf="center"
                size="xl"
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                placeholder="Enter a message..."
                background="#e0e0e0"
                value={newMessage}
                variant="filled"
                onChange={(e) => typingHandler(e)}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          h="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="2xl" fontFamily="work sans">
            Click On A User To Start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
