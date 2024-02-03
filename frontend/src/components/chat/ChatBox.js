import { Box } from "@chakra-ui/react";
import React from "react";
import { useChatState } from "../../context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = () => {
  const { selectedChat } = useChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "59%", lg: "64%", xl: "69%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat />
    </Box>
  );
};

export default ChatBox;
