import { Box } from "@chakra-ui/react"
import { useState } from "react"
import SideBar from "../components/miscellaneous/SideBar"
import MyChats from "../components/MyChats"
import ChatWindow from "../components/ChatWindow"
import {ChatState} from "../Context/Chatprovider"


const Chatpage = () => {
   const {user} = ChatState();
   const [fetchAgain,setFetchAgain] = useState(false);

  return (
    <div style={{width : "100%"}}>
      {user && <SideBar/>}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      > 
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && <ChatWindow fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}

export default Chatpage
