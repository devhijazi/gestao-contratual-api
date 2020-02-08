const mongoose = require('mongoose');
const userSchema = require('./models/User.js');
const Repository = require('./repository/Repository.js')

//CONECTA AO BANCO DE DADOS

module.exports = class MongoDB {
    constructor() {
        this.mongoose = mongoose
        mongoose.Promise = global.Promise;
    }
    async connect() {
        return mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        }).then((m) => {
            this.users = new Repository(m, userSchema)
            return this
        })
    }
}