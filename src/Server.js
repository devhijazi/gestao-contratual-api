const express = require('express')
const bodyParser = require('body-parser')
const cookies = require('cookies')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const { Loaders, Loader, ServerLogs } = require('./')

module.exports = class Server extends ServerLogs {
  constructor () {
    super()

    this.database = null
    this.controllers = null

    this.app = express()
  }

  initApi () {
    const promises = ['openServer', 'initLoaders']
    return Promise.all(
      promises.map(promise => this[promise] && this[promise]())
    )
  }

  openServer () {
    const PORT = process.env.PORT || 3333

    this.app
      .use(cors())
      .use(this.morganLog)
      .use(cookieParser())
      .use(bodyParser.json())
      .use(cookies.express(['some', 'random', 'keys']))
      .unsubscribe(bodyParser.urlencoded({ extended: true }))
      .listen(PORT, () =>
        this.log(`Escutando na porta "${PORT}"`, { tags: ['LISTEN'] })
      )

    return true
  }

  async initLoaders () {
    for (let ModuleLoader of Object.values(Loaders)) {
      if (ModuleLoader.prototype instanceof Loader) {
        try {
          ModuleLoader = new ModuleLoader(this)
          await ModuleLoader.load().then(() =>
            this.log('Módulos executados com sucesso!', {
              tags: ['LOADERS', ModuleLoader.name]
            })
          )
        } catch (err) {
          this.log(true, err.stack || err, {
            tags: ['LOADERS', ModuleLoader.name]
          }) // mostra o erro do loader
        }
      }
    }
  }
}
