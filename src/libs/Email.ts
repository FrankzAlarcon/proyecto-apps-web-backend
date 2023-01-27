import { Auth } from '@prisma/client'
import nodemailer from 'nodemailer'
import { User } from '../../types/user'
import { config } from '../config'

type AuthUser = Auth & {
  user: User
}

export class EmailService {
  private readonly transporter

  constructor () {
    this.transporter = nodemailer.createTransport({
      host: config.emailHost,
      port: 465,
      secure: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPass
      }
    })
  }

  async sendRecoveryPassword (user: AuthUser): Promise<boolean> {
    const { email, token, user: { name } } = user

    if (!token || !email || !name) {
      return false
    }

    if (!config.frontendUrl) {
      return false
    }

    await this.transporter.sendMail({
      from: '"Barbershop - Peluquería y Barbería" <cuentas@barbershop.com>',
      to: email,
      subject: 'Barbershop - Reestablece tu contraseña',
      text: 'Reestablece tu contraseña en Barbershop',
      html: `<p>Hola: ${name}. Has solicitado reestablecer tu contraseña.</p>
      <p>Sigue el siguiente enlace para crear una nueva contraseña</p>
      <a href="${config.frontendUrl}/src/views/change-password.html?token=${token}" target="_blank"/>
        Reestablecer contraseña
      </a>
      <p>Si tu no solicitaste el cambio de contraseña puedes ignorar este mensaje</p>`
    })

    return true
  }
}
