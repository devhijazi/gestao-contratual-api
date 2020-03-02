const { Router } = require('express')

const Controller = require('../../structures/Controller.js')

const authorizationMiddleware = require('../middlewares/hasLogged.js')

module.exports = class AdminController extends Controller {
  constructor (app) {
    super(app, 'AdminController')
  }

  start () {
    const router = Router()
    const database = this.database.admins

    router.use(authorizationMiddleware)

    router.get('/@me', async (req, res) => {
      const user = await database.findOne({ _id: req.user.user._id })
      if (!user) return res.status(400).json()

      return res.json({ user })
    })

    return this.app.use('/admin', router)
  }
}
