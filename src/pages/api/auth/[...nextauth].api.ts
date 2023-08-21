import { PrismaAdapter } from "@/src/lib/auth/prisma-adapter"
import { NextApiRequest, NextApiResponse } from "next"
import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google"

export function buildNestAuthOptions( //para usar os tokens da aplicacao
  req: NextApiRequest,
  res: NextApiResponse,

): NextAuthOptions {
  return {
    
      adapter: PrismaAdapter(req, res),
    
      // Configure one or more authentication providers
      providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID ?? "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
          authorization: {
            params: {
              scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/calendar'
            },
          },
          profile(profile: GoogleProfile) {
            return {
              id: profile.sub,
              name: profile.sanme,
              username: '',
              email: profile.email,
              avatar: profile.picture
            }
          }
        }),
        // ...add more providers here
      ],
      callbacks: {
        async signIn({account}){
          if(
            !account?.scope?.includes('https://www.googleapis.com/auth/calendar')
          ) {
          return '/register/connect-calendar/?error=permissions'
         } 
          return true
        } 
      }
    }
  }


export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, buildNestAuthOptions(req, res))
}

