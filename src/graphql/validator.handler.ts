import boom from '@hapi/boom'
import { Role } from '@prisma/client'
import { ObjectSchema, Schema } from 'joi'
import { JwtContext } from '../../types'
import { PayloadToken } from '../../types/auth'

export const schemaValidation = (schema: ObjectSchema | Schema, data: unknown): void => {
  const { error } = schema.validate(data, { abortEarly: false })
  if (error) {
    throw boom.badRequest(error.message)
  }
}

export const checkRoles = (payload: PayloadToken, ...roles: Role[]): void => {
  if (!roles.includes(payload.role)) {
    throw boom.unauthorized('This action is prohibited for you')
  }
}

export const verifyJWT = async (context: JwtContext): Promise<{ payload: PayloadToken }> => {
  const { user } = await context.authenticate('jwt', { session: false })
  if (!user) {
    throw boom.unauthorized('JWT is not valid')
  }
  const payload: PayloadToken = {
    role: user.role,
    sub: user.sub as any
  }
  return { payload }
}

export const checkRequestOwnData = (payload: PayloadToken, id: number): void => {
  if (payload.role !== 'ADMIN') {
    if (payload.sub !== Number(id)) {
      throw boom.unauthorized('This action is prohibited for you')
    }
  }
}
