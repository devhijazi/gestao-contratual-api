const { Schema, model } = require('mongoose')

const InfoSchema = new Schema({
  name: String,
  description: String,
  dateStart: Date,
  dateEnd: Date,
  obs: String
})

module.exports = model('Info', InfoSchema)
