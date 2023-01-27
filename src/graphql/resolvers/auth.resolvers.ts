import { checkRequestOwnData } from './../validator.handler'
import { CompleteUser, CreateCompleteAuthDto, Login, SignedToken } from './../../../types/auth.d'
import { ID, JwtContext, Message, RecoveryPassword } from '../../../types'
import { AuthService } from '../../services/auth.service'
import { PassportContext } from 'graphql-passport'
import { Request } from 'express'
import { Auth } from '@prisma/client'
import { checkRoles, schemaValidation, verifyJWT } from '../validator.handler'
import { CreateAuthDto } from '../../dtos/auth.dto'
import { GetById } from '../../dtos/service.dto'

const authService = new AuthService()

export const getAuths = async (_: unknown, __: unknown, context: JwtContext): Promise<Auth[]> => {
  const { payload } = await verifyJWT(context)
  checkRoles(payload, 'ADMIN')

  const auths = await authService.getAll()
  return auths
}

export const getAuth = async (_: unknown, { id }: ID, context: JwtContext): Promise<Auth> => {
  const { payload } = await verifyJWT(context)
  checkRoles(payload, 'ADMIN', 'CUSTOMER')
  checkRequestOwnData(payload, id)
  schemaValidation(GetById, id)

  const auth = await authService.getOne(Number(id))
  return auth
}

export const createAuth = async (
  _: unknown,
  { data }: { data: CreateCompleteAuthDto },
  context: JwtContext
): Promise<Auth> => {
  const { payload } = await verifyJWT(context)
  checkRoles(payload, 'ADMIN')
  schemaValidation(CreateAuthDto, data)

  const auth = await authService.create(data)
  return auth
}

export const register = async (_: unknown, { data }: { data: CreateCompleteAuthDto }): Promise<string> => {
  schemaValidation(CreateAuthDto, data)

  await authService.create(data)

  return 'User created successfully'
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

export const validateResetToken = async (_: unknown, { token }: { token: string }): Promise<boolean> => {
  const response = await authService.validateToken(token)
  return response
}

export const requestRecoveryPassword = async (_: unknown, { email }: { email: string }): Promise<Message> => {
  const response = await authService.requestRecoveryPassword(email)
  return response
}

export const updatePassword = async (_: unknown, { token, data }: RecoveryPassword): Promise<boolean> => {
  const response = await authService.updatePassword(token, data)
  return response
}
