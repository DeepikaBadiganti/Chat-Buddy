import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const ChatLoader = () => {
  
  return (
    <div>
      <Stack>
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
        <Skeleton height="45px" />
         <Skeleton height="45px" />
        <Skeleton height="45px" />
      </Stack>
    </div>
  )
}

export default ChatLoader
