import { CompleteUser, PayloadToken, SignedToken } from './../../types/auth.d'
import boom from '@hapi/boom'
import { Auth, PrismaClient } from '@prisma/client'
import { CreateAuthDto, CreateCompleteAuthDto } from '../../types/auth'
import { CreateUserDto } from '../../types/user'
import { UserService } from './user.service'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { generateToken } from '../libs'
import { Message } from '../../types'
import { EmailService } from '../libs/Email'

export class AuthService {
  private readonly prisma
  private readonly userService
  private readonly emailService

  constructor () {
    this.prisma = new PrismaClient()
    this.userService = new UserService()
    this.emailService = new EmailService()
  }

  async getAll (): Promise<Auth[]> {
    const auths = await this.prisma.auth.findMany({ include: { user: true } })
    return auths
  }

  async getOne (id: number): Promise<Auth> {
    const auth = await this.prisma.auth.findFirst({ where: { id }, include: { user: true } })
    if (!auth) {
      throw boom.notFound('Auth not found')
    }
    return auth
  }

  // async getByEmail(email: string) {
  //   const authUser = await this.prisma.auth.findFirst({ where: { email }, include: { user: true } })
  //   if (!authUser) {
  //     throw boom.notFound('Auth user not found')
  //   }
  //   return authUser
  // }

  async login (email: string, password: string): Promise<CompleteUser> {
    const authUser = await this.prisma.auth.findFirst({ where: { email }, include: { user: true } })
    if (!authUser) {
      throw boom.notFound('Auth user not found')
    }
    const isMatch = await bcrypt.compare(password, authUser.password)
    if (!isMatch) {
      throw boom.unauthorized('Invalid Credentials')
    }
    const { password: pass, ...restOfData } = authUser
    return restOfData
  }

  async signToken (user: CompleteUser): Promise<SignedToken> {
    const payloadToken: PayloadToken = {
      role: user.role,
      sub: user.id
    }

    const accessToken = jwt.sign(payloadToken, config.jwtSecret as string)

    return {
      access_token: accessToken,
      auth: user
    }
  }

  async create (data: CreateCompleteAuthDto): Promise<Auth> {
    // create user
    const userData: CreateUserDto = {
      name: data.name,
      phone: data.phone
    }
    const user = await this.userService.create(userData)

    // create auth
    const hashedPassword = await bcrypt.hash(data.password, 10)

    const authData: CreateAuthDto = {
      email: data.email,
      password: hashedPassword,
      role: data.role
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

    // return user
    return auth
  }

  async validateToken (token: string): Promise<boolean> {
    const user = await this.prisma.auth.findFirst({ where: { token } })
    if (!user) {
      return false
    }
    return true
  }

  async requestRecoveryPassword (email: string): Promise<Message> {
    const user = await this.prisma.auth.findFirst({ where: { email } })
    if (!user) {
      throw boom.notFound('User not found')
    }
    const token = generateToken()

    const userWithToken = await this.prisma.auth.update({
      where: { id: user.id },
      data: { token },
      include: { user: true }
    })

    // Enviar emails con el link para recovery password
    const response = await this.emailService.sendRecoveryPassword(userWithToken)

    if (!response) {
      throw boom.badRequest('Something went wrong')
    }

    return {
      message: 'Token generated successfully'
    }
  }

  async updatePassword (token: string, data: { password: string }): Promise<boolean> {
    const user = await this.prisma.auth.findFirst({ where: { token } })
    if (!user) {
      throw boom.notFound('User not found')
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const updatedUser = await this.prisma.auth.update({
      where: { id: user.id },
      data: { password: hashedPassword, token: '' }
    })

    if (!updatedUser) {
      return false
    }

    return true
  }
}
