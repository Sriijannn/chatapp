import React from "react";
import {
  Box,
  Container,
  Text,
  Tabs,
  Tab,
  TabPanels,
  TabList,
  TabPanel,
} from "@chakra-ui/react";
import { useEffect } from "react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/Signup";
import { useHistory } from "react-router-dom";

const Homepage = () => {
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) history.push("/chats");
  }, [history]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        p={3}
        w="100%"
        bg={"while"}
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <center>
          <Text fontSize="4xl" fontFamily="Work sans" color="white">
            Chat App
          </Text>
        </center>
      </Box>
      <Box w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs variant="soft-rounded" colorScheme="teal">
          <TabList>
            <Tab borderWidth={"1px"} mr={"5px"} width={"50%"} color={"white"}>
              Login
            </Tab>
            <Tab borderWidth={"1px"} ml={"5px"} width={"50%"} color={"white"}>
              Sign Up
            </Tab>
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

export default Homepage;
