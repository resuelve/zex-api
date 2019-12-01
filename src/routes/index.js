import { readFileSync } from 'fs'
import { resolve } from 'path'
import express from 'express'
import yaml from 'yaml'
import controllers from '../controllers'
import parseRoutes from './parseRoutes'

const router = express.Router()

router.use(express.json())
router.use(express.urlencoded({ extended: false }))
router.use((req, res, next) => {
  console.info(
    req.method,
    req.protocol,
    req.get('host'),
    req.originalUrl
  )
  next()
})

const routeDefs = yaml.parse(
  readFileSync(
    resolve(__dirname, 'routerDefs.yaml'),
    { encoding: 'utf8' }
  )
)

parseRoutes(routeDefs.routes, { middleware: [], path: '' })
  .forEach(({ method, path, middlewares, controller }) => {
    const parsedMiddlewares = middlewares
      .map(({ controller }) => controller.split('.'))
      .map(([ctrl, fn]) => controllers[ctrl][fn])
    const parsedController = [controller]
      .map(({ controller }) => controller.split('.'))
      .map(([ctrl, fn]) => controllers[ctrl][fn])
    router[method](path, parsedMiddlewares, parsedController)
  })

export default router
