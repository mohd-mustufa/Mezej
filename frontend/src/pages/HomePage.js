import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/SignUp";

const HomePage = () => {
  return (
    <Container maxW="xl" centerContent>
      <Box
        m="40px 0 15px 0"
        p={3}
        bg="white"
        w="100%"
        borderRadius="lg"
        borderWidth={1}
      >
        <Text fontSize="4xl" fontFamily="Work Sans" textAlign="center">
          Mezej
        </Text>
      </Box>
      <Box bg="white" width="100%" borderRadius="lg" borderWidth={1} p={3}>
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1rem">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
