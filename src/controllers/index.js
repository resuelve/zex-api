import { readdirSync } from 'fs'
import { resolve } from 'path'

const controllers = readdirSync(resolve(__dirname))
  .filter(fileName => fileName.slice(-3) === '.js')
  .filter(fileName => fileName !== 'index.js')
  .map(fileName => fileName.split('.'))
  .map(([controller]) => {
    const actions = require(`./${controller}`)
    const def = {}
    def[controller] = actions
    return def
  })
  .reduce((acum, current) => {
    return Object.assign(acum, current)
  }, {})

export default controllers
