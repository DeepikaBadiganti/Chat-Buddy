import { Button, FormControl, FormLabel, VStack ,Input, InputGroup, InputRightElement, } from '@chakra-ui/react'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { ChatState } from '../../Context/Chatprovider'


const Login = () => {
    const [email,setEmail] = React.useState('')
    const [password,setPassword] = React.useState('')
    const [show,setShow] = React.useState(false) 
    const [loading,setLoading] = React.useState(false)
    const toast = useToast();
    const history = useHistory()   

    const { setUser } = ChatState();


    const handleClick = () => setShow(!show)

    const submitHandler = async () => {
        setLoading(true)
        if(!email || !password){
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
            setLoading(false)
        }
        else{
        try{
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const {data} = await axios.post('/api/user/login',{email,password},config);
            
            toast({
                title: "Login Successfull",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })

            setUser(data)
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false)
            history.push('/chats')

        }
        catch(error){
            toast({
                title: "Invalid Credentials",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top-right"
            })
            setLoading(false)
    }   
}
}   

  return (
    <VStack spacing="3px">
        <FormControl id="email1" isRequired>
            <FormLabel>Email</FormLabel>
            <Input type={'text'} value={email} onChange={(e) => setEmail(e.target.value) } placeholder='Enter your Email'/>
        </FormControl> 
        <FormControl id="password1" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input type={show ? 'text' : 'password' } value={password}  onChange={(e) => setPassword(e.target.value)} placeholder='Enter Password'/>
            <InputRightElement w="4.5rem">
                <Button onClick={handleClick} h="1.75rem" size="sm">
                { show ? 'Hide' : 'Show' }
                </Button>   
            </InputRightElement>
            </InputGroup>
            
        </FormControl>
        <Button colorScheme='blue' width="100%" style={{marginTop:15}} variant='solid' isLoading={loading} onClick={submitHandler}>Login</Button>
        <Button colorScheme='pink' width="100%" style={{marginTop:15}} variant='solid' 
        onClick ={() => {
           setEmail('guest@example.com');
           setPassword('123456');
        }}>Get Guest User Credentails</Button> 
    </VStack>
  )
}

export default Login
