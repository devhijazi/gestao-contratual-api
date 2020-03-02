const Loader = require('../structures/Loader.js')
const Router = require('../router/Router.js')
const Controllers = require('require-dir')('../router/controllers')

module.exports = class LoaderRouter extends Loader {
  constructor (server) {
    super('LoaderRouter', server)
  }

  async load () {
    this.client.controllers = await this.initRouter()
    return true
  }

  initRouter () {
    const registerRouter = new Router(this.client, Controllers)
    return registerRouter.register().then(controllers => {
      this.client.log(
        `Executados "[${controllers.length}]" de "[${
          Object.values(Controllers).length
        }]" Controladores`,
        { tags: ['ROUTER'] }
      )
      return true
    })
  }
}
