const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

//algumas possiveis integrações kk
const someIntegrationsNames = {
    'google': 'Google'
}

  const integrationSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    fullDisplayName: {
      type: String
    },
    integration: {
      type: Object,
      required: true
    }
  })
  
  const userSchema = new Schema({
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      select: false
    },
  })
  
  userSchema.pre('save', async function (next) {
    if(!this.password) return next()
    
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next()
  })
  
  integrationSchema.pre('save', function (next) {
    if (!someIntegrationsNames[this.name]) throw new Error('Integration name invalid!');
    this.name = someIntegrationsNames[this.name]
    next()
  })
  
  module.exports = model('User', userSchema);