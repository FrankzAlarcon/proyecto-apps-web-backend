import { useGraphql } from './src/graphql/index'
import express, { Express } from 'express'

export const createApp = async (): Promise<Express> => {
  const app = express()

  require('./src/auth')

  await useGraphql(app)

  return app
}
