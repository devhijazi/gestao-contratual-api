const { Schema, model } = require('mongoose')

const AdminSchema = new Schema({
  password: String,
  email: String,
  name: String
})

module.exports = model('Admin', AdminSchema)
