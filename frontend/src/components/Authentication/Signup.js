import { FormControl, FormLabel, VStack ,Input, InputGroup, InputRightElement ,Button, position, } from '@chakra-ui/react'
import React from 'react'
import { useToast } from '@chakra-ui/react'
import {useHistory} from 'react-router-dom'
import axios from 'axios'


const Signup = () => {
    const [show,setShow] = React.useState(false)
    const [name,setName] = React.useState('')
    const [email,setEmail] = React.useState('')
    const [password,setPassword] = React.useState('')
    const [confirmPassword,setConfirmPassword] = React.useState('')
    const [profilePic,setProfilePic] = React.useState('') 
    const [loading,setLoading] = React.useState(false)  
    const toast = useToast()
    const history = useHistory()

    const handleClick = () => setShow(!show)

    const postDetails = (pics) => {
        setLoading(true)
        if(pics === undefined){
            toast({
                title: "Please Select an Image",
                status: "Warning",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
            setLoading(false)
            return;
        }
        if(pics.type === 'image/jpeg' || pics.type === 'image/png' || pics.type === 'image/jpg'){
            const data = new FormData()
            data.append('file',pics)
            data.append('upload_preset','chat-app')
            data.append('cloud_name','dfqjjtoda')
            fetch('https://api.cloudinary.com/v1_1/dfqjjtoda/image/upload',{
                method:'post',
                body:data,
            })
            .then(res => res.json())
            .then(data => {
                setProfilePic(data.url.toString())
                console.log("sucess",data)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            })
        }   
        else{
            toast({
                title: "Please Select an Image",
                status: "Warning",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
            setLoading(false)
        }
    }

    const submitHandler = async () => {
        setLoading(true)
        if(!name || !email || !password || !confirmPassword){
            toast({
                title: "Please Fill all the Fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
            setLoading(false)
            return;
        }
        if(password !== confirmPassword){
            toast({
                title: "Passwords do not match",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
            setLoading(false)
            return;
        }

        try{
            const config = {
                headers: {
                    'Content-Type':'application/json'
                }
            }
            const {data} = await axios.post('/api/user',{name,email,password,profilePic},config)
            console.log(data)
            localStorage.setItem('userInfo',JSON.stringify(data))
            toast({
                title: "User Registered Successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
            setLoading(false)
            history.push('/chats')
        }
        catch(error){
            toast({
                title: "Email Already Exists",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top-right"
            })
            setLoading(false)
        }    
    }

  return (
   <VStack spacing="3px">
        <FormControl id="first-name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input type={'text'} value={name} onChange={(e) => setName(e.target.value) } placeholder='Enter your Name'/>
        </FormControl>
        <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input type={'text'}  value={email} onChange={(e) => setEmail(e.target.value) } placeholder='Enter your Email'/>
        </FormControl>
        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
               <Input type={show ? 'text' : 'password'} value={password}  onChange={(e) => setPassword(e.target.value) } placeholder='Enter Password'/>
               <InputRightElement w="4.5rem">
                   <Button onClick={handleClick} h="1.75rem" size="sm">
                    { show ? 'Hide' : 'Show' }
                   </Button>
               </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id="conformpassword" isRequired>
            <FormLabel>Conform Password</FormLabel>
            <InputGroup>
               <Input type={show ? 'text' : 'password'}  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value) } placeholder='Conform Password'/>
               <InputRightElement w="4.5rem">
                   <Button onClick={handleClick} h="1.75rem" size="sm">
                    { show ? 'Hide' : 'Show' }
                   </Button>
               </InputRightElement>
            </InputGroup>
        </FormControl>
        
        <FormControl id="pic" isRequired> 
            <FormLabel>Profile Picture</FormLabel>
            <Input type={'file'} p={1.5} accept='image/*' onChange={(e) => postDetails(e.target.files[0]) } />
        </FormControl>
        
        <Button background='#3182ce' color="white" width="100%" style={{marginTop:15}} onClick={submitHandler} isLoading={loading} >Sign Up</Button>
   </VStack>
  )
}

export default Signup
