import { UserService } from './../services/user.service'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core'
import { ApolloServer, ExpressContext } from 'apollo-server-express'
import { loadFiles } from '@graphql-tools/load-files'
import { resolvers } from './resolvers'
import { Express } from 'express'
import { buildContext } from 'graphql-passport'

export const useGraphql = async (app: Express): Promise<ApolloServer<ExpressContext>> => {
  const server = new ApolloServer({
    typeDefs: await loadFiles('./src/**/*.graphql'),
    resolvers,
    context: ({ req, res }) => buildContext({ req, res, UserService }),
    plugins: [ApolloServerPluginLandingPageLocalDefault]
  })

  await server.start()

  server.applyMiddleware({ app })

  return server
}
