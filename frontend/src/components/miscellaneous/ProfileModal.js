import React from 'react'
import { useDisclosure } from '@chakra-ui/hooks'
import { IconButton } from '@chakra-ui/button'
import { 
    Button, 
    Image, 
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent, 
    ModalFooter, 
    ModalHeader, 
    ModalOverlay ,
    Text
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'

const ProfileModal = ({user,children}) => {
     const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ?
            (<span onClick={onOpen}>{children}</span>)
        :(
            <IconButton display={{base:"flex"}} icon={<ViewIcon />} onClick={onOpen} />
        )
      }
      <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="30px"
            display='flex'
            justifyContent="center"
            fontFamily="Work sans"
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
            
          >
            <Image src={user.profilePic} alt={user.name} borderRadius="full" boxSize="150px" m="auto"/>
            <Text fontSize={{base:"25px",md:"27px"}} fontFamily="Work sans" >{user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal
