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
} from "@chakra-ui/react";
import { useState } from "react";
import { useChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../user/UserBadgeItem";

const UpdateGroupChatModal = () => {
  const [groupChatName, setGroupChatName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const { selectedChat, setSelectedChat, user } = useChatState();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const renameGroup = () => {};
  const leaveGroup = () => {};

  return (
    <>
      <IconButton onClick={onOpen} icon={<ViewIcon />} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
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
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedChat.users.map((u) => (
                <UserBadgeItem key={u._id} user={u} handleFunction={() => {}} />
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
                onClick={renameGroup}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add Users"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                my={1}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={leaveGroup}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
