import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";

const SignUp = () => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [picture, setPicure] = useState();
  const [show, setShow] = useState(false);

  const handleClick = () => setShow((prevVal) => !prevVal);
  const submitHandler = () => {};

  return (
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel mb={1}>Name</FormLabel>
        <Input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel mt={1.5} mb={1}>
          Email
        </FormLabel>
        <Input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel mt={1.5} mb={1}>
          Password
        </FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement>
            <Button onClick={handleClick}>
              {show ? <ViewIcon /> : <ViewOffIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl isRequired>
        <FormLabel mt={1.5} mb={1}>
          Confirm Password
        </FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement>
            <Button onClick={handleClick}>
              {show ? <ViewIcon /> : <ViewOffIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormLabel mt={1.5} mb={1}>
          Profile Picture
        </FormLabel>
        <Input p={1.5} type="file" accept="image/*" />
      </FormControl>

      <Button colorScheme="blue" width="100%" mt="30px" onClick={submitHandler}>
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
