const transformProps = require('transform-props')
const DefaultRepository = require('./DefaultRepository.js')

const castToString = arg => String(arg)

module.exports = class MongoRepository extends DefaultRepository {
  constructor (mongoose, model) {
    super()

    if (!mongoose || !model) {
      throw new Error('Modelo do banco de dados não pode ser nulo.')
    }

    this.mongoose = mongoose
    this.model = model
  }

  parse (entity) {
    return entity
      ? transformProps(
        entity.toObject({ versionKey: false }),
        castToString,
        '_id'
      )
      : null
  }

  add (entity) {
    return this.model.create(entity).then(this.parse)
  }

  findGet (entity) {
    return this.model.findOne(entity).then(this.parse)
  }

  findOne (id, projection) {
    return this.model.findById(id, projection).then(this.parse)
  }

  findAll (projection) {
    return this.model.find({}, projection).then(e => e.map(this.parse))
  }

  get (id, projection) {
    return this.findOne(id, projection).then(this.parse)
  }

  remove (id) {
    return this.model.deleteOne({ _id: id })
  }

  update (id, entity, options = { upsert: true }) {
    return this.model.updateOne({ _id: id }, entity, options)
  }
}
