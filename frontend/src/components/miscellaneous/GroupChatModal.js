import { useDisclosure } from '@chakra-ui/hooks'
import { useState } from 'react'
import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useToast } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../Context/Chatprovider'
import axios from 'axios'
import UserListItem from '../chatItems/UserListItem'
import UserBadgeItem from '../chatItems/UserBadgeItem'

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName , setGroupChatName ] = useState();
    const [ selectedUsers, setSelectedUsers] = useState([]);
    const [ search , setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([])
    const [ loading, setLoading] =  useState(false);

    const toast = useToast();

    const {user,chats,setChats} = ChatState();

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


    const handleGroup = (userToAdd) => {
        if(selectedUsers.includes(userToAdd)){
            toast({
                title:"User Already added",
                status: "warning",
                duration:5000,
                isClosable:true,
                position:"top",
            })
            return;
        }
        setSelectedUsers([...selectedUsers,userToAdd])
    }

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter(sel => sel._id !== delUser._id))
    }

     const handleSubmit = async () => {
        console.log("Handleing")
        
        if(!groupChatName || !selectedUsers){
            toast({
                title: "Please fill all the feilds",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        return;
        }
    
        try{

            const config = {
                headers: {
                    Authorization : `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.post('/api/chat/group',{
                name : groupChatName,
                users : JSON.stringify(selectedUsers.map(u => u._id)),
            },config);

            setChats([data, ...chats])
            console.log(data)
            onClose();
            toast({
                title: "New Group Caht is created",
                status: "success",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
        }
        catch(error){
            toast({
                title: "Failed to create the Chat!",
                status: "error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
        }
     }

  return (
    <>
      <Button onClick={onOpen}>{children}</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="work Sans"
            display="flex"
            justifyContent="center"
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
                <FormControl>
                    <Input 
                       placeholder="Chat Name" 
                       mb={3} 
                       onChange={(e) => setGroupChatName(e.target.value)} 
                    />
                </FormControl>
                <FormControl>
                    <Input 
                       placeholder="Add Users eg:Rooh,Vidyut,Deepika" 
                       mb={4} 
                       onChange={(e) => handleSearch(e.target.value)} 
                    />
                </FormControl>
                <Box w="100%" display="flex" flexWrap="wrap">
                    {selectedUsers.map(u => (
                    <UserBadgeItem key={user._id} user={u} 
                    handleFunction = {() => handleDelete(u)} 
                    />
                ))}
                .
                </Box>
                {loading ? <Spinner size="lg" /> : (
                    searchResult?.slice(0,3).map(user => (
                        <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                    ))
                )} 
          </ModalBody>

          <ModalFooter>
            <Button background='#3182ce' color="white" onClick={handleSubmit}>
              Create Chat
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
