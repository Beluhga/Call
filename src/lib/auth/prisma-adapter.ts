import { Adapter } from "next-auth/adapters"
import { prisma } from "../prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { destroyCookie, parseCookies } from "nookies"

export  function PrismaAdapter(
    req: NextApiRequest,
    res: NextApiResponse,
    ): Adapter {
    return {
      async createUser(user) {
        const {'@Call:userId': userIdOnCookies} = parseCookies({req}) //parseCookies({req}) = para buscar todos os cookies (userIdOnCookies = Id de usuario dos cookies)

        if(!userIdOnCookies){
            throw new Error('User ID not found on cookies.')
        }

        const prismaUSer = await prisma.user.update({ // conectar o usuario no prisma (no backEnd)
            where: {
                id: userIdOnCookies,
            },
            data: {
                name: user.name,
                email: user.email,
                avatar: user.avatar
            },
        })

        destroyCookie({res}, '@Call:userId', { // para apagar o cookie
            path: '/',
        })
        return {
            id: prismaUSer.id,
            name: prismaUSer.name,
            username: prismaUSer.username,
            email: prismaUSer.email!,
            emailVerified: null,
            avatar: prismaUSer.avatar!,
        }
      },
      async getUser(id) {
        const user = await prisma.user.findUnique({
            where: {
                id,
            },
        })
        if(!user){
            return null
        }
        return { // vais er chamada depois q usuario for criado
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email!,
            emailVerified: null,
            avatar: user.avatar!,
        }
      },
      async getUserByEmail(email) {
        const user = await prisma.user.findUnique({
            where: {
                email,

            },
        })

        if(!user){
            return null
        }
        
        return { // vais er chamada depois q usuario for criado
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email!,
            emailVerified: null,
            avatar: user.avatar!,
        }
      },
      async getUserByAccount({ providerAccountId, provider }) {
        const account = await prisma.account.findUnique({
            where: {
                provider_provider_account_id: {
                    provider,
                    provider_account_id: providerAccountId,
                },
            },
            include: {
                user: true,
            },
        }) // quero encontra uma account caso nao encontre disparar um error
        if (!account){
            return null
        }

        const {user} = account
        return { 
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email!,
            emailVerified: null,
            avatar: user.avatar!,
        }
      },
      async updateUser(user) {
        const prismaUser = await prisma.user.update({
            where: {
                id: user.id!,
            },
            data: {
                name: user.name,
                email: user.email,
                avatar: user.avatar
            },
        })
        return { 
            id: prismaUser.id,
            name: prismaUser.name,
            username: prismaUser.username,
            email: prismaUser.email!,
            emailVerified: null,
            avatar: prismaUser.avatar!,
        }
      },
       
      async linkAccount(account) {
        await prisma.account.create({
            data: {
                user_id: account.userId,
                type: account.type,
                provider: account.provider,
                provider_account_id: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.id_token,
                id_token: account.id_token,
                session_state: account.session_state,
            }
        })
      },
      async createSession({ sessionToken, userId, expires }) {
        await prisma.session.create({
            data: {
                user_id: userId,
                expires,
                session_token: sessionToken,
            }
        })
        return {
            userId,
            sessionToken,
            expires
        }
      },
      async getSessionAndUser(sessionToken) {
        const prismaSession = await prisma.session.findUnique({
            where: {
                session_token: sessionToken,
            },
            include: {
                user:true,
            },
        })

        if (!prismaSession){
           return null
        }

        const {user, ...session} = prismaSession
        
        return {
            session: {
                userId: session.user_id,
                expires: session.expires,
                sessionToken: session.session_token,
            },
            user: { 
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email!,
                emailVerified: null,
                avatar: user.avatar!,
            }
        }
      },
      async updateSession({ sessionToken, expires, userId }) {
        const prismaSession = await prisma.session.update({
            where: {
               session_token: sessionToken,
            },
            data: {
                expires,
                user_id: userId,
            },
        })
        return { 
            sessionToken: prismaSession.session_token,
            userId: prismaSession.user_id,
            expires: prismaSession.expires,
        }
      },
      async deleteSession(sessionToken){
        await prisma.session.delete({
            where: {
                session_token: sessionToken,
            }
        })
      }
    }
  }