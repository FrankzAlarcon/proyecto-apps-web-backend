import { Strategy } from 'passport-local'
import { AuthService } from '../../services/auth.service'

const authService = new AuthService()

export const LocalStrategy = new Strategy({
  usernameField: 'email',
  passwordField: 'password'
},
async (email, password, done) => {
  try {
    const authUser = await authService.login(email, password)
    done(null, authUser)
  } catch (error) {
    done(error, false)
  }
})
