import React from 'react'
import {Container,Box,Text,Tabs,Tab,TabPanels,TabList,TabPanel} from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'

const Homepage = () => {
   const history = useHistory();
    
   useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        if(user){
            history.push("/chats")
        }
    },[history])

  return (
    <Container maxW='xl' centerContent>
         <Box
          p={2}
          display="flex"
          justifyContent="center"
          w="100%"
          bg={"white"}
          margin="40px 0px 15px 0px"
          borderRadius = 'lg'
          borderWidth='1px'
         >
          <Text fontSize='4xl' fontFamily='Work sans' color='Black'>Chat-Buddy</Text>
         </Box>
         <Box width='100%' p={3} bg={'white'} borderWidth='1px' borderRadius='lg'>
              <Tabs isFitted variant='enclosed'>
                <TabList mb='1rem'>
                  <Tab>Login</Tab>
                  <Tab>Sign Up</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Login/>
                  </TabPanel>
                  <TabPanel>
                    <Signup/>
                  </TabPanel>
                </TabPanels>
              </Tabs>
         </Box>
    </Container>
  )
}

export default Homepage
