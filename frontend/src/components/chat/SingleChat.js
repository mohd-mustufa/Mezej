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

const SingleChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
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
    fetchAllMessages();
  }, [selectedChat]);

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
            overflowY="scroll"
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
              <>
                <ScrollableChat messages={messages} />
              </>
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
