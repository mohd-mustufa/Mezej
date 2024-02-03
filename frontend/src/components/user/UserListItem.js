import { Avatar, AvatarBadge, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleClick, isSelected = false }) => {
  return (
    <Box
      onClick={handleClick}
      display="flex"
      alignItems="center"
      px={3}
      py={2}
      mb={2}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      borderRadius="lg"
      color="black"
      w="100%"
    >
      <Avatar size="sm" mr={2} name={user.name} src={user.pic}>
        {isSelected ? <AvatarBadge boxSize="1.25em" bg="green.500" /> : ""}
      </Avatar>
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
