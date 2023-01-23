import { CreateUserDto, UpdateUserDto } from './../../../types/user.d'
import { ID } from '../../../types'
import { UserService } from '../../services/user.service'
import { User } from '@prisma/client'

const userService = new UserService()

export const getUser = async (_: unknown, { id }: ID): Promise<User> => {
  const user = await userService.getOne(Number(id))
  return user
}

export const getUsers = async (): Promise<User[]> => {
  const users = await userService.getAll()
  return users
}

export const createUser = async (_: unknown, { data }: { data: CreateUserDto }): Promise<User> => {
  const user = await userService.create(data)
  return user
}

export const updateUser = async (
  _: unknown,
  { id, changes }: { id: number, changes: UpdateUserDto }
): Promise<User> => {
  const user = await userService.update(Number(id), changes)
  return user
}

export const removeUser = async (_: unknown, { id }: ID): Promise<number> => {
  const userId = await userService.remove(Number(id))
  return userId
}
