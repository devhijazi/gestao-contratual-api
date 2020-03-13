const { Router } = require('express')

const Controller = require('../../structures/Controller.js')

const { AdminSchema } = require('../../utils/Schemas.js')

const authorizationMiddleware = require('../middlewares/hasLogged.js')

module.exports = class AdminController extends Controller {
  constructor (app) {
    super(app, 'AdminController')
  }

  start () {
    const router = Router()
    const database = this.database.admins

    router.post('/', async (req, res) => {
      const { email, name, password, ...rest } = req.body

      try {
        const { error, value } = AdminSchema.validate({
          email,
          name,
          password
        })
        if (error) {
          const errorMessage = error.details[0].message.replace(/"/g, "'")
          return res.status(400).json({ error: errorMessage })
        }
        await database.add({
          ...value,
          ...rest
        })
        return res.json({ ok: true })
      } catch (e) {
        return res.status(403).json({ error: 'Missing content' })
      }
    })

    // Verifica se ta autenticado
    router.use(authorizationMiddleware)

    router.get('/@me', async (req, res) => {
      const user = await database.findOne({ _id: req.user.user._id })
      if (!user) return res.status(400).json()

      return res.json({ user })
    })

    return this.app.use('/admin', router)
  }
}
