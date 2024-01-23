import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);

  const handleClick = () => setShow((prevVal) => !prevVal);
  const submitHandler = () => {};

  return (
    <VStack spacing="5px">
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

      <Button colorScheme="blue" width="100%" mt="30px" onClick={submitHandler}>
        Login
      </Button>
    </VStack>
  );
};

export default Login;
