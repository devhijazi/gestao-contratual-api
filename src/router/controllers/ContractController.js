const { Router } = require('express')

const Controller = require('../../structures/Controller.js')

const { ContractSchema } = require('../../utils/Schemas.js')

const authorizationMiddleware = require('../middlewares/hasLogged.js')

module.exports = class ContractController extends Controller {
  constructor (app) {
    super(app, 'ContractController')
  }

  start () {
    const router = Router()
    const database = this.database.contracts

    router.use(authorizationMiddleware)

    router.post('/', async (req, res) => {
      const { name, description, email, finalAt, ...rest } = req.body

      try {
        const { error, value } = await ContractSchema.validate({
          name,
          email,
          description,
          finalAt
        })
        if (error) {
          const errorMessage = error.details[0].message.replace(/"/g, "'")
          return res.status(400).json({ error: errorMessage })
        }

        await database.add({
          ...value,
          ...rest,
          createdBy: req.user._id
        })
        return res.json({ ok: true })
      } catch (e) {
        console.log(e)
        return res.status(403).json({ error: 'Missing content' })
      }
    })

    return this.app.use('/contract', router)
  }
}
