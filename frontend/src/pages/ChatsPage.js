import { useChatState } from "../context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { Box } from "@chakra-ui/react";
import MyChats from "../components/chat/MyChats";
import ChatBox from "../components/chat/ChatBox";

const ChatsPage = () => {
  const { user } = useChatState();

  return (
    user && (
      <div style={{ width: "100%" }}>
        <SideDrawer />
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          h="91.5vh"
          p="10px"
        >
          <MyChats />
          <ChatBox />
        </Box>
      </div>
    )
  );
};

export default ChatsPage;
