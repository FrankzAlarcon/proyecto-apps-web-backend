import { useGraphql } from './src/graphql/index';
import express from 'express'

export const createApp = async () => {
  const app = express()
  app.use(express.json())

  await useGraphql(app)

  return app
}