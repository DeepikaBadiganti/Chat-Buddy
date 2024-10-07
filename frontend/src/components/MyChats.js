import React, { useEffect } from 'react'
import { useState } from 'react';
import { ChatState } from '../Context/Chatprovider';
import { Box, Button, Stack, useToast , Text} from "@chakra-ui/react"
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoader from './ChatLoader';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({fetchAgain}) => {
    const [loggedUser,setLoggedUser] = useState();
    const {user,selectedChat,setSelectedChat,chats,setChats} = ChatState();

    const toast = useToast();

    const fetchChats = async () =>{
        try{
            const config = {
                headers : {
                    Authorization : `Bearer ${user.token}`
                }    
            }
            const {data} = await axios.get('/api/chat',config);
            
            
            setChats(data);
        }
        catch(error){
           console.log(error)
            toast({
                title : "Error Occured",
                status : "error",
                description:"Failed to fetch chats",
                duration : 5000,
                isClosable : true,
                position:"bottom-left"
            })
        }    
    }
    
     
     useEffect(()=>{
        setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
        fetchChats();
     },[fetchAgain])

     
      
     

  return (
    <>
      <Box
        display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDirection="column"
        alignItems="center"
        w={{ base: "100%", md: "30%" }}
        p={3}
        bg={"white"}
        borderWidth="1px"
        borderRadius="lg"
      >
        <Box
          pb={3}
          px={3}
          fontSize={{ base: "28px", md: "30px" }}
          fontFamily="Work sans"
          display="flex"
          justifyContent="space-between"
          w="100%"
          alignItems="center"
        >
          My Chats
          <GroupChatModal>
            <Button
              display="flex"
              fontSize={{ base: "17px", md: "10px", lg: "17px" }}
              rightIcon={<AddIcon />}
            >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          w="100%"
          p={3}
          h="90%"
          bg="#F8F8F8"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chats ? (
            <Stack overflowY="scroll">
              {console.log("chats",chats)}
              {chats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor={"pointer"}
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >

                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs">
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              ))}
            </Stack>
            // console.log("chats",chats)
          ) : (
            <ChatLoader  />
          )}
        </Box>
      </Box>
    </>
  );
}

export default MyChats
