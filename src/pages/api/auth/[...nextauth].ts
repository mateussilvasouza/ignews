import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { query as q } from "faunadb"
import { fauna } from "../../../services/fauna"

export const authOptions = {
  // Configure one or more authentication providers
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user}) {
      const {email} = user
      await fauna.query(
        q.Create(
          q.Collection('user'),
          {data:{email}}
        )
      )
      return true
    },
  }
}

export default NextAuth(authOptions)