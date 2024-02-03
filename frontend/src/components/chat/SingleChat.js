import React from "react";
import { useChatState } from "../../context/ChatProvider";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "../miscellaneous/ProfileModal";
import { getSender } from "../../utils/getSender";
import UpdateGroupChatModal from "./UpdateGroupChatModal";

const SingleChat = () => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    fetchChatsAgain,
    setFetchChatsAgain,
  } = useChatState();

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
            overflowY="hidden"
          ></Box>
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
