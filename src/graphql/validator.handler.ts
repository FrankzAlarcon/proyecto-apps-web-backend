import boom from '@hapi/boom';
import { Role } from "@prisma/client";
import { Request } from 'express';
import { PassportContext } from 'graphql-passport';
import { PayloadToken } from "../../types/auth";

export const checkRoles = (payload: PayloadToken, ...roles: Role[]) => {
  if (!roles.includes(payload.role)) {
    throw boom.unauthorized('This action is prohibited for you')
  }
}

export const verifyJWT = async (context: PassportContext<PayloadToken, { session: boolean }, Request>) => {
  const { user } = await context.authenticate('jwt', { session: false })
  if (!user) {
    throw boom.unauthorized('JWT is not valid')
  }
  return { payload: user }
}