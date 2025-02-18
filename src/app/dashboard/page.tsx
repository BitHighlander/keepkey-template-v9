'use client'

import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { Box, Button, Container, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import { ColorModeButton } from '@/components/ui/color-mode'

export default function Dashboard() {
  const { data: session } = useSession()

  return (
    <Box minH="100vh">
      <Flex justify="flex-end" p={4}>
        <ColorModeButton />
      </Flex>
      
      <Container maxW="container.xl" py={8}>
        <Flex justify="space-between" align="center" mb={8}>
          <Image
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <Button
            onClick={() => signOut({ callbackUrl: '/login' })}
            variant="outline"
          >
            Sign Out
          </Button>
        </Flex>

        <Box mb={12}>
          <Heading size="xl" mb={2}>Welcome to Dashboard</Heading>
          <Text>Logged in as {session?.user?.email}</Text>
        </Box>

        <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={12}>
          <Box p={6} borderRadius="lg" borderWidth="1px">
            <Text mb={2}>Total Users</Text>
            <Heading size="lg">1,234</Heading>
          </Box>
          <Box p={6} borderRadius="lg" borderWidth="1px">
            <Text mb={2}>Active Sessions</Text>
            <Heading size="lg">56</Heading>
          </Box>
          <Box p={6} borderRadius="lg" borderWidth="1px">
            <Text mb={2}>Total Revenue</Text>
            <Heading size="lg">$45,678</Heading>
          </Box>
          <Box p={6} borderRadius="lg" borderWidth="1px">
            <Text mb={2}>Growth</Text>
            <Heading size="lg">+12.3%</Heading>
          </Box>
        </Grid>

        <Flex gap={4}>
          <Button>New Project</Button>
          <Button variant="outline">View Reports</Button>
        </Flex>
      </Container>

      <Box as="footer" py={6} borderTopWidth="1px">
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center">
            <Text>© 2024 Your Company. All rights reserved.</Text>
            <Flex gap={6}>
              <Button variant="ghost">Privacy Policy</Button>
              <Button variant="ghost">Terms of Service</Button>
              <Button variant="ghost">Contact Support</Button>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
} 