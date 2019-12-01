import { resolve } from 'path'
import express from 'express'
import router from './routes'

const app = express()

app.use(router)
app.set('views', resolve('./src/views'))

app.listen(config.PORT, () => {
  console.log('Server online on', `${config.PORT}`.magenta)
})
