import { User } from './user'

type Role = 'CUSTOMER' | 'ADMIN'

interface CompleteAuth {
  id: number
  name: string
  phone: string
  email: string
  password: string
  role: Role
}

export type CreateAuthDto = Pick<CompleteAuth, 'email' | 'password' | 'role'>

export type CreateCompleteAuthDto = Omit<CompleteAuth, 'id'>

export interface PayloadToken {
  sub: number
  role: Role
}

export interface SignedToken {
  access_token: string
  auth: CompleteUser
}

export interface CompleteUser {
  id: number
  email: string
  token: string | null
  role: Role
  userId: number
  user: User
}

export interface Login { email: string, password: string }
