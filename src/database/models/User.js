const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

//algumas possiveis integrações kk
const someIntegrationsNames = {
    'google': 'Google'
}

const changeLogsSchema = new Schema({
    state: {
      type: Date,
      default: Date.now()
    },
    log: {
      type: String,
      required: true,
    }
  })
  
  const accountSchema = new Schema({
    createdBy: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    lastChange: {
      type: Date,
      default: Date.now()
    },
    changeLogs: [changeLogsSchema]
  })
  
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
  
  const tokenSchema = new Schema({
    createdAt: {
      type: Date,
      default: Date.now()
    },
    value: {
      type: String,
      required: true,
      select: false
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
    description:{
      type:String,
      required:true
    },
    account: accountSchema,
    integrations: [integrationSchema],
    tokens: [tokenSchema]

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