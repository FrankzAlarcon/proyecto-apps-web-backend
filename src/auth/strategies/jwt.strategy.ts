import { PayloadToken } from './../../../types/auth.d';
import { Strategy, ExtractJwt } from 'passport-jwt'
import { config } from '../../config'

export const JwtStrategy = new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
}, (payload: PayloadToken, done) => {
  done(null, payload)
})