import { resolve } from 'path'
import { readFileSync } from 'fs'
import yaml from 'yaml'
import parseRoutes from '../routes/parseRoutes'
const pkg = require(resolve('./package.json'))

const routeDefs = yaml.parse(
  readFileSync(
    resolve(__dirname, '../routes/routerDefs.yaml'),
    { encoding: 'utf8' }
  )
)

export const redirectToRoot = (req, res) => {
  res.redirect('/')
}

const groupedRoutes = {}
parseRoutes(routeDefs.routes, { middleware: [], path: '' })
  .map(route => {
    return {
      ...route.controller,
      path: route.path,
      middlewares: route.middlewares,
      method: route.method
    }
  })
  .forEach(route => {
    if (!groupedRoutes[route.group]) groupedRoutes[route.group] = []
    groupedRoutes[route.group].push(route)
  }, {})

export const serverInfo = (req, res) => {
  res.render('serverInfo.pug', {
    timestamp: new Date().getTime(),
    version: pkg.version,
    description: pkg.description,
    routeDefs: groupedRoutes
  })
}

export const serverInfoJson = (req, res) => {
  res.json({
    timestamp: new Date().getTime(),
    version: pkg.version,
    description: pkg.description
  })
}
