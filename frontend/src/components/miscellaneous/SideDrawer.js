import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import {
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import UserListItem from "./UserListItem";
import { useDisclosure } from "@chakra-ui/hooks";
import { BellIcon } from "@chakra-ui/icons";
import ChatLoading from "../ChatLoading";
import React from "react";
import { useState } from "react";
import { ChatState } from "../../context/contextProvider";
import ProfileModal from "../miscellaneous/profileModal";
import { useHistory } from "react-router-dom";

const SideDrawer = () => {
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const history = useHistory();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      console.log(data);
      setSearchResult(data);
    } catch (error) {
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

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="#1a202c"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="2px"
        borderRadius="lg"
        padding={"5px 10px"}
      >
        <Tooltip label="Search users to chat." hasArrow placement="bottom-end">
          <Button bg={"#81e6d9"} ref={btnRef} onClick={onOpen}>
            <Text color={"#1a202c"} display={"flex"}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize="4xl"
          fontFamily="Work sans"
          color="white"
          fontWeight={"bold"}
        >
          Chat App
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="3xl" m={1} />
            </MenuButton>
            <MenuList pl={2}></MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              bg="#1a202c"
              padding={"0px 0px"}
              borderRadius={"100%"}
            >
              <Avatar size="sm" cursor="pointer" name={user.name} />
            </MenuButton>
            <MenuList color={"black"} marginTop={"12px"}>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bg={"#1a202c"} color={"white"}>
          <DrawerCloseButton />
          <DrawerHeader>Find a Friend!</DrawerHeader>

          <DrawerBody>
            <Box display={"flex"} paddingBottom={"2"}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button bg={"#81e6d9"} onClick={handleSearch} isLoading={loading}>
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
