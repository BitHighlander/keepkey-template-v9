'use client'

import { Button, Container, Stack, Text, Box, Spinner } from '@chakra-ui/react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FaGoogle, FaUser } from 'react-icons/fa'
import { useState, useEffect } from 'react'

export const LoginPage = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [isAuthenticating, setIsAuthenticating] = useState(false)

    // Handle session redirect in useEffect to avoid React state updates during render
    useEffect(() => {
        if (session) {
            router.replace('/getting-started')
        }
    }, [session, router])

    if (status === 'loading') {
        return (
            <Box
                position="fixed"
                top={0}
                left={0}
                right={0}
                bottom={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="gray.900"
            >
                <Spinner size="xl" color="blue.500" />
            </Box>
        )
    }

    // Handle Google Sign In
    const handleGoogleSignIn = async () => {
        try {
            setIsAuthenticating(true)

            console.log('🔄 Starting Google login')

            const result = await signIn('google', {
                callbackUrl: '/getting-started',
                redirect: true
            })

            // We shouldn't reach here due to redirect: true
            console.log('🔑 SignIn result:', result)
        } catch (error) {
            console.error('❌ Google auth failed:', error)
        } finally {
            setIsAuthenticating(false)
        }
    }

    return (
        <Stack flex="1" direction="row" minH="100vh">
            <Stack
                flex="1"
                alignItems="center"
                justify="center"
                direction="column"
                gap="8"
                bg="gray.900"
            >
                <Container maxWidth="sm">

                    {/* Google Login Button */}
                    <Button
                        w="100%"
                        mb="4"
                        onClick={handleGoogleSignIn}
                        variant="outline"
                    >
                        <Stack direction="row" gap={2} align="center">
                            <FaGoogle />
                            <Text>Continue with Google</Text>
                        </Stack>
                    </Button>

                    {/* KeepKey Login Button */}
                    <Button
                        w="100%"
                        mb="4"
                        onClick={handleKeepKeyLogin}
                        variant="outline"
                        colorScheme="blue"
                        isLoading={isAuthenticating && pioneer?.state?.app?.queryKey}
                        loadingText="Authenticating..."
                        disabled={isAuthenticating}
                    >
                        <Stack direction="row" gap={2} align="center">
                            <img src="https://pioneers.dev/coins/keepkey.png" alt="KeepKey" style={{ width: '20px', height: '20px' }} />
                            <Text>Continue with KeepKey</Text>
                        </Stack>
                    </Button>

                    <Stack direction="row" gap={4} align="center" my="4">
                        <Stack flex="1" h="1px" bg="gray.200" />
                        <Text color="fg.muted">or</Text>
                        <Stack flex="1" h="1px" bg="gray.200" />
                    </Stack>

                    {/* Guest Login Button */}
                    <Button
                        w="100%"
                        onClick={handleGuestLogin}
                        variant="outline"
                        isLoading={isAuthenticating && !pioneer?.state?.app?.queryKey}
                        loadingText="Signing in..."
                    >
                        <Stack direction="row" gap={2} align="center">
                            <FaUser />
                            <Text>Continue as Guest</Text>
                        </Stack>
                    </Button>
                </Container>
            </Stack>
        </Stack>
    )
}
