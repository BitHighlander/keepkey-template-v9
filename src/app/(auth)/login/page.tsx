'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react'
import { PioneerContext } from '@/app/context/PioneerContext'
import { useContext } from 'react'

export default function LoginPage() {
  const pioneerInstance = useContext(PioneerContext)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const onStart = async () => {
    if (pioneerInstance?.app) {  // Only start if app is available
      console.log('app: ', pioneerInstance.app)
    } else {
      console.log('no app found')
    }
  };

  useEffect(() => {
    onStart();
  }, [pioneerInstance?.app]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const result = await signIn('credentials', {
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid password')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('An error occurred during login')
    }
  }

  return (
    <Flex 
      as="main"
      height="100vh"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
    >
      <Box 
        w="full" 
        maxW="md" 
        mx="4" 
        p={8} 
        bg="white" 
        borderRadius="xl" 
        boxShadow="xl"
      >
        <Stack align="center" mb={8}>
          <Heading fontSize="3xl">Login</Heading>
        </Stack>
        <form onSubmit={handleSubmit}>
          <Stack gap={6}>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              size="lg"
            />
            {error && (
              <Text color="red.500" textAlign="center">
                {error}
              </Text>
            )}
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              w="full"
            >
              Sign in
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  )
}