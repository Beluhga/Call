// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from '@/src/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if(req.method !== 'POST'){ //req = requisição.
    return res.status(405).end() // res= response. "405" para mostra que o metodo não é suportado pela rota. O "end()" serve para enviar sem nenhum corpo
  }

  const {name, username} = req.body

  const userExits = await prisma.user.findUnique({ //metodo para encontra um rgistro unico (so pode ter um nome)
    where: {
      name,
      username,

    },
  })

  if (userExits){
    return res.status(400).json({
      message: 'nome de usuário já utilizado'
    })
  }

  const user = await prisma.user.create({ // depois q foi criado a conta
    data: {
      name,
      username
    }
  })

  setCookie({ res }, '@Call:userId', user.id,{ //para criar os cookies e o tempo disponnivel do cookie
    maxAge: 60 * 60 * 24 * 7, // 7 dias 
    path: '/', // para todas as paginas pode acessar ou especifica
  })
 return res.status(201).json(user)
}
