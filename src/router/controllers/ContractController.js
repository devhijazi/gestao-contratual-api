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

    // Router get lista todos os contratos adicionados na database
    router.get('/', async (req, res) => {
      const contracts = await database.findAll()
      return res.json({ contracts })
    })
    // Router post adiciona um novo contrato na database
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
        return res.status(403).json({ error: 'An error has ocurred' })
      }
    })
    // deleta um contrato usando o ID
    router.delete('/:contractID', async (req, res) => {
      const id = req.params.contractID

      try {
        if (!id) return res.status(400).json({ error: 'Missing content' })

        await database.remove(id)
        return res.status(200).json('Contrato deletado com sucesso')
      } catch (e) {
        return res.status(403).json({ error: 'An error has ocurred' })
      }
    })
    // edita as informações do contrato
    router.put('/:contractID', async (req, res) => {
      const id = req.params.contractID
      const form = req.body

      try {
        if (!id) return req.status(400).json({ error: 'Missing Content' })

        const { name, email, finalAt, description, ...rest } = form

        const { error, value } = await ContractSchema.validate({
          name,
          email,
          finalAt,
          description
        })
        if (error) {
          const errorMessage = error.details[0].message.replace(/"/g, "'")
          return res.status(400).json({ error: errorMessage })
        }

        const contract = await database.findOne(id)
        if (!contract) {
          return res.status(400).json({ error: 'No contract in database' })
        }

        await database.update(id, {
          ...rest,
          ...value
        })
        return res.json({ ok: true })
      } catch (e) {
        return res.status(403).json({ error: 'An error has ocurred' })
      }
    })

    return this.app.use('/contracts', router)
  }
}
