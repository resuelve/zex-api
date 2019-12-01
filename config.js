const util = require('util')
const path = require('path')
const { EventEmitter } = require('events')
const env = require('dotenv')
require('consolecolors')

env.config({ path: path.resolve('./secrets/.env') })

class Logger extends EventEmitter {
  constructor () {
    super()
    const types = {
      log: 'green',
      info: 'blue',
      debug: 'magenta',
      warning: 'yellow',
      error: 'red'
    }
    Object.keys(types).forEach(type => {
      this[type] = (...args) => {
        const logType = `       ${type}`.slice(-7).toUpperCase()
        this.emitLog(`[${logType}]`, types[type], ...args)
      }
      console[type] = this[type]
    })
  }

  emitLog (type, color, ...args) {
    const row = util.format(...args)
    process.stdout.write(type[color] + ' ' + row + '\n')
    const message = {
      key: `logs-${process.hrtime().join()}`,
      value: {
        timestamp: new Date(),
        type,
        message: row
      }
    }
    this.emit('message', message)
  }
}

global.logger = new Logger()
global.config = { ...process.env }
