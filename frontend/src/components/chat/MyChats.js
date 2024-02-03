import React, { useEffect } from "react";
import { useChatState } from "../../context/ChatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { BASE_URL, GET_ALL_CHATS_URL } from "../../utils/constants";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoadingSkeleton from "./ChatLoadingSkeleton";
import { getSender } from "../../utils/getSender";
import GroupChatModal from "./GroupChatModal";

const MyChats = () => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    fetchChatsAgain,
  } = useChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(BASE_URL + GET_ALL_CHATS_URL, config);
      setChats(data);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to fetch all chats",
        status: "error",
        position: "bottom-left",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchChatsAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "40%", lg: "35%", xl: "30%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        bg="white"
        fontFamily="work sans"
        pb={3}
        px={3}
      >
        <Text fontSize={{ base: "20px", sm: "24px", md: "22px", lg: "26px" }}>
          My Chats
        </Text>
        <GroupChatModal>
          <Button
            p={{ base: "2", sm: "3" }}
            display="flex"
            fontSize={{ base: "12px", sm: "15px", md: "13px", lg: "16px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        bg="f8f8f8"
        w="100%"
        h="100%"
        p={3}
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                key={chat._id}
                cursor="pointer"
                bg={selectedChat === chat ? "#2b6cb0" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
              >
                {chat.isGroupChat
                  ? chat.chatName
                  : getSender(user, chat.users)?.name}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoadingSkeleton />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
