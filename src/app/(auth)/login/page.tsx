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
import { usePioneerContext } from '@/common/provider'
import { FcGoogle } from 'react-icons/fc'

export default function LoginPage() {
  const pioneer = usePioneerContext()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      await signIn('google', {
        callbackUrl: '/dashboard',
        prompt: 'login',
        redirect: true,
      })
    } catch (error) {
      console.error('Google sign-in error:', error)
      setError('Failed to sign in with Google. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box p={8} maxWidth="400px" borderWidth={1} borderRadius={8} boxShadow="lg" bg="white">
        <Stack gap={4}>
          <Heading textAlign="center">Login</Heading>
          
          <Button
            width="100%"
            size="lg"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <Flex align="center" justify="center" gap={2}>
              <FcGoogle size={20} />
              <Text>Sign in with Google</Text>
            </Flex>
          </Button>
          
          <Text textAlign="center" color="gray.500">
            or
          </Text>

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
        </Stack>
      </Box>
    </Flex>
  )
}