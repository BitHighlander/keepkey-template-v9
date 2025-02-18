import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
// @ts-ignore
import connection from "@pioneer-platform/default-mongo"
const usersDB = connection.get('users')

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Please provide process.env.NEXTAUTH_SECRET')
}

if (!process.env.AUTH_PASSWORD) {
  throw new Error('Please provide process.env.AUTH_PASSWORD')
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Please provide GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables')
}

const authOptions: NextAuthOptions = {
  debug: true, // Enable debug logs
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('credentials: ', credentials)
        console.log('Attempting authorization with password:', credentials?.password)
        console.log('Expected password:', process.env.AUTH_PASSWORD)

        if (!credentials?.password || !credentials?.username) {
          console.log('No password or username provided')
          return null
        }

        const userInfoMongo = await usersDB.findOne({ username: credentials.username })
        console.log("userInfoMongo: ", userInfoMongo)

        //if new user, save user
        if(!userInfoMongo){
          //TODO save user

          //TODO save queryKey in redis

          return {
            id: userInfoMongo?._id?.toString() || "1",
            email: userInfoMongo?.email || "admin@example.com",
            username: credentials.username
          }
        } else {
          console.log('username taken!')
          //if user exists get key from redis
          //if found in redis validate user

          //if no key in redis, decline and require a signMessage to prove ownership (or chose a new username)
          return null
        }

        // if (credentials.password === process.env.AUTH_PASSWORD) {
        //   console.log('Password matched, authorizing')
        //   return {
        //     id: userInfoMongo?._id?.toString() || "1",
        //     email: userInfoMongo?.email || "admin@example.com",
        //     username: credentials.username
        //   }
        // }
        // console.log('Password did not match')
        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login page on error
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn callback started:', { user, account, profile })
      
      // Always allow OAuth providers
      if (account?.provider === 'google') {
        try {
          // Check if we have the user's email
          if (!user.email) {
            console.error('No email provided by Google')
            return false
          }

          // Try to find or create user
          const existingUser = await usersDB.findOne({ email: user.email })
          console.log('Existing user check:', existingUser)
          
          if (!existingUser) {
            console.log('Creating new user for:', user.email)
            const newUser = {
              email: user.email,
              name: user.name || '',
              image: user.image || '',
              provider: 'google',
              createdAt: new Date(),
            }
            
            try {
              await usersDB.insertOne(newUser)
              console.log('Successfully created new user')
            } catch (dbError) {
              console.error('Database error creating user:', dbError)
              // Continue even if DB insert fails
            }
          }
          
          return true // Always allow Google sign in
        } catch (error) {
          console.error('Error in Google sign in flow:', error)
          return true // Still allow sign in even if our DB operations fail
        }
      }

      // For credentials provider
      return true
    },
    async jwt({ token, user, account }) {
      console.log('JWT callback:', { token, user, account })
      if (user) {
        token.id = user.id || user.email // Fallback to email if no id
        token.provider = account?.provider
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session callback:', { session, token })
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          provider: token.provider as string
        }
      }
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 