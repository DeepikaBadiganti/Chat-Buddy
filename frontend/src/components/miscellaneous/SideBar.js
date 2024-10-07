import { 
    Box,
    Button, 
    Tooltip,
    Text ,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Avatar,
    MenuDivider,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerBody,
    DrawerHeader,
    Input,
    useToast
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React , {useState} from 'react'
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/hooks';
import axios from 'axios';
import ChatLoader from '../ChatLoader';
import UserListItem from '../chatItems/UserListItem';
import { Spinner } from '@chakra-ui/spinner';
import { ChatState } from '../../Context/Chatprovider';
import { getSender } from '../../config/ChatLogics';
import '../styles.css'


const SideBar = () => {
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const history = useHistory();

    const {
      user,
      setSelectedChat,
      chats,
      setChats,
      notification,
      setNotification,
    } = ChatState();

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        history.push('/');
    }
     const { isOpen, onOpen, onClose } = useDisclosure()

     const toast = useToast();

     const handleSearch = async () => {
            if(!search){ 
                toast({
                    title : "Please Enter something to search",
                    status : "warning",
                    duration : 5000,
                    isClosable : true,
                    position:"top-left"
                }) 
                return;  
            }
            try{
                setLoading(true);
                const config = {
                    headers : {
                        Authorization : `Bearer ${user.token}`
                    }
                }
                const {data} = await axios.get(`api/user?search=${search}`,config);
    
                setLoading(false);
                 setSearchResults(data);
                                 
            }catch(error){
                setLoading(false);
                toast({
                    title : "Error Occured",
                    status : "error",
                    description:"Failed to search users",
                    duration : 5000,
                    isClosable : true,
                    position:"bottom-left"
                })
            }
     }

     const accessChat = async (userId) => {
        setLoadingChat(true);
        try{
            const config = {
            headers : {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${user.token}`
            }
        }
        
        const { data } = await axios.post('/api/chat',{userId},config);

        if(!chats.find(chat => chat._id === data._id))setChats([data,...chats]);

        setSelectedChat(data);
        setLoadingChat(false);
        onClose();
        }
        catch(error){
            setLoadingChat(false);
            toast({
                title : "Error fetching chat",
                status : "error",
                description:"Failed to access chat....",
                duration : 5000,
                isClosable : true,
                position:"bottom-left"
            })
        }
     }


     const Badge = ({ count }) => (
       
         <Text color="red" className="count">{count}</Text>
       
     );
     
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        p="5px 10px 5px 10px"
        bg="white"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i class="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              {" "}
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Chat-Buddy
        </Text>
        <div>
          <Menu>
            <MenuButton>
              <Box mr={2} display={notification.length ? "flex" : ""} alignItems="center" >
                {notification.length ? <Badge count={notification.length} /> : null}    
                <BellIcon fontSize="2xl" m={1} color={notification.length ? "red" : "" } />
              </Box>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length
                ? "No New Messages"
                : notification.map((message) => (
                    <MenuItem
                      key={message._id}
                      onClick={() => {
                        setSelectedChat(message.chat);
                        setNotification(
                          notification.filter((msg) => msg._id !== message._id)
                        );
                      }}
                    >
                      {message.chat.isGroupChat
                        ? `New Message in ${message.chat.chatName}`
                        : `New Message from ${getSender(
                            user,
                            message.chat.users
                          )}`}
                    </MenuItem>
                  ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.profilePic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search Users"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoader />
            ) : (
              searchResults.map((user) => (
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
}

export default SideBar
