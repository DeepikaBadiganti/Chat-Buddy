import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/Chatprovider'
import { Box, FormControl, IconButton, Input,Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from "@chakra-ui/icons";
import { FiSend } from "react-icons/fi"; 
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import './styles.css'
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import Lottie from 'react-lottie'
import animationData from '../animations/typing.json'

import Picker from "emoji-picker-react";
import { MdMoreVert } from "react-icons/md";

const ENDPOINT = "http://localhost:4000";
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain,setFetchAgain}) => {

    const [messages, setMessages] = useState([]);
    const [loading,setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing,setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

     const [showEmojiPicker, setShowEmojiPicker] = useState(false);

      const onEmojiClick = (emoji) => {
       console.log(emoji.emoji); // Log the emojiObject to see its structure
       if (emoji && emoji.emoji) {
         setNewMessage((prevMessage) => prevMessage + emoji.emoji);
       }
      };

    const defaultOptions = {
        loop : true,
        autoplay : true,
        animationData : animationData,
        rendererSettings : {
            preserveAspectRatio : "xMidYMid slice"
        }
    }

    const toast = useToast();
    const {
      user,
      selectedChat,
      setSelectedChat,
      notification,
      setNotification,
    } = ChatState();

    const fetchMessages = async () => {
        if(!selectedChat) return;

        try{
            const config = {
                headers : {
                    Authorization : `Bearer ${user.token}`,
                }
            }
            setLoading(true)

            const {data} = await axios.get(`api/message/${selectedChat._id}`,config)

         
            setMessages(data);
            setLoading(false);

            socket.emit("join chat",selectedChat._id)
            
        }
        catch(error){
            toast({
                title : "Error Occured!",
                description : "Failed to load messages",
                status : "error",
                duration : 3000,
                isClosable:true,
                position: "bottom"
            })
        }
    }

      useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup",user)
        socket.on("connected",() => setSocketConnected(true))
        socket.on("typing",() => setIsTyping(true))
        socket.on("stop typing",() => setIsTyping(false))
    },[])

    useEffect(() => {
        fetchMessages();
        
        selectedChatCompare = selectedChat;
    },[selectedChat])

   

    useEffect(() => {
        socket.on("message recieved",(newMessageRecieved) => {
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                // Notification Logic
                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved,...notification]);
                    setFetchAgain(!fetchAgain);
                }

            }else{
                setMessages([...messages,newMessageRecieved])
            }
        })
    })
   

    const sendMessage = async (event) => {
        if ((event.key === "Enter" && newMessage) || event.type === "click") {
          socket.emit("stop typing", selectedChat._id);
          try {
            const config = {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            };
            setNewMessage("");
            const { data } = await axios.post(
              "/api/message",
              {
                content: newMessage,
                chatId: selectedChat._id,
              },
              config
            );

            // console.log(data)

            socket.emit("new message", data);
            setMessages([...messages, data]);
            setFetchAgain(!fetchAgain);
          } catch (error) {
            toast({
              title: "Error Occured!",
              description: "Failed to sendd the Message",
              status: "error",
              duration: 3000,
              isClosable: true,
              position: "buttom",
            });
          }
        }
    }

  

    const typingHandler = (e) => {
        setNewMessage(e.target.value)
        
        // Typing Indicater Logic
        if(!socketConnected) return;

        if(!typing){
            setTyping(true);
            socket.emit("typing",selectedChat._id)
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if(timeDiff >= timerLength && typing){
                socket.emit("stop typing",selectedChat._id);
                setTyping(false);
            }
        },timerLength)
    }

    const clearChat = async () => {
        try{
          const config = {
                headers : {
                    Authorization : `Bearer ${user.token}`,
                }
            }
            setLoading(true)

            const {data} = await axios.delete(`api/message/${selectedChat._id}`,config)

            console.log("Deleted" ,data)
            
            setMessages([]);
            setFetchAgain(!fetchAgain);
            setLoading(false);
            toast({
                title : "Chat Cleared",
                status : "success",
                duration : 3000,
                isClosable:true,
                position: "top"
            })
            
        }
        catch(error){
            toast({
                title : "Error Occured!",
                description : "Failed to clear chat",
                status : "error",
                duration : 3000,
                isClosable:true,
                position: "bottom"
            })
        }
    }

    const deleteSingleChat = async () => {
      try{
            const config = {
                headers : {
                    Authorization : `Bearer ${user.token}`,
                }
            }
            setLoading(true)

            const {data} = await axios.delete(`api/chat/${selectedChat._id}`,config)

            console.log("Deleted" ,data)
            setMessages([]);
            setSelectedChat("");
            toast({
                title : "Chat Deleted",
                status : "success",
                duration : 3000,
                isClosable:true,
                position: "top"
            })
            
            setLoading(false);
            setFetchAgain(!fetchAgain);
      }
      catch(error){
        console.log(error)
          toast({
              title : "Error Occured!",
              description : "Failed to delete chat",
              status : "error",
              duration : 3000,
              isClosable:true,
              position: "bottom"
          })
      }
    }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            fontFamily="Work sans"
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users).toUpperCase()}
                <Box display="flex" alignItems="center">
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                  <Menu>
                    <MenuButton>
                      <IconButton
                        icon={<MdMoreVert />}
                        onClick={() => console.log("More options clicked")} // Handle your actions
                        variant="ghost"
                        size="sm"
                        ml={2}
                      />
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        fontSize="small"
                        m={0}
                        onClick={() => clearChat()}
                      >
                        Clear Chat
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem
                        fontSize="small"
                        onClick={() => deleteSingleChat()}
                      >
                        {" "}
                        Delete Chat
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Box>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <Box display="flex" alignItems="center">
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                  <Menu>
                    <MenuButton>
                      <IconButton
                        icon={<MdMoreVert />}
                        onClick={() => console.log("More options clicked")} // Handle your actions
                        variant="ghost"
                        size="sm"
                        ml={2}
                      />
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        fontSize="small"
                        m={0}
                        onClick={() => clearChat()}
                      >
                        Clear Chat
                      </MenuItem>
                      
                    </MenuList>
                  </Menu>
                </Box>
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={10}
                h={10}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Text fontSize="sm" fontFamily="Work sans"> Typing...</Text>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              {showEmojiPicker && <Picker onEmojiClick={onEmojiClick} />}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="#E0E0E0"
              >
                {/* emoji picker  */}
                <IconButton
                  icon={<Text>😊</Text>}
                  bg="#E0E0E0"
                  variant="ghost"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                />

                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  onChange={typingHandler}
                  value={newMessage}
                />
                <>
                  {/* Send Icon Button */}
                  <IconButton
                    aria-label="Send Message"
                    icon={<FiSend />}
                    colorScheme="blue"
                    onClick={sendMessage}
                    ml={2}
                    isDisabled={!newMessage} // Disable if message is empty
                  />
                </>
              </Box>
            </FormControl>
          </Box>
        </>
      ) : (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            h="100%"
          >
            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
              Click on a user to start Chatting
            </Text>
          </Box>
        </>
      )}
    </>
  );
}

export default SingleChat
