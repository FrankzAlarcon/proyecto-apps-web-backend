import { CreateUserDto, UpdateUserDto } from './../../types/user.d';
import { PrismaClient, User } from '@prisma/client'
import boom from '@hapi/boom'

export class UserService {
  private prisma;

  constructor() {
    this.prisma = new PrismaClient()
  }

  async getAll(): Promise<User[]> {
    return await this.prisma.user.findMany()
  }

  async getOne(id: number): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { id } })

    if (!user) {
      throw boom.notFound("User not found")
    }

    return user
  }

  async create(data: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({ data })
    return user
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { id } })

    if (!user) {
      throw boom.notFound(`User not found`)
    }

    const updatedUser = await this.prisma.user.update({ where: { id }, data })

    return updatedUser
  }

  async remove(id: number): Promise<number> {
    const user = await this.prisma.user.findFirst({ where: { id } })
    if (!user) {
      throw boom.notFound("User not found")
    }
    const userDeleted = await this.prisma.user.delete({ where: { id } })
    return userDeleted.id
  }
}