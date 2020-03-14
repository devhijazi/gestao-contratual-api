const { Router } = require('express')

const Controller = require('../../structures/Controller.js')

const { ContractSchema } = require('../../utils/Schemas.js')

const authorizationMiddleware = require('../middlewares/hasLogged.js')

const MAX_CONTRACTS_PAGE = 18
const DAYS_MS = 2678400000

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
      const parsedContracts = this.parseContracts(contracts, req)

      return res.json(parsedContracts)
    })

    router.get('/due', async (req, res) => {
      const contracts = await database
        .findAll()
        .then(contracts =>
          contracts.filter(contract => Date.now() + DAYS_MS >= contract.finalAt)
        )
      const parsedContracts = this.parseContracts(contracts, req)

      return res.json(parsedContracts)
    })

    router.get('/:contractID', async (req, res) => {
      const id = req.params.contractID

      try {
        if (!id) return res.status(400).json({ error: 'Missing content' })

        const contract = await database.findOne(id)
        if (!contract) return res.json({ error: 'No contract in database' })
        return res.json({ contract })
      } catch (e) {
        return res.status(403).json({ error: 'An error has ocurred' })
      }
    })

    // Router post adiciona um novo contrato na database
    router.post('/', async (req, res) => {
      const { name, description, email, finalAt, createdAt, ...rest } = req.body

      try {
        const { error, value } = ContractSchema.validate({
          name,
          email,
          description,
          finalAt,
          createdAt
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

        const { name, email, finalAt, description, createdAt, ...rest } = form

        const { error, value } = ContractSchema.validate({
          name,
          email,
          finalAt,
          description,
          createdAt
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

  parseContracts (contracts, req) {
    const page = Number(req.query.page)

    const pages = parseInt(contracts.length / MAX_CONTRACTS_PAGE)
    const contractsMaxPage = contracts.length === MAX_CONTRACTS_PAGE ? 0 : pages

    const inPage = parseInt(
      (!isNaN(page) && page <= contractsMaxPage && page) || 0
    )

    return {
      inPage,
      pages: contractsMaxPage,
      lenght: contracts.length,
      contracts: contracts
        .slice(MAX_CONTRACTS_PAGE * inPage)
        .slice(0, MAX_CONTRACTS_PAGE)
    }
  }
}
