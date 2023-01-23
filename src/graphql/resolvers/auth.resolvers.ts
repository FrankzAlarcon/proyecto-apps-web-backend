import { CompleteUser, CreateCompleteAuthDto, Login, SignedToken } from './../../../types/auth.d'
import { ID } from '../../../types'
import { AuthService } from '../../services/auth.service'
import { PassportContext } from 'graphql-passport'
import { Request } from 'express'
import { Auth } from '@prisma/client'

const authService = new AuthService()

export const getAuths = async (): Promise<Auth[]> => {
  const auths = await authService.getAll()
  return auths
}

export const getAuth = async (_: unknown, { id }: ID): Promise<Auth> => {
  const auth = await authService.getOne(Number(id))
  return auth
}

export const createAuth = async (_: unknown, { data }: { data: CreateCompleteAuthDto }): Promise<Auth> => {
  const auth = await authService.create(data)
  return auth
}

export const login = async (
  _: unknown,
  { email, password }: Login,
  context: PassportContext<CompleteUser, Login, Request>
): Promise<SignedToken> => {
  const { user } = await context.authenticate('graphql-local', { email, password })
  // await context.login(user)
  return await authService.signToken(user as CompleteUser)
}
