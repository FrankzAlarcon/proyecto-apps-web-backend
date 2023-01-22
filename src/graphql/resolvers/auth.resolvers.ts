import { CompleteUser, CreateCompleteAuthDto, Login } from './../../../types/auth.d';
import { ID } from "../../../types";
import { AuthService } from "../../services/auth.service";
import { PassportContext } from 'graphql-passport';
import { Request } from 'express';

const authService = new AuthService()

export const getAuths = async () => {
  const auths = await authService.getAll()
  return auths
}

export const getAuth = async (_: unknown, { id }: ID) => {
  const auth = await authService.getOne(Number(id))
  return auth
}

export const createAuth = async (_: unknown, { data }: { data: CreateCompleteAuthDto }) => {
  const auth = await authService.create(data)
  return auth
}

export const login = async (_: unknown, { email, password }: Login, context: PassportContext<CompleteUser, Login, Request>) => {
  const { user } = await context.authenticate('graphql-local', { email, password });
  // await context.login(user)
  return authService.signToken(user as CompleteUser)
}