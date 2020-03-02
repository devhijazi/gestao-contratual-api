module.exports = class Controller {
  constructor (app, name) {
    this.app = app
    this.name = name

    this.database = app && app.database
  }

  start () {}
}
