module.exports = {
  // Loaders
  Loaders: require('./loaders'),

  // Banco de dados
  mongoDB: require('./database/MongoDB.js'),

  // utils
  ServerLogs: require('./utils/ServerLogs.js'),

  // Estrututas ( structures)
  Controller: require('./structures/Controller.js'),
  Loader: require('./structures/Loader.js'),

  // Rotas ( router )
  Router: require('./router/Router.js'),
  Controllers: Object.values(require('require-dir')('./router/controllers'))
}
