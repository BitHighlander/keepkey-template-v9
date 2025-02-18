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
  Spinner,
} from '@chakra-ui/react'
import { usePioneerContext } from '@/common/provider'
import { useContext } from 'react'

export default function LoginPage() {
  const pioneer = usePioneerContext()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (pioneer?.state?.app?.queryKey) {
      setPassword(pioneer.state.app.queryKey)
    }
  }, [pioneer?.state?.app?.queryKey]);

  const onStart = async () => {
    console.log('pioneer: ',pioneer)
    console.log('pioneer: ',pioneer.state.app)
    if (pioneer?.state?.app) {  // Only start if app is available
      console.log('app: ', pioneer?.state?.app)
    } else {
      console.log('no app found')
    }
  };

  useEffect(() => {
    onStart();
  }, [pioneer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const result = await signIn('credentials', {
        username: pioneer?.state?.app?.username || '',
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid credentials')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
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
          {pioneer?.state?.app?.username ? (
            <div>
              <Text>username: {pioneer.state.app.username}</Text>
              <form onSubmit={handleSubmit}>
                <Stack gap={6}>
                  <Heading fontSize="3xl">Login</Heading>
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
            </div>
          ) : (
            <Spinner size="xl" color="blue.500" />
          )}
        </Stack>
      </Box>
    </Flex>
  )
}