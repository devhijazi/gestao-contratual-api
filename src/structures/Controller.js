module.exports = class Controller {
  constructor (app, name) {
    this.app = app
    this.name = name

    this.database = app && app.database
  }

  start () {}
  async saveUser ({ email, integration, password, username, createdBy }) {
    const hasUser = await this.database.users.findGet({ email })

    if (hasUser) return null
    else {
      const registerUser = await this.database.users.add({
        email,
        password,
        username,
        integrations: integration,
        account: { createdBy }
      })
      return registerUser
    }
  }

  getUser (entity) {
    return this.database.users.findGet(entity)
  }
}
