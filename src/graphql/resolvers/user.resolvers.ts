import { checkRoles, schemaValidation, verifyJWT } from './../validator.handler'
import { CreateUserDto, UpdateUserDto } from './../../../types/user.d'
import { ID, JwtContext } from '../../../types'
import { UserService } from '../../services/user.service'
import { User } from '@prisma/client'
import { GetById } from '../../dtos/service.dto'
import { CreateUserDto as JoiCreateUserDto, UpdateUserDto as JoiUpdateUserDto } from '../../dtos/user.dto'

const userService = new UserService()

export const getUser = async (_: unknown, { id }: ID, context: JwtContext): Promise<User> => {
  const { payload } = await verifyJWT(context)
  checkRoles(payload, 'ADMIN')
  schemaValidation(GetById, id)

  const user = await userService.getOne(Number(id))
  return user
}

export const getUsers = async (_: unknown, __: unknown, context: JwtContext): Promise<User[]> => {
  const { payload } = await verifyJWT(context)
  checkRoles(payload, 'ADMIN')

  const users = await userService.getAll()
  return users
}

export const createUser = async (_: unknown, { data }: { data: CreateUserDto }, context: JwtContext): Promise<User> => {
  const { payload } = await verifyJWT(context)
  checkRoles(payload, 'ADMIN')
  schemaValidation(JoiCreateUserDto, data)

  const user = await userService.create(data)
  return user
}

export const updateUser = async (
  _: unknown,
  { id, changes }: { id: number, changes: UpdateUserDto },
  context: JwtContext
): Promise<User> => {
  const { payload } = await verifyJWT(context)
  checkRoles(payload, 'ADMIN')
  schemaValidation(JoiUpdateUserDto, changes)

  const user = await userService.update(Number(id), changes)
  return user
}

export const removeUser = async (_: unknown, { id }: ID, context: JwtContext): Promise<number> => {
  const { payload } = await verifyJWT(context)
  checkRoles(payload, 'ADMIN')
  schemaValidation(GetById, id)

  const userId = await userService.remove(Number(id))
  return userId
}
