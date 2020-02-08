module.exports = class Loader {
    constructor(name, client){
        this.name = name

        this.client = client
        this.app = client.app
    }
    load(){
        return true
    }
    asJSON(){
        return{
            ...this.client,
            ...this.app
        }
    }
}