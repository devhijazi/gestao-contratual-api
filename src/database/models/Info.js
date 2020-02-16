const { Schema, model } = require("mongoose");

const infoSchema = new Schema({
  name: String,
  description: String,
  dateStart: Date,
  dateEnd: Date,
  obs: String
});
module.exports = model("Info", infoSchema);
