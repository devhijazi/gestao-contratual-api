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

ContractSchema.pre('save', next => {
  this.createdAt = (this.createdAt && new Date(this.createdAt)) || new Date()
  this.finalAt = new Date(this.createdAt)
  next()
})

module.exports = model('Contract', ContractSchema)
