const Loader = require('../structures/Loader.js');

const MongoDb = require('../database/MongoDB.js');

module.exports = class DatabaseLoader extends Loader {
    constructor(server) {
        super('DatabaseLoader/Banco de Dados', server)


        this.database = new MongoDb()
    }

    async load() {
        this.client.database = await this.database
            .connect()
            .then(db => {
                this.app.database = db
            })
        return true
    }
}