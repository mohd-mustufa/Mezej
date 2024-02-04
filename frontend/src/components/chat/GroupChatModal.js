import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useChatState } from "../../context/ChatProvider";
import axios from "axios";
import {
  BASE_URL,
  CREATE_GROUP_CHAT_URL,
  SEARCH_USER_URL,
} from "../../utils/constants";
import UserListItem from "../user/UserListItem";
import UserBadgeItem from "../user/UserBadgeItem";
import debounce from "lodash.debounce";

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setChats } = useChatState();
  const toast = useToast();

  // Send request to search for the users that are typed in the search query
  const handleSearch = async (query) => {
    if (!query || !query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchText(query);

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        BASE_URL + SEARCH_USER_URL + query,
        config
      );
      setSearchResults(data);
      setLoading(false);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleDebouncedSearch = debounce((query) => handleSearch(query), 300);

  // Adds a user to the selected users list upon single click, when the user is
  // clicked upon again, then it is removed from the list
  const handleGroupUsers = (userToAdd) => {
    const newSet = new Set(selectedUsers);
    if (newSet.has(userToAdd)) {
      newSet.delete(userToAdd);
    } else {
      newSet.add(userToAdd);
    }
    setSelectedUsers(newSet);
  };

  // Remove a user from the selected users list
  const handleDelete = (userToDelete) => {
    const newSet = new Set(selectedUsers);
    newSet.delete(userToDelete);
    setSelectedUsers(newSet);
  };

  const handleSubmit = async () => {
    if (!groupChatName || Array.from(selectedUsers).length === 0) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        BASE_URL + CREATE_GROUP_CHAT_URL,
        {
          name: groupChatName,
          users: [...selectedUsers],
        },
        config
      );

      setChats((prevChats) => [data, ...prevChats]);
      setSelectedUsers(new Set());
      setSearchResults([]);
      onClose();

      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  // Reset the search results and selected users when the modal is closed
  const handleOnClose = () => {
    setSelectedUsers(new Set());
    setSearchResults([]);
    onClose();
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={handleOnClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontFamily="work sans"
            fontSize={{ base: "20px", sm: "25px", md: "32px" }}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column">
            <FormControl>
              <Input
                placeholder="Enter Group Name"
                onChange={(e) => setGroupChatName(e.target.value)}
                mb={3}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users"
                onChange={(e) => handleDebouncedSearch(e.target.value)}
                mb={1}
              />
            </FormControl>

            {/*Displays the users that are selected to be added in the group*/}
            <Box
              display="flex"
              flexWrap="wrap"
              w="100%"
              overflow="scroll"
              maxH="150px"
            >
              {Array.from(selectedUsers).map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {/* Displays the users that were returned after search*/}
            <Box w="100%" overflow="scroll" maxH="250px" pt={1}>
              {loading ? (
                <Spinner />
              ) : (
                searchResults.map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleClick={() => handleGroupUsers(u)}
                    isSelected={selectedUsers.has(u)}
                  />
                ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
