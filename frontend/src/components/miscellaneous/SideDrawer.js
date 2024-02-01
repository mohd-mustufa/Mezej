import React, { useState } from "react";
import Header from "./Header";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import {
  BASE_URL,
  GET_SINGLE_CHAT_URL,
  SEARCH_USER_URL,
} from "../../utils/constants";
import { useChatState } from "../../context/ChatProvider";
import ChatLoadingSkeleton from "../chat/ChatLoadingSkeleton";
import UserListItem from "../user/UserListItem";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, setSelectedChat, chats, setChats } = useChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      setSearchResults([]);
      toast({
        title: "Empty Search",
        description: "Please enter data in the search bar",
        status: "warning",
        position: "top-left",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const config = { headers: { Authorization: `Bearer ${user.token}` } };

    try {
      setLoading(true);
      const { data } = await axios.get(
        BASE_URL + SEARCH_USER_URL + search,
        config
      );
      setLoading(false);
      setSearchResults(data);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        position: "bottom-left",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(
        BASE_URL + GET_SINGLE_CHAT_URL + userId,
        {},
        config
      );

      if (chats?.find((c) => c._id !== data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setSearch("");
      setSearchResults([]);
      setLoadingChat(false);
      onClose();
    } catch (err) {
      toast({
        title: "Error fetching the chat",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Header onOpen={onOpen} />

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={1}>
              <Input
                placeholder="Search by name or email"
                value={search}
                mr={2}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoadingSkeleton />
            ) : (
              searchResults.map((queriedUser) => (
                <UserListItem
                  key={queriedUser._id}
                  user={queriedUser}
                  handleClick={() => accessChat(queriedUser._id)}
                />
              ))
            )}

            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
