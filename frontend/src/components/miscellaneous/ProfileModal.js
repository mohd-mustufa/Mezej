import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton onClick={onOpen} icon={<ViewIcon />} />
      )}

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          w={{ base: "310px", sm: "400px" }}
          h={{ base: "350px", md: "400px" }}
        >
          <ModalHeader
            fontSize={{ base: "30px", md: "40px" }}
            fontFamily="work sans"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            justifyContent="space-between"
            flexDir="column"
            alignItems="center"
          >
            <Image
              src={user.pic}
              alt={user.name}
              boxSize={{ base: "135px", md: "150px" }}
              borderRadius="full"
            />
            <Text
              fontSize={{ base: "24px", sm: "30px" }}
              fontFamily="work sans"
            >
              {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileModal;
