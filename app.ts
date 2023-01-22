import { useGraphql } from './src/graphql/index';
import express from 'express'

export const createApp = async () => {
  const app = express()

  require('./src/auth')

  await useGraphql(app)

  return app
}