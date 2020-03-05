const { Schema, model } = require('mongoose')

const ContractSchema = new Schema({
  contact: String,
  createdBy: String,
  description: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    unique: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  finalAt: {
    type: Date,
    required: true
  }
})

module.exports = model('Contract', ContractSchema)
