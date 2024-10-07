import { useDisclosure } from '@chakra-ui/hooks'
import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { ChatState } from '../../Context/Chatprovider'
import UserBadgeItem from '../chatItems/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../chatItems/UserListItem'


const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
    const { user , selectedChat ,setSelectedChat } = ChatState();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();
    console.log(selectedChat);

    const handleRemove =  async(user1) => {
        if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
            toast({
                title : "Only Admin can remove Someone!",
                status : "error",
                duration : 3000,
                isClosable : true,
                position : "top-right"
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

           const { data } = await axios.put('/api/chat/groupremove',{
                chatId : selectedChat._id,
                userId : user1._id
           },config)

           user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
              setFetchAgain(!fetchAgain);
              fetchMessages()
                setLoading(false);
                setSearchResult();
        }
        catch(error){
            toast({
                title : "Error Occured",
                status : "error",
                description : "Failed to remove user",
                duration : 5000,
                isClosable : true,
                position : "bottom-left"
            })
            setLoading(false);
        }
    }

    const handleRename = async () => {
        if(!groupChatName){
            toast({
                title : "Please Enter Chat Name",
                status : "warning",
                duration : 3000,
                isClosable : true,
                position : "top-right"
            })
            return;
        } 

        try{
            setRenameLoading(true);

            const config = {
                headers : {
                    Authorization : `Bearer ${user.token}`
                }
            };

            const { data } = await axios.put('/api/chat/rename',{
                chatId : selectedChat._id,
                chatName : groupChatName
            },config);
            
            setSelectedChat(data)
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        }
        catch(error){
            toast({
                title : "Error Occured",
                status : "error",
                description : "Failed to rename chat",
                duration : 5000,
                isClosable : true,
                position : "bottom"
            })
            setRenameLoading(false);
        }
        setGroupChatName("");
    }

    const handleSearch = async (query) => {
        setSearch(query)
        if(!query){
            return;
        }

        try{
            setLoading(true);

            const config = {
               headers:{
                 Authorization : `Bearer ${user.token}`
               },
            };

        const {data} = await axios.get(`api/user?search=${search}`,config);
        console.log("serch data", data);
        setLoading(false);
        setSearchResult(data);
    }catch(error){
        toast({
            title: "Error Occured",
            description: "Failed to load the search results",
            status: "error",
            duration: 5000,
            isClosable:true,
            position:"bottom-left"
        })
        }
    }

    const handleAddUser = async (user1) => {
        if(selectedChat.users.find(u => u._id === user1._id)){
            toast({
                title : "User Already in the group",
                status : "error",
                duration : 3000,
                isClosable : true,
                position : "top-right"
            })
            return;
        }

        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title : "Only Admin can add users",
                status : "error",
                duration : 3000,
                isClosable : true,
                position : "top-right"
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

            const { data } = await axios.put('/api/chat/groupadd',{
                chatId : selectedChat._id,
                userId : user1._id,
            },config)

            setSelectedChat(data);
            setSearchResult();
            setFetchAgain(!fetchAgain);
            setLoading(false);

        }
        catch(error){
            toast({
                title : "Error Occured",
                status : "error",
                description : "Failed to add user",
                duration : 5000,
                isClosable : true,
                position : "bottom-left"
            })
            setLoading(false);
        }

    }

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      >
        Open Modal
      </IconButton>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <Text
            fontSize="16px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            <b style={{ marginRight: "10px" }}>Group Admin : </b>{" "}
            {selectedChat.groupAdmin.name}
          </Text>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" w="100%" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
           
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((u) => (
                <UserListItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleAddUser(u)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModal
