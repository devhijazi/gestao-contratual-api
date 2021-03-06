const ClientController = require('../structures/Controller.js')

module.exports = class Router {
  constructor (client, controllers) {
    this.client = client
    this.app = client.app
    this.controllers = Object.values(controllers)
    this.controllersLoades = []
  }

  register () {
    return Promise.all(
      this.controllers.map(Controller => {
        if (Controller.prototype instanceof ClientController) {
          Controller = new Controller(this.app)
          Controller.start()
          return Controller
        } else return null
      })
    )
      .then(c => this.initServerError() && c)
      .then(controllersLoadeds => {
        controllersLoadeds = controllersLoadeds.filter(controller => controller)
        this.controllersLoades.push(...controllersLoadeds)
        return controllersLoadeds
      })
  }

  initServerError () {
    return this.app.use((err, req, res, next) => {
      if (err.stack) {
        this.client.log(true, err.stack, {
          tags: ['SERVER ERROR', req.method.toUpperCase()]
        })
      }

      res.locals.message = err.message
      res.locals.error = req.app.get('env') === 'development' ? err : {}

      next()
    })
  }
}
