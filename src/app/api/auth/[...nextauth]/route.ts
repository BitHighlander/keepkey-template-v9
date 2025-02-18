import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
// @ts-ignore
import connection from "@pioneer-platform/default-mongo"
const usersDB = connection.get('users')

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('Please provide process.env.NEXTAUTH_SECRET')
}

if (!process.env.AUTH_PASSWORD) {
  throw new Error('Please provide process.env.AUTH_PASSWORD')
}

const handler = NextAuth({
  providers: [
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
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string
        }
      }
    },
  },
})

export { handler as GET, handler as POST } 