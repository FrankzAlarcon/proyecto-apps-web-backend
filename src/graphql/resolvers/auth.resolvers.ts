import { CreateCompleteAuthDto } from './../../../types/auth.d';
import { ID } from "../../../types";
import { AuthService } from "../../services/auth.service";

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