import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={3}
      py="5px"
      m={1}
      borderRadius="lg"
      bg="lightskyblue"
      variant="solid"
    >
      {user.name}
      <CloseIcon pl={1.5} cursor="pointer" onClick={handleFunction} />
    </Box>
  );
};

export default UserBadgeItem;
