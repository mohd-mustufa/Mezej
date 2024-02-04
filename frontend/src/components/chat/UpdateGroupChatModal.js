import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  IconButton,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../user/UserBadgeItem";
import axios from "axios";
import {
  ADD_USER_TO_GROUP_URL,
  BASE_URL,
  REMOVE_USER_FROM_GROUP_URL,
  RENAME_GROUP_CHAT_URL,
  SEARCH_USER_URL,
} from "../../utils/constants";
import { debounce } from "lodash";
import UserListItem from "../user/UserListItem";

const UpdateGroupChatModal = () => {
  const [groupChatName, setGroupChatName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const { selectedChat, setSelectedChat, user, setFetchChatsAgain } =
    useChatState();
  const searchTextRef = useRef(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRenameGroup = async () => {
    if (!groupChatName) {
      toast({
        title: "Group Name Missing",
        description: "Please enter the new group name",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setRenameLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        BASE_URL + RENAME_GROUP_CHAT_URL,
        { groupId: selectedChat._id, newGroupName: groupChatName },
        config
      );

      setSelectedChat(data);
      setFetchChatsAgain((prev) => !prev);
      setGroupChatName("");
      setRenameLoading(false);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: err?.response?.data || "Failed to rename group",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setRenameLoading(false);
    }
  };

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

      const userSet = new Set(selectedChat.users.map((u) => u._id));
      const filteredData = data.filter((dataObj) => !userSet.has(dataObj._id));
      setSearchResults(filteredData);
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
      setLoading(false);
    }
  };

  const handleDebouncedSearch = debounce((query) => handleSearch(query), 300);

  const handleAddUser = async (userToAdd) => {
    let isAdmin = false;
    selectedChat.groupAdmins.forEach((admin) => {
      if (admin._id === user.id) {
        isAdmin = true;
      }
    });
    if (!isAdmin) {
      toast({
        title: "Only admins can add someone!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(
        BASE_URL + ADD_USER_TO_GROUP_URL,
        {
          groupId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchChatsAgain((prev) => !prev);
      searchTextRef.current.value = "";
      setGroupChatName("");
      setSearchResults([]);
      setLoading(false);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userToRemove) => {
    if ((userToRemove?._id || userToRemove?.id) !== user.id) {
      let isAdmin = false;
      selectedChat.groupAdmins.forEach((admin) => {
        if (admin._id === user.id) {
          isAdmin = true;
        }
      });
      if (!isAdmin) {
        toast({
          title: "Only admins can remove someone!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };

      const { data } = await axios.put(
        BASE_URL + REMOVE_USER_FROM_GROUP_URL,
        {
          groupId: selectedChat._id,
          userId: userToRemove._id || userToRemove.id,
        },
        config
      );

      (userToRemove?._id || userToRemove?.id) === user.id
        ? setSelectedChat()
        : setSelectedChat(data);
      setFetchChatsAgain((prev) => !prev);
      searchTextRef.current.value = "";
      setGroupChatName("");
      setSearchResults([]);
      if ((userToRemove?._id || userToRemove?.id) === user.id) onClose();
      setLoading(false);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description:
          err?.response?.data?.message ||
          err.message ||
          "Could not remove user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const handleOnClose = () => {
    setSearchText("");
    setGroupChatName("");
    setSearchResults([]);
    onClose();
  };

  return (
    <>
      <IconButton onClick={onOpen} icon={<ViewIcon />} />

      <Modal isOpen={isOpen} onClose={handleOnClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontFamily="work sans"
            fontSize="30px"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              w="100%"
              display="flex"
              flexWrap="wrap"
              overflow="scroll"
              maxH="110px"
            >
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemoveUser(u)}
                />
              ))}
            </Box>

            <FormControl mt={2} display="flex">
              <Input
                placeholder="Chat Name"
                my={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                ml={2}
                my={3}
                colorScheme="blue"
                isLoading={renameLoading}
                onClick={handleRenameGroup}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                ref={searchTextRef}
                placeholder="Add Users"
                onChange={(e) => handleDebouncedSearch(e.target.value)}
                my={1}
              />
            </FormControl>

            {/* Displays the users that were returned after search*/}
            <Box w="100%" overflow="scroll" maxH="250px" pt={1}>
              {loading ? (
                <Spinner />
              ) : (
                searchResults.map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleClick={() => handleAddUser(u)}
                  />
                ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemoveUser(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
