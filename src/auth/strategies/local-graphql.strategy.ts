import { GraphQLLocalStrategy } from 'graphql-passport'
import { AuthService } from '../../services/auth.service'

const authService = new AuthService()

export const GraphqlLocalStrategy = new GraphQLLocalStrategy(
  async (email, password, done) => {
    try {
      const authUser = await authService.login(email as string, password as string)
      done(null, authUser)
    } catch (error) {
      done(error, false)
    }
  }
)