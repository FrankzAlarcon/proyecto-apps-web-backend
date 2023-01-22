import boom from '@hapi/boom';
import { Auth, PrismaClient } from "@prisma/client"
import { CreateAuthDto, CreateCompleteAuthDto } from '../../types/auth';
import { CreateUserDto } from '../../types/user';
import { UserService } from './user.service';
import bcrypt from 'bcrypt'

export class AuthService {
  private prisma
  private userService

  constructor() {
    this.prisma = new PrismaClient()
    this.userService = new UserService()
  }

  async getAll(): Promise<Auth[]> {
    const auths = await this.prisma.auth.findMany({ include: { user: true } })
    return auths
  }

  async getOne(id: number): Promise<Auth> {
    const auth = await this.prisma.auth.findFirst({ where: { id }, include: { user: true } })
    if (!auth) {
      throw boom.notFound('Auth not found')
    }
    return auth
  }

  async create(data: CreateCompleteAuthDto): Promise<Auth> {
    // create user
    const userData: CreateUserDto = {
      name: data.name,
      phone: data.phone
    }
    const user = await this.userService.create(userData)

    //create auth
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const authData: CreateAuthDto = {
      email: data.email,
      password: hashedPassword,
      role: data.role,
    }

    const auth = await this.prisma.auth.create({
      data: {
        ...authData,
        userId: user.id
      },
      include: {
        user: true
      }
    })

    //return user
    return auth
  }
}