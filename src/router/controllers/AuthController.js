const { Router } = require('express')
const jwt = require('jsonwebtoken')

const Controller = require('../../structures/Controller.js')

module.exports = class AuthController extends Controller {
  constructor (app) {
    super(app, 'AuthController')
  }

  start () {
    const router = Router()

    router.get('/', async (req, res) => {
      const { email, password } = req.query
      if (!(email && password)) return res.status(400).json({})

      const database = this.database
      const admin = await database.admins.findGet({ email, password })
      if (!admin) return res.status(401).json({})

      return res.json({
        token: jwt.sign({ user: admin }, process.env.JWT_TOKEN),
        user: admin
      })
    })

    return this.app.use('/auth', router)
  }
}
