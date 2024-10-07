import { useHistory } from "react-router-dom";
import { createContext,useContext, useEffect,useState } from "react";

const ChatContext = createContext();

const Chatprovider = ({ children }) => {
    const [user,setUser] = useState();
    const [selectedChat,setSelectedChat] = useState();  
    const [chats,setChats] = useState([]);
    const [notification,setNotification] = useState([]);
    
    const history = useHistory();

     useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if(userInfo == null || userInfo == undefined) {
          history.push("/")
            
        }
        setUser(userInfo)
    },[history])
  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification}}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () =>{ 
    return useContext(ChatContext);
}


export default Chatprovider;