import { Request } from 'express'
import { PassportContext } from 'graphql-passport'
import { JwtPayload } from 'jsonwebtoken'

export interface ID {
  id: number
}

export type JwtContext = PassportContext<JwtPayload, { session: boolean }, Request>

export interface Message {
  message: string
}

interface NewPassword {
  password: string
}

export interface RecoveryPassword {
  token: string
  data: NewPassword
}
