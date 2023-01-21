import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import { loadFiles } from '@graphql-tools/load-files'
import { resolvers } from './resolvers'
import { Express } from 'express';


export const useGraphql = async (app: Express) => {
  const server = new ApolloServer({
    typeDefs: await loadFiles("./src/**/*.graphql"),
    resolvers,
    plugins: [ApolloServerPluginLandingPageLocalDefault]
  })

  await server.start()

  server.applyMiddleware({ app })

  return server
} 