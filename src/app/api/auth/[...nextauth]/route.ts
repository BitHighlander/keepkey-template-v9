import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

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
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('Attempting authorization with password:', credentials?.password)
        console.log('Expected password:', process.env.AUTH_PASSWORD)
        console.log('Password match:', credentials?.password === process.env.AUTH_PASSWORD)

        if (!credentials?.password) {
          console.log('No password provided')
          return null
        }

        if (credentials.password === process.env.AUTH_PASSWORD) {
          console.log('Password matched, authorizing')
          return {
            id: "1",
            email: "admin@example.com",
          }
        }
        console.log('Password did not match')
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