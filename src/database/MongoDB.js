const mongoose = require('mongoose')

const Repository = require('./repository/Repository.js')

const ContractSchema = require('./models/Contract.js')
const AdminSchema = require('./models/Admin.js')

// CONECTA AO BANCO DE DADOS

module.exports = class MongoDB {
  constructor () {
    this.mongoose = mongoose
    mongoose.Promise = global.Promise
  }

  async connect () {
    return mongoose
      .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
      })
      .then(m => {
        this.admins = new Repository(m, AdminSchema)
        this.contracts = new Repository(m, ContractSchema)
        return this
      })
  }
}
