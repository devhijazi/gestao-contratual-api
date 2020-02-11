const mongoose = require('mongoose');
const userSchema = require('./models/User.js');
const AdminSchema = require('./models/Admin.js');
const Repository = require('./repository/Repository.js')

//CONECTA AO BANCO DE DADOS

module.exports = class MongoDB {
    constructor() {
        this.mongoose = mongoose
        mongoose.Promise = global.Promise;
    }
    async connect() {
        return mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        }).then((m) => {
            this.users = new Repository(m, userSchema)
            this.admins = new Repository(m,AdminSchema)
            return this
        })
    }
}